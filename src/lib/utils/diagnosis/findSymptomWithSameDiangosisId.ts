import type { Symptom } from '@/lib/prisma/prismaInit';

async function findSymptomWithSameDiagnosiId(
    diagnosisId: number,
    symptoms: Symptom[]
) {
    return symptoms.find((symptom) => {
        return symptom.diagnosis.some(
            (diagnosis) => diagnosis.diagnosisId === diagnosisId
        );
    });
}

export default findSymptomWithSameDiagnosiId
