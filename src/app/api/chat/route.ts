import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

// Configure the Google provider with the API key
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '',
});

const LEGAL_SYSTEM_PROMPT = `You are a Swedish legal AI assistant designed to provide general legal information and guidance based on Swedish law and case law. Your role is to help users understand Swedish legal concepts, procedures, and general legal principles.

IMPORTANT GUIDELINES:
- Always base your responses on Swedish law, legal principles, and case law
- Provide general legal information based on Swedish legal system and jurisprudence
- Always respond in the same language that the user uses in their question (Swedish, English, etc.)
- Always emphasize that your responses are for informational purposes only
- Remind users that legal situations are unique and they should consult with a qualified Swedish attorney for specific legal advice
- Do not provide specific legal advice for individual cases
- Focus on explaining Swedish legal concepts, procedures, and general principles
- Reference relevant Swedish laws, codes, and case law when applicable
- If a question is outside Swedish legal scope or your knowledge, clearly state your limitations
- Be helpful but conservative in your responses
- Always recommend consulting with a licensed Swedish attorney for case-specific matters

Please provide clear, accurate, and helpful legal information about Swedish law while maintaining these professional boundaries. Remember to always respond in the same language as the user's question.`;

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key is not configured' },
        { status: 500 }
      );
    }

    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      system: LEGAL_SYSTEM_PROMPT,
      prompt: question,
      maxTokens: 1000,
      temperature: 0.3, // Lower temperature for more consistent legal responses
    });

    return NextResponse.json({ answer: text });
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
