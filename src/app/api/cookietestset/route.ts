import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    cookies().set('test', 'cool val')
    return NextResponse.json('cookie set')
}