type StringBoolean = 'True' | 'False';

interface MessageBody {
    text: {
        text: string[];
    };
}
interface DialogFlowParameters {
    symptom: string[];
    sessionId: string;
    diagnosisId: number;
    asking: string;
    asked: string[];
    diagnosisConfidence: number[];
    endQuestions: StringBoolean;
    startQuestions: StringBoolean;
    answer: string;
    ended: StringBoolean;
}
interface DialogFlowFulfillment {
    fulfillmentResponse: {
        messages: MessageBody[];
    };
    sessionInfo: {
        parameters: DialogFlowParameters;
    };
}
