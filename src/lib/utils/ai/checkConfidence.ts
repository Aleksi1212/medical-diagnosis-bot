import type { Symptom } from '@/lib/types/prisma.types';

interface ConfidenceReturnRypes {
    endQuestions: 'True' | 'False';
    question: string;
}

function checkConfidence(
    confidence: number,
    nextSymptom?: Symptom
): ConfidenceReturnRypes {
    if (confidence > 4 || !nextSymptom) {
        return {
            endQuestions: 'True',
            question: '',
        };
    }
    return {
        endQuestions: 'False',
        question: `Onko sinulla ${nextSymptom?.name}?`,
    };
}

export default checkConfidence;
