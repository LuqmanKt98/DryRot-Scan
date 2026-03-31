import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello, what model are you?'
    });
    console.log('API RESPONSE:', response.text);
  } catch (error) {
    console.error('API ERROR:', error);
  }
}

test();
