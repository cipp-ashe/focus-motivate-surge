import { serve } from "std/http";
import { corsHeaders } from './utils';
import { getSupabaseClient } from './supabase';
import { DailySummary, formatSummaryEmail } from './utils';

interface EmailRequest {
  email: string;
  summaryData: DailySummary;
}

serve(async (req) => {
  console.log("Received request");
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405 
        }
      );
    }

    // Parse and validate request body
    const requestData = await req.json() as EmailRequest;
    const { email, summaryData } = requestData;

    if (!email || !summaryData) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email and summaryData are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    console.log('Creating Supabase client...');
    let supabase;
    try {
      supabase = await getSupabaseClient();
      console.log('Supabase client created successfully');
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
      throw new Error(`Failed to initialize Supabase: ${error.message}`);
    }

    console.log('Request details:', {
      email,
      summaryData: {
        completedTasks: summaryData.completedTasks.length,
        unfinishedTasks: summaryData.unfinishedTasks.length,
        totalTimeSpent: summaryData.totalTimeSpent,
        averageEfficiency: summaryData.averageEfficiency,
        totalPauses: summaryData.totalPauses
      }
    });

    console.log('Formatting email...');
    const emailHtml = formatSummaryEmail(summaryData);
    console.log('Email formatted successfully');

    console.log('Invoking send-email function...');
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        method: 'POST',
        body: { 
          to: email,
          subject: 'Your Daily Focus Summary',
          html: emailHtml 
        }
      });

      if (error) {
        console.error('Failed to send email:', {
          error,
          message: error.message,
          details: error.cause
        });
        throw error;
      }

      if (!data) {
        console.error('No data returned from send-email function');
        throw new Error('No response data from email function');
      }

      console.log('Email sent successfully:', {
        data,
        timestamp: new Date().toISOString()
      });

      return new Response(
        JSON.stringify({ 
          message: 'Email sent successfully',
          data: { id: crypto.randomUUID() }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );

    } catch (invokeError) {
      console.error('Error invoking send-email function:', {
        error: invokeError,
        message: invokeError.message,
        stack: invokeError.stack
      });
      throw new Error(`Failed to send email: ${invokeError.message}`);
    }

  } catch (error) {
    console.error('Error processing request:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
