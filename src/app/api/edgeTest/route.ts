import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/prismaInit';

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    const test = await prisma.symptom.findFirst({
        where: {
            name: 'päänsärky'
        }
    })

    return NextResponse.json(test, { status: 200 });
}
