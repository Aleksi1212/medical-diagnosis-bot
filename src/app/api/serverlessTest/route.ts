import { type NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
    return NextResponse.json('hello keycdn from serverless', { status: 200 });
}
