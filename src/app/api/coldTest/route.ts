import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    return NextResponse.json('hello keycdn this is cold', { status: 200 });
}
