import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateSecurityInsight = async (
  stageName: string,
  contextData: string
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Configuration Missing: Please set your API Key to enable insights.";

  const prompt = `
    You are a DevSecOps Expert Architect.
    The user is currently at the "${stageName}" stage of a CI/CD pipeline.
    
    Context Data or Code Snippet:
    ${contextData}

    Provide a concise (max 3 sentences), high-level explanation of:
    1. What security risk is most relevant here?
    2. How the current stage mitigates it.
    
    If code is provided, briefly identify the vulnerability.
    Keep the tone professional and educational.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No insights available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch security insights at this time.";
  }
};

export const analyzeVulnerability = async (codeSnippet: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Config Missing.";

  const prompt = `
    Analyze the following code snippet for security vulnerabilities (e.g., SQL Injection, Hardcoded Secrets).
    
    Code:
    \`\`\`javascript
    ${codeSnippet}
    \`\`\`
    
    Output a Markdown formatted response with:
    - **Vulnerability Found**: [Name]
    - **Severity**: [High/Critical]
    - **Fix**: A brief code correction or explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis returned.";
  } catch (error) {
    console.error(error);
    return "Error analyzing code.";
  }
};
