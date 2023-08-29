import OpenAI from 'openai';

const openAi = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});

export default openAi;
