import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { extractText, getDocumentProxy } from "https://esm.sh/unpdf@0.10.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const HF_TOKEN = Deno.env.get("HF_TOKEN");
const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { resumeUrl } = await req.json();
    if (!resumeUrl) throw new Error("Missing resumeUrl");

    // 1. Download PDF
    const pdfRes = await fetch(resumeUrl);
    if (!pdfRes.ok) throw new Error(`Failed to download PDF: ${pdfRes.status}`);
    const pdfBuffer = await pdfRes.arrayBuffer();

    // 2. Extract text using unpdf
    const pdfDoc = await getDocumentProxy(new Uint8Array(pdfBuffer));
    const { text: extractedText } = await extractText(pdfDoc, { mergePages: true });
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text could be extracted from the PDF. It might be image-based.");
    }

    // 3. Build the prompt
    const prompt = `
      Extract the following information from the resume text below. Return ONLY valid JSON, no extra text, using this exact schema:
      {
        "name": "full name",
        "email": "email address if found",
        "phone": "phone number if found",
        "skills": ["skill1", "skill2", ...],
        "experience": ["brief job title, company, duration", ...],
        "education": ["degree, institution, year", ...]
      }
      If a field is missing, use empty string or empty array.
      Resume text:
      """${extractedText.slice(0, 4000)}"""
    `;

    // 4. Call Hugging Face API
    const hfResponse = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 500, temperature: 0.2 },
      }),
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("Hugging Face API error:", errorText);
      throw new Error(`LLM request failed: ${hfResponse.status}`);
    }

    const result = await hfResponse.json();
    const generatedText = result[0]?.generated_text || "";
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Model did not return valid JSON");
    const parsedData = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});