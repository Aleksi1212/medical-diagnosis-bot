import type { Symptom } from '@/lib/prisma/prismaInit';

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
