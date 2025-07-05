import { createClient } from 'npm:@supabase/supabase-js@2.50.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get Slack token from environment
    const slackToken = Deno.env.get('SLACK_BOT_TOKEN');
    if (!slackToken) {
      throw new Error('SLACK_BOT_TOKEN environment variable is required');
    }

    const users = [];
    let cursor;

    // Page through Slack users.list API
    do {
      const response = await fetch('https://slack.com/api/users.list', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${slackToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cursor,
          limit: 200
        })
      });

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(`Slack API error: ${data.error}`);
      }

      users.push(...(data.members ?? []));
      cursor = data.response_metadata?.next_cursor;
    } while (cursor);

    // Filter and prepare employee data
    const employees = users
      .filter((user: any) => !user.deleted && !user.is_bot && user.profile?.real_name)
      .map((user: any) => ({
        slack_id: user.id,
        name: user.profile?.real_name || user.real_name,
        role: user.profile?.title || null,
        department: null, // You can enhance this based on Slack custom fields
        is_manager: false, // You can enhance this based on your logic
      }));

    // Bulk upsert employees
    const { data: upsertData, error: upsertError } = await supabase
      .from('employees')
      .upsert(employees, {
        onConflict: 'slack_id',
        ignoreDuplicates: false
      });

    if (upsertError) {
      throw upsertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${employees.length} employees from Slack`,
        employees_count: employees.length
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error syncing Slack employees:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});