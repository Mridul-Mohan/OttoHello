import { createClient } from '@supabase/supabase-js';

// Use environment variables - no fallback to prevent using invalid keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 20 chars):', supabaseKey.substring(0, 20) + '...');

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
      console.log('Fetching checked-in visitors...');
      const { data, error } = await supabase
        .from('visitors')
        .select(`
          *,
          employees(name)
        `)
        .eq('status', 'checked_in')
        .order('checked_in_at', { ascending: false });
    
      if (error) {
        console.error('Error fetching checked-in visitors:', error);
        // Return empty array instead of throwing to prevent UI crashes
        return [];
      }
    
      console.log('Raw visitor data:', data);
      
      // Map the data to include person_to_meet from the joined employee data
      return (data || []).map(visitor => ({
        ...visitor,
        person_to_meet: visitor.person_to_meet || 'Unknown'
      }));
    } catch (error) {
      console.error('Database connection error:', error);
      return [];
    }
  },

  async checkInVisitor(visitor: {
    full_name: string;
    person_to_meet_id?: string;
    person_to_meet: string;
    reason_to_visit: string;
    phone_number: string;
    photo_url?: string;
  }): Promise<void> {
    try {
      console.log('Attempting to check in visitor:', visitor);
      
      // Validate required fields
      if (!visitor.full_name?.trim()) {
        throw new Error('Full name is required');
      }
      if (!visitor.person_to_meet?.trim()) {
        throw new Error('Person to meet is required');
      }
      if (!visitor.reason_to_visit?.trim()) {
        throw new Error('Reason for visit is required');
      }
      if (!visitor.phone_number?.trim()) {
        throw new Error('Phone number is required');
      }

      const { data, error } = await supabase
        .from('visitors')
        .insert([{
          full_name: visitor.full_name,
          person_to_meet: visitor.person_to_meet,
          person_to_meet_id: visitor.person_to_meet_id || null,
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

  async syncSlackEmployees(): Promise<void> {
    try {
      console.log('Starting Slack sync...');
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-slack-employees`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Sync response error:', errorText);
        throw new Error(`Failed to sync Slack employees: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Slack sync result:', result);
      return result;
    } catch (error) {
      console.error('Error syncing Slack employees:', error);
      throw error;
    }
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