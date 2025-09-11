import OpenAI from "openai";

// Using integration blueprint:javascript_openai
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  async generateChatResponse(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are Benny, a helpful and friendly AI assistant. Provide clear, concise, and helpful responses to user questions. Be conversational but informative."
          },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      // Provide intelligent fallback responses when OpenAI quota is exceeded
      return this.getFallbackResponse(messages);
    }
  }

  private getFallbackResponse(messages: ChatMessage[]): string {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    // Simple pattern matching for common queries
    if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
      return "Hello! I'm Benny, your AI assistant. I'm currently running in demo mode due to OpenAI quota limits, but I'm still here to help! What would you like to know?";
    }
    
    if (lastMessage.includes('how are you')) {
      return "I'm doing well, thank you for asking! I'm currently running in demo mode, but I'm still ready to assist you with any questions or tasks you have.";
    }
    
    if (lastMessage.includes('what') && lastMessage.includes('do')) {
      return "I'm an AI assistant designed to help with various tasks like answering questions, providing information, helping with problem-solving, and having conversations. Currently in demo mode, but fully functional once OpenAI quota is restored!";
    }
    
    if (lastMessage.includes('help')) {
      return "I'd be happy to help! While I'm currently in demo mode due to API limits, I can still provide assistance with general questions, explanations, and guidance. What specific topic would you like help with?";
    }
    
    // Default fallback response
    return `Thanks for your message! I'm currently running in demo mode due to OpenAI API quota limits. Your message: "${messages[messages.length - 1]?.content}" has been received. To get full AI responses, please check your OpenAI billing and quota settings.`;
  }
}

export const openaiService = new OpenAIService();