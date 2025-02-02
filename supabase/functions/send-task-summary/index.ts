import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';
import { Resend } from "npm:resend@2.0.0";
import { DailySummary } from "./types.ts";
import { generateEmailContent } from "./utils.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Initialize Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  {
    auth: {
      persistSession: false
    }
  }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  email: string;
  summaryData: DailySummary;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, summaryData } = await req.json() as RequestBody;
    
    console.log("Received request to send summary email to:", email);
    console.log("Summary data:", JSON.stringify(summaryData, null, 2));

    const { error } = await resend.emails.send({
      from: "Lovable Timer <timer@resend.dev>",
      to: email,
      subject: "Your Daily Task Summary",
      html: generateEmailContent(summaryData),
    });

    if (error) {
      console.error("Failed to send email:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});