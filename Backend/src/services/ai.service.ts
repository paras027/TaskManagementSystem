import { ApiError } from '../middlewares/error.middleware';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY ;

export const improveDescription = async (title: string, description: string): Promise<string> => {
  if (!GROQ_API_KEY) {
    throw new ApiError('AI service is not configured', 500);
  }

  const systemPrompt = `You are a professional task description editor.
Rules you MUST follow:
- Improve clarity, grammar, and actionability
- Keep the exact same meaning and topic as the original
- NEVER invent a new task or change what the task is about
- Maximum 2 short sentences
- Return ONLY the improved description. No quotes, no explanation, no extra text.`;

  const userPrompt = `Title: ${title}
Original Description: ${description.trim() || 'No description provided.'}

Improve the description above.`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.5,     // Lower = more consistent
      max_tokens: 120
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(`AI request failed: ${response.status} - ${errorText}`, 502);
  }

  const data = await response.json();
  const output = data.choices?.[0]?.message?.content?.trim();

  if (!output) {
    throw new ApiError('Unexpected AI response format', 502);
  }

  return output;
};