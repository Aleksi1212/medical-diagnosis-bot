import type { Symptom } from '@/lib/types/prisma.types';

function findNewDiagnosisFromSymptoms(
    symptoms: Symptom[],
    diagnosisIds: number[]
) {
    return symptoms.filter((symptom) => {
        return symptom.diagnosis.some((diagnosis) =>
            !diagnosisIds.includes(diagnosis.diagnosisId)
        );
    });
}

export default findNewDiagnosisFromSymptoms;
