import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Visitor {
  id: string;
  full_name: string;
  person_to_meet: string;
  person_to_meet_id?: string;
  reason_to_visit: string;
  phone_number: string;
  photo_url?: string;
  checked_in_at: string;
  checked_out_at?: string;
  status: 'checked_in' | 'checked_out';
  created_at: string;
  updated_at: string;
}

export interface LateArrival {
  id: string;
  employee_name: string;
  reporting_manager: string;
  reason_for_lateness: string;
  check_in_time: string;
  created_at: string;
}

export interface Employee {
  id: string;
  name: string;
  role?: string;
  department?: string;
  is_manager: boolean;
  created_at: string;
}

// Late arrival reasons enum
export const LATE_ARRIVAL_REASONS = [
  'Woke up Late',
  'Transportation Delay',
  'Manager Approved',
  'Working Late Yesterday',
  'Personal Issue',
  'Health Issue',
  'Weather Issue',
  'Early Morning Office Work'
] as const;

// API functions
export const visitorAPI = {
  async getCheckedInVisitors(): Promise<Visitor[]> {
    try {
      const { data, error } = await supabase
        .from('visitors')
        .select(`
          *,
          employees!visitors_person_to_meet_id_fkey(name)
        `)
        .eq('status', 'checked_in')
        .order('checked_in_at', { ascending: false });
    
      if (error) {
        console.error('Error fetching checked-in visitors:', error);
        throw error;
      }
    
      // Map the data to include person_to_meet from the joined employee data
      return (data || []).map(visitor => ({
        ...visitor,
        person_to_meet: visitor.employees?.name || visitor.person_to_meet || 'Unknown'
      }));
    } catch (error) {
      console.error('Database connection error:', error);
      return [];
    }
  },

  async checkInVisitor(visitor: {
    full_name: string;
    person_to_meet_id: string;
    reason_to_visit: string;
    phone_number: string;
    photo_url?: string;
  }): Promise<void> {
    try {
      console.log('Attempting to check in visitor:', visitor);
      
      const { data, error } = await supabase
        .from('visitors')
        .insert([{
          full_name: visitor.full_name,
          person_to_meet_id: visitor.person_to_meet_id,
          reason_to_visit: visitor.reason_to_visit,
          phone_number: visitor.phone_number,
          photo_url: visitor.photo_url,
          checked_in_at: new Date().toISOString(),
          status: 'checked_in'
        }])
        .select();
    
      if (error) {
        console.error('Error checking in visitor:', error);
        throw error;
      }
      
      console.log('Visitor checked in successfully:', data);
    } catch (error) {
      console.error('Database connection error during check-in:', error);
      throw error;
    }
  },

  async checkOutVisitor(id: string): Promise<void> {
    const { error } = await supabase
      .from('visitors')
      .update({ 
        status: 'checked_out',
        checked_out_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error checking out visitor:', error);
      throw error;
    }
  },

  async getVisitorStats() {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data: checkedIn, error: checkedInError } = await supabase
        .from('visitors')
        .select('id')
        .eq('status', 'checked_in');

      const { data: totalToday, error: totalTodayError } = await supabase
        .from('visitors')
        .select('id')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      if (checkedInError) {
        console.error('Error fetching checked-in count:', checkedInError);
        throw checkedInError;
      }
      
      if (totalTodayError) {
        console.error('Error fetching today\'s total:', totalTodayError);
        throw totalTodayError;
      }

      return {
        currentlyCheckedIn: checkedIn?.length || 0,
        totalToday: totalToday?.length || 0
      };
    } catch (error) {
      console.error('Error getting visitor stats:', error);
      return {
        currentlyCheckedIn: 0,
        totalToday: 0
      };
    }
  }
};

export const employeeAPI = {
  async getEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
    return data || [];
  },

  async getManagers(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('is_manager', true)
      .order('name');
    
    if (error) {
      console.error('Error fetching managers:', error);
      throw error;
    }
    return data || [];
  },

  async recordLateArrival(arrival: {
    employee_name: string;
    reporting_manager: string;
    reason_for_lateness: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('late_arrivals')
      .insert([{
        employee_name: arrival.employee_name,
        reporting_manager: arrival.reporting_manager,
        reason_for_lateness: arrival.reason_for_lateness,
        check_in_time: new Date().toISOString()
      }]);
    
    if (error) {
      console.error('Error recording late arrival:', error);
      throw error;
    }
  }
};