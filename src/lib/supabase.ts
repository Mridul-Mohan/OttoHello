import { createClient } from '@supabase/supabase-js';

// FIXED: Use the correct URL and API key that match your project
const supabaseUrl = 'https://ziqmutjhoxguplitywdb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppcW11dGpob3hndXBsaXR5d2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTI2OTMsImV4cCI6MjA2NzI4ODY5M30.fKLefwnPe5KAGBXilmlJAE3Q0cXGE9spqC7gfHmlhN0';

console.log('🔗 Supabase config:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length,
  keyValid: supabaseAnonKey.startsWith('eyJ'),
  urlMatch: supabaseUrl.includes('ziqmutjhoxguplitywdb')
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection immediately
supabase.from('employees').select('count').limit(1).then(
  result => console.log('✅ Supabase connection test:', result),
  error => console.error('❌ Supabase connection failed:', error)
);

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
  slack_id?: string;
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
      console.log('🔍 Fetching checked-in visitors...');
      
      const { data, error } = await supabase
        .from('visitors')
        .select(`
          *,
          employees(name)
        `)
        .eq('status', 'checked_in')
        .order('checked_in_at', { ascending: false });
    
      if (error) {
        console.error('❌ Error fetching checked-in visitors:', error);
        return [];
      }
    
      console.log('✅ Raw visitor data:', data);
      
      return (data || []).map(visitor => ({
        ...visitor,
        person_to_meet: visitor.person_to_meet || 'Unknown'
      }));
    } catch (error) {
      console.error('💥 Database connection error:', error);
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
      console.log('🚀 Attempting to check in visitor:', visitor);
      
      // Validate required fields
      const validationErrors = [];
      if (!visitor.full_name?.trim()) validationErrors.push('Full name is required');
      if (!visitor.person_to_meet?.trim()) validationErrors.push('Person to meet is required');
      if (!visitor.reason_to_visit?.trim()) validationErrors.push('Reason for visit is required');
      if (!visitor.phone_number?.trim()) validationErrors.push('Phone number is required');

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const insertData = {
        full_name: visitor.full_name.trim(),
        person_to_meet: visitor.person_to_meet.trim(),
        person_to_meet_id: visitor.person_to_meet_id || null,
        reason_to_visit: visitor.reason_to_visit.trim(),
        phone_number: visitor.phone_number.trim(),
        photo_url: visitor.photo_url || null,
        checked_in_at: new Date().toISOString(),
        status: 'checked_in'
      };

      console.log('📝 Insert data:', insertData);

      const { data, error } = await supabase
        .from('visitors')
        .insert([insertData])
        .select();
    
      if (error) {
        console.error('❌ Error checking in visitor:', error);
        throw new Error(`Check-in failed: ${error.message}`);
      }
      
      console.log('✅ Visitor checked in successfully:', data);
    } catch (error) {
      console.error('💥 Database connection error during check-in:', error);
      throw error;
    }
  },

  async checkOutVisitor(id: string): Promise<void> {
    try {
      console.log('🚪 Checking out visitor:', id);
      
      const { error } = await supabase
        .from('visitors')
        .update({ 
          status: 'checked_out',
          checked_out_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    
      if (error) {
        console.error('❌ Error checking out visitor:', error);
        throw error;
      }
      
      console.log('✅ Visitor checked out successfully');
    } catch (error) {
      console.error('💥 Error during checkout:', error);
      throw error;
    }
  },

  async getVisitorStats() {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      console.log('📊 Fetching visitor stats for:', today);
      
      const [checkedInResult, totalTodayResult] = await Promise.all([
        supabase.from('visitors').select('id').eq('status', 'checked_in'),
        supabase.from('visitors').select('id')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lt('created_at', `${today}T23:59:59.999Z`)
      ]);

      if (checkedInResult.error) {
        console.error('❌ Error fetching checked-in count:', checkedInResult.error);
        throw checkedInResult.error;
      }
      
      if (totalTodayResult.error) {
        console.error('❌ Error fetching today\'s total:', totalTodayResult.error);
        throw totalTodayResult.error;
      }

      const stats = {
        currentlyCheckedIn: checkedInResult.data?.length || 0,
        totalToday: totalTodayResult.data?.length || 0
      };
      
      console.log('✅ Visitor stats:', stats);
      return stats;
    } catch (error) {
      console.error('💥 Error getting visitor stats:', error);
      return { currentlyCheckedIn: 0, totalToday: 0 };
    }
  }
};

export const employeeAPI = {
  async getEmployees(): Promise<Employee[]> {
    try {
      console.log('👥 Fetching all employees...');
      
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');
    
      if (error) {
        console.error('❌ Error fetching employees:', error);
        throw error;
      }
      
      console.log('✅ Employees fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('💥 Error in getEmployees:', error);
      throw error;
    }
  },

  async searchEmployees(searchTerm: string): Promise<Employee[]> {
    try {
      console.log('🔍 Searching employees for:', searchTerm);
      
      if (!searchTerm?.trim()) {
        return [];
      }

      const { data, error } = await supabase
        .from('employees')
        .select('id, name, role, department')
        .ilike('name', `%${searchTerm.trim()}%`)
        .limit(8);

      if (error) {
        console.error('❌ Employee search failed:', error);
        throw error;
      }

      console.log('✅ Employee search results:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('💥 Error searching employees:', error);
      throw error;
    }
  },

  async getManagers(): Promise<Employee[]> {
    try {
      console.log('👔 Fetching managers...');
      
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('is_manager', true)
        .order('name');
    
      if (error) {
        console.error('❌ Error fetching managers:', error);
        throw error;
      }
      
      console.log('✅ Managers fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('💥 Error in getManagers:', error);
      throw error;
    }
  },

  async recordLateArrival(arrival: {
    employee_name: string;
    reporting_manager: string;
    reason_for_lateness: string;
  }): Promise<void> {
    try {
      console.log('⏰ Recording late arrival:', arrival);
      
      const { error } = await supabase
        .from('late_arrivals')
        .insert([{
          employee_name: arrival.employee_name,
          reporting_manager: arrival.reporting_manager,
          reason_for_lateness: arrival.reason_for_lateness,
          check_in_time: new Date().toISOString()
        }]);
    
      if (error) {
        console.error('❌ Error recording late arrival:', error);
        throw error;
      }
      
      console.log('✅ Late arrival recorded successfully');
    } catch (error) {
      console.error('💥 Error in recordLateArrival:', error);
      throw error;
    }
  }
};