//app/api/feedback/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { openai } from "../../../lib/openai";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
    responseLimit: false,
  },
};

async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(
      "Failed to extract text from PDF. Please ensure it's a valid, searchable PDF file (not an image scan)."
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Received PDF upload request");

    // parse form data
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      console.log("No file provided in request");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(
      "File received:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type
    );

    if (!file.type.includes("pdf")) {
      console.log("Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    // Validate file size
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      console.log("File size exceeds limit:", file.size);
      return NextResponse.json(
        {
          error: `File size exceeds the limit of ${
            maxFileSize / 1024 / 1024
          }MB`,
        },
        { status: 400 }
      );
    }

    // get file buffer directly
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("File buffer created, size:", buffer.length);

    let resumeText: string;
    try {
      resumeText = await parsePDF(buffer);
      console.log("Resume text extracted, length:", resumeText.length);

      console.log("resumeText==========", resumeText);

      if (!resumeText.trim()) {
        return NextResponse.json(
          {
            error:
              "Could not extract any text from the PDF. The file might be scanned or image-based or encrypted.",
          },
          { status: 400 }
        );
      }
    } catch (pdfError) {
      return NextResponse.json(
        {
          error:
            pdfError instanceof Error
              ? pdfError.message
              : "Failed to parse PDF",
        },
        { status: 400 }
      );
    }

    // check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key is missing");
      // Return a specific message to the user
      return NextResponse.json({
        feedback:
          "⚠️ OpenAI API key is not configured on the server. Please inform the administrator.",
      });
    }

    // get feedback from OpenAI
    try {
      console.log("Sending request to OpenAI");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful and professional career coach. Analyze the provided resume text and give constructive feedback. Cover these key areas using clear markdown headings and bullet points:\n\n## Overall Impression\n- Briefly summarize the strengths and weaknesses.\n\n## Formatting & Structure\n- Comment on readability, consistency, and layout.\n\n## Content & Impact\n- Evaluate the clarity and impact of experience descriptions (quantifiable achievements are key).\n- Provide suggestions for improving bullet points.\n\n## Skills\n- How are skills presented? Are they relevant and easy to find?\n\n## Education\n- Is this section clear and complete?\n\n## Areas for Improvement\n- Suggest specific actions the user can take to enhance the resume.\n\nFormat your entire response using standard markdown.",
          },
          {
            role: "user",
            content: `Please review this resume text and provide professional feedback following the instructions:\n\n${resumeText}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000, // Increased max tokens for more detailed feedback
      });

      const feedback =
        completion.choices[0].message.content?.trim() ??
        "No feedback generated";
      console.log("OpenAI response received, length:", feedback.length);

      if (feedback.length < 50 && feedback !== "No feedback generated") {
        return NextResponse.json({
          feedback:
            "Received very short feedback. The AI might have had difficulty processing the resume. Please try a different format or ensure the text is extractable.\n\n" +
            feedback,
        });
      }

      return NextResponse.json({ feedback });
    } catch (openAiError) {
      console.error("OpenAI API error:", openAiError);
      return NextResponse.json(
        {
          error:
            "Error getting feedback from AI. This might be a temporary issue or related to the AI service.",
          details:
            openAiError instanceof Error
              ? openAiError.message
              : String(openAiError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API route error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }

    return NextResponse.json(
      {
        error: "An unexpected server error occurred. Please try again later.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
