import type { Symptom } from '@/lib/types/prisma.types';

async function findSymptomWithSameDiagnosiId(
    diagnosisId: number,
    symptoms: Symptom[],
    symptomName: string,
    askedSymptoms: string[]
) {
    return symptoms.find((symptom) => {
        return (
            symptom.name !== symptomName &&
            !askedSymptoms.includes(symptom.name) &&
            symptom.diagnosis.some(
                (diagnosis) => diagnosis.diagnosisId === diagnosisId
            )
        );
    });
}

export default findSymptomWithSameDiagnosiId;
