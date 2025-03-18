
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    const { email, link, type } = await req.json();
    
    if (!email || !link) {
      return new Response(
        JSON.stringify({ error: "Email and link are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const subject = type === "signup" 
      ? "Welcome to Focus Notes - Confirm Your Account" 
      : "Focus Notes - Your Magic Link";

    const { data, error } = await resend.emails.send({
      from: "Focus Notes <noreply@resend.dev>",
      to: email,
      subject: subject,
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                color: #333;
                line-height: 1.6;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background-color: #f9f9ff;
                border-radius: 12px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                border: 1px solid #e0e0ff;
              }
              h1 {
                color: #6040a3;
                font-weight: 700;
                margin-top: 0;
                font-size: 24px;
              }
              .button {
                display: inline-block;
                background-color: #7c4dff;
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
                transition: background-color 0.2s;
              }
              .button:hover {
                background-color: #6040a3;
              }
              .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #666;
              }
              .logo {
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <strong style="font-size: 20px; color: #6040a3;">Focus Notes</strong>
              </div>
              
              <h1>${type === "signup" ? "Welcome to Focus Notes!" : "Login Link"}</h1>
              
              <p>${type === "signup" 
                ? "Thank you for signing up! Click the button below to confirm your account and start boosting your productivity." 
                : "You requested a magic link to sign in to your Focus Notes account. Click the button below to login."}</p>
              
              <a href="${link}" class="button">
                ${type === "signup" ? "Confirm Your Account" : "Sign In to Focus Notes"}
              </a>
              
              <p>If you didn't request this email, you can safely ignore it.</p>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; font-size: 14px; color: #5555aa;">${link}</p>
              
              <div class="footer">
                <p>Focus Notes - Your productivity companion</p>
                <p>This link will expire in 24 hours.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
