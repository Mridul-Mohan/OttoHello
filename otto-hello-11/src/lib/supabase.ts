import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ziqmutjhoxguplitywdb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zmx5bXB2dGVlbm9jeG12amRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MDQ4ODMsImV4cCI6MjA2NzI4MDg4M30.ZGQoRxHK1yNAAA-4dQPtNxXV_dexi1t5YjrYxXEKrV0';

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
    const { data, error } = await supabase
      .from('visitors')
      .select(`
        *,
        employees!visitors_person_to_meet_id_fkey(name)
      `)
      .eq('status', 'checked_in')
      .order('checked_in_at', { ascending: false });
    
    if (error) throw error;
    
    // Map the data to include person_to_meet from the joined employee data
    return (data || []).map(visitor => ({
      ...visitor,
      person_to_meet: visitor.employees?.name || visitor.person_to_meet || 'Unknown'
    }));
  },

  async checkInVisitor(visitor: {
    full_name: string;
    person_to_meet_id: string;
    reason_to_visit: string;
    phone_number: string;
    photo_url?: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('visitors')
      .insert([{
        full_name: visitor.full_name,
        person_to_meet_id: visitor.person_to_meet_id,
        reason_to_visit: visitor.reason_to_visit,
        phone_number: visitor.phone_number,
        photo_url: visitor.photo_url,
        checked_in_at: new Date().toISOString(),
        status: 'checked_in'
      }]);
    
    if (error) throw error;
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
    
    if (error) throw error;
  },

  async getVisitorStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: checkedIn, error: checkedInError } = await supabase
      .from('visitors')
      .select('id')
      .eq('status', 'checked_in');

    const { data: totalToday, error: totalTodayError } = await supabase
      .from('visitors')
      .select('id')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    if (checkedInError || totalTodayError) throw checkedInError || totalTodayError;

    return {
      currentlyCheckedIn: checkedIn?.length || 0,
      totalToday: totalToday?.length || 0
    };
  }
};

export const employeeAPI = {
  async getEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getManagers(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('is_manager', true)
      .order('name');
    
    if (error) throw error;
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
    
    if (error) throw error;
  }
};