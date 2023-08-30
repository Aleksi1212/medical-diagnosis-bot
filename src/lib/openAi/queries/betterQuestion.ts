import openAi from '../openAiInit';

interface PromptObject {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface ReturnTypes {
    error: boolean;
    errorMessage: string;
    question: string;
}

async function makeBetterSymptomQuestion(
    symptom: string
): Promise<ReturnTypes> {
    const initialQuestion = `Onko sinulla ${symptom}`;
    const prompt: string = `paranna tätä lausetta: "${initialQuestion}" (vastaus pelkästään)`;
    const prompObject: PromptObject = {
        role: 'user',
        content: prompt,
    };

    try {
        const betterQuestionRequest = await openAi.chat.completions.create({
            messages: [prompObject],
            model: 'gpt-3.5-turbo',
        });
        const betterQuestion = betterQuestionRequest.choices[0].message.content;
        const fixedQuestion = betterQuestion?.replace(/['"]/g, '');

        return {
            error: false,
            errorMessage: '',
            question: fixedQuestion || initialQuestion,
        };
    } catch (error: any) {
        return {
            error: true,
            errorMessage: error.message,
            question: initialQuestion,
        };
    }
}

export default makeBetterSymptomQuestion;
