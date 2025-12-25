
import { GoogleGenAI, Type } from "@google/genai";
import { PerformanceMetrics, Diagnosis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzePerformance = async (metrics: PerformanceMetrics): Promise<Diagnosis> => {
  const prompt = `Act as a Senior Web Performance Engineer. Analyze these metrics:
    - TTFB: ${metrics.ttfb}ms
    - FCP: ${metrics.fcp}ms
    - LCP: ${metrics.lcp}ms
    - CLS: ${metrics.cls}
    - FID: ${metrics.fid}ms
    - Total: ${metrics.loadTime}ms

    Provide a deep technical diagnosis and a "Recruiter Insight" that explains the impact in professional terms.
    Also, generate a 4-segment 'waterfall' array (DNS, SSL, Processing, Content) that adds up to the total load time based on these stats.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING },
          score: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          recruiterInsight: { type: Type.STRING },
          technicalDebt: { type: Type.STRING },
          potentialCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
          waterfall: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                duration: { type: Type.NUMBER },
                color: { type: Type.STRING }
              },
              required: ["name", "duration", "color"]
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING },
                effort: { type: Type.STRING }
              },
              required: ["title", "description", "impact", "effort"]
            }
          }
        },
        required: ["status", "score", "summary", "recruiterInsight", "technicalDebt", "potentialCauses", "waterfall", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text) as Diagnosis;
};
