// deno-lint-ignore-file no-explicit-any
import { DailySummary } from "./types.ts";
import { generateEmailContent } from "./utils.ts";

// @ts-expect-error: Deno imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error: Deno imports
import { Resend } from "https://esm.sh/resend@2.0.0";
import { getSupabaseClient } from "../lib/supabase.ts";
const supabase = getSupabaseClient();
// @ts-expect-error: Deno env
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    console.log("Summary data before sanitization:", JSON.stringify(summaryData, null, 2));

// Ensure all numerical values are properly set
summaryData.averageEfficiency = typeof summaryData.averageEfficiency === "number"
  ? summaryData.averageEfficiency
  : 0;

summaryData.totalTimeSpent = typeof summaryData.totalTimeSpent === "number"
  ? summaryData.totalTimeSpent
  : 0;

// Ensure all task metrics have default values
summaryData.completedTasks = summaryData.completedTasks.map(task => ({
  ...task,
  metrics: {
    actualDuration: typeof task.metrics?.actualDuration === "number" ? task.metrics.actualDuration : 0,
    efficiencyRatio: typeof task.metrics?.efficiencyRatio === "number" ? task.metrics.efficiencyRatio : 0,
    expectedTime: typeof task.metrics?.expectedTime === "number" ? task.metrics.expectedTime : 0,
    netEffectiveTime: typeof task.metrics?.netEffectiveTime === "number" ? task.metrics.netEffectiveTime : 0,
  }
}));

console.log("Summary data after sanitization:", JSON.stringify(summaryData, null, 2));

}
    
    const { data, error } = await resend.emails.send({
      from: "Focus Timer <success@focustimer.org>",
      to: email,
      subject: "Your Daily Task Summary",
      html: generateEmailContent(summaryData),
    });

    if (error || !data) {
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
      JSON.stringify({ 
        data: { id: data.id },
        message: "Email sent successfully" 
      }),
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
