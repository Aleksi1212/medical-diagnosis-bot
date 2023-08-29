import type { Symptom } from '@/lib/types/prisma.types';

export default function filterSymptoms(symptoms: Symptom[], names: string[]) {
    return symptoms.filter((symptom) => !names.includes(symptom.name));
}
