import { PrismaClient, $Enums, Prisma } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma || new PrismaClient({ log: ['query'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type DiagnosisSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
type SymptomQuery = Prisma.SymptomsOnDiagnosisCreateWithoutDiagnosisInput;

interface Diagnosis {
    id: number;
    name: string;
    severity: $Enums.Severity;
}

interface DiagnosisReturnTypes {
    error: boolean;
    errorMessage: string;
    diagnosis: Diagnosis[];
}

export type { DiagnosisReturnTypes, DiagnosisSeverity, SymptomQuery };
