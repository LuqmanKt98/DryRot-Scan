import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

async function testTireScan() {
  console.log("Downloading tire image...");
  
  // A publicly available image of severe tire dry rot
  const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tire_dry_rot.jpg/800px-Tire_dry_rot.jpg";
  const imageResponse = await fetch(imageUrl);
  const imageArrayBuffer = await imageResponse.arrayBuffer();
  const imageBuffer = Buffer.from(imageArrayBuffer);
  const base64Image = imageBuffer.toString('base64');
  
  console.log("Image downloaded. Sending to Gemini-2.5-flash...");
  
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  
  const prompt = `
        Analyze these tire images for "Dry Rot" (sidewall cracking) and general safety.
        
        Return a JSON object with this structure:
        {
          "status": "Good" | "Warning" | "Don't Buy",
          "confidence": number (0-100),
          "analysis": [
            { "title": "Short Title", "details": "Description of finding" },
            { "title": "Short Title", "details": "Description of finding" }
          ]
        }

        Criteria:
        - "Don't Buy": Deep cracks, cord visible, severe weathering, or missing rubber chunks.
        - "Warning": Fine hairline cracks (weather checking), discoloration.
        - "Good": Smooth rubber, no visible cracks.
      `;
      
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    console.log("=== GEMINI API RESPONSE ===");
    console.log(response.text);
    console.log("===========================");
  } catch (error) {
    console.error("API Error:", error);
  }
}

testTireScan();
