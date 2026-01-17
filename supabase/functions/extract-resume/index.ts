// supabase/functions/extract-resume/index.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

// ✅ CORS HEADERS (MANDATORY)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // ✅ HANDLE PREFLIGHT (THIS FIXES YOUR ERROR)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    const { text } = await req.json();

    if (!text || text.length < 50) {
      return new Response(
        JSON.stringify({ error: "Invalid resume text" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const prompt = `
You are a resume parsing AI.

Extract structured data from the resume text below and return ONLY valid JSON.

JSON FORMAT:
{
  "fullName": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "website": "",
  "summary": "",
  "skills": [],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduationDate": "",
      "gpa": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "description": []
    }
  ]
}

Resume Text:
"""${text}"""
`;

    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "Resume Builder",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          temperature: 0.2,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const aiData = await aiResponse.json();

    const raw = aiData.choices?.[0]?.message?.content;

    if (!raw) {
      return new Response(
        JSON.stringify({ error: "AI returned empty response" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ✅ CLEAN JSON SAFELY
    const jsonText = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(jsonText);

    return new Response(JSON.stringify(parsed), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
