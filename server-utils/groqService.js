import Groq from 'groq-sdk';

let groq = null;

function getGroqClient() {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

/**
 * Generate an application specification using Groq AI
 * @param {string} description - User description of the app they want to build
 * @returns {Promise<string>} - Generated application code/specification
 */
export async function generateAppCode(description) {
  const groqClient = getGroqClient();

  const systemPrompt = `You are an expert Base44 application architect. Generate complete, production-ready Base44 application configurations based on user descriptions.

Your output should be valid JavaScript/TypeScript configuration that defines:
1. Application metadata (name, description, version)
2. API entities (data models with fields, validations)
3. Functions (endpoints or business logic)
4. Agents (AI assistants if applicable)
5. Frontend structure (pages, components)

Output format should be valid JSON with proper structure that can be used to scaffold a complete application.
Be specific about field types, validations, and relationships.
Include helpful comments in the generated code.`;

  try {
    const response = await groqClient.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Generate a complete Base44 application for: ${description}\n\nProvide the configuration as JSON that can be used to create the application.`,
        },
      ],
    });

    if (response.choices && response.choices[0] && response.choices[0].message) {
      return response.choices[0].message.content;
    }

    throw new Error('Unexpected response format from Groq API');
  } catch (error) {
    if (error.status === 401) {
      throw new Error('Groq API authentication failed. Check your GROQ_API_KEY.');
    }
    if (error.status === 429) {
      throw new Error('Groq API rate limit exceeded. Please try again later.');
    }
    throw error;
  }
}
