import { $Enums, Prisma } from '@prisma/client';

type DiagnosisSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
type SymptomQuery = Prisma.SymptomsOnDiagnosisCreateWithoutDiagnosisInput;

interface Diagnosis {
    id: number;
    name: string;
    severity: $Enums.Severity;
}
interface Symptom {
    id: number;
    name: string;
    diagnosis: {
        diagnosisId: number;
        symptomId: number;
    }[];
}

interface ReturnTypes {
    error: boolean;
    errorMessage: string;
}

interface DiagnosisReturnTypes extends ReturnTypes {
    diagnosis: Diagnosis;
}
interface SymptomReturnTypes extends ReturnTypes {
    possibleSymptoms: Symptom[];
}
interface DiangnosisArrayReturnTypes extends ReturnTypes {
    diagnosis: Diagnosis[];
}

export type {
    DiagnosisReturnTypes,
    DiagnosisSeverity,
    Diagnosis,
    DiangnosisArrayReturnTypes,
    SymptomQuery,
    SymptomReturnTypes,
    Symptom,
};
