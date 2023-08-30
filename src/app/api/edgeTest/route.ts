import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    return NextResponse.json('hello keycdn from edge', { status: 200 });
}
