import type { Symptom } from '@/lib/types/prisma.types';
import makeBetterSymptomQuestion from '@/lib/openAi/queries/betterQuestion';

interface ConfidenceReturnRypes {
    endQuestions: 'True' | 'False';
    question: string;
}

async function checkConfidence(
    confidence: number,
    nextSymptom?: Symptom
): Promise<ConfidenceReturnRypes> {
    if (confidence > 4 || !nextSymptom) {
        return {
            endQuestions: 'True',
            question: '',
        };
    }

    const { error, errorMessage, question } = await makeBetterSymptomQuestion(
        nextSymptom?.name
    );
    if (error) console.error(errorMessage);

    return {
        endQuestions: 'False',
        question,
    };
}

export default checkConfidence;
