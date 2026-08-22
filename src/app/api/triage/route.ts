import { NextRequest, NextResponse } from 'next/server';
import { performTriage } from '@/lib/ai/triage-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userInput, userInfo, chatHistory } = body;

    if (!userInput) {
      return NextResponse.json(
        { error: 'userInput is required' },
        { status: 400 }
      );
    }

    const triageResult = await performTriage(userInput, userInfo, chatHistory);
    return NextResponse.json(triageResult);
  } catch (error) {
    console.error('API Triage Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }

}
