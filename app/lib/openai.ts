//app/lib/openai.ts

import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ OpenAI API key is not defined in environment variables");
}

export const openai = new OpenAI({
  apiKey: apiKey || "",
});
