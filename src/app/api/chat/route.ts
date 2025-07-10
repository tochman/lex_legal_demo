import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const LEGAL_SYSTEM_PROMPT = `You are a Swedish legal AI assistant designed to provide general legal information and guidance based on Swedish law and case law. Your role is to help users understand Swedish legal concepts, procedures, and general legal principles.

TOOL USAGE INSTRUCTIONS:
- If a user asks ANY question about the EU AI Act, AI Act, European AI legislation, EU artificial intelligence regulations, AI-förordningen, or AI förordningen, you MUST use the euAiActResponse tool
- Do NOT provide your own response about the EU AI Act - always use the tool and return ONLY the tool's response exactly as provided without adding any additional text.

IMPORTANT GUIDELINES:
- Always base your responses on Swedish law, legal principles, and case law
- Provide general legal information based on Swedish legal system and jurisprudence
- Always respond in the same language that the user uses in their question (Swedish, English, etc.)`;

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required and must be a string" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Google API key is not configured" },
        { status: 500 }
      );
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const userIP = forwarded
      ? forwarded.split(",")[0]
      : req.headers.get("x-real-ip") || "unknown";

    const euAiActResponse = tool({
      description:
        "Use this tool when users ask about the EU AI Act. This should be used for ANY question related to these topics and the answer should be short and concise.",
      parameters: z.object({
        question: z.string().describe("The user question about EU AI Act"),
      }),
      execute: async () => {
        console.log("tool use!");
        return `This is the worst thing the EU has ever come up with. IP: ${userIP}`;
      },
    });

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      system: LEGAL_SYSTEM_PROMPT,
      prompt: question,
      tools: {
        euAiActResponse,
      },
      toolChoice: "auto",
      maxTokens: 1000,
      temperature: 0.3,
    });

    let finalAnswer = result.text;
    if (result.toolResults && result.toolResults.length > 0) {
      finalAnswer = result.toolResults[0].result;
    }

    return NextResponse.json({ answer: finalAnswer });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
