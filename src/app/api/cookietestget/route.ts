import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('cookie') || '';

    const cookieVal = cookies().get(name)
    return NextResponse.json(cookieVal?.value)
}