import openAi from '../openAiInit';

interface Messageobject {
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
    const message: string = `paranna tätä lausetta: "${initialQuestion}" (vastaus pelkästään)`;
    const messageObject: Messageobject = {
        role: 'user',
        content: message,
    };

    try {
        const betterQuestionRequest = await openAi.chat.completions.create({
            messages: [messageObject],
            model: 'gpt-3.5-turbo',
        });
        const betterQuestion = betterQuestionRequest.choices[0].message.content;

        return {
            error: false,
            errorMessage: '',
            question: betterQuestion || initialQuestion,
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
