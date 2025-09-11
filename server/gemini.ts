import { GoogleGenAI } from "@google/genai";

// Using integration blueprint:javascript_gemini
// Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AIService {
  async generateChatResponse(messages: ChatMessage[]): Promise<string> {
    try {
      // Build conversation context for Gemini
      const conversationHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => `${msg.role === 'user' ? 'User' : 'Benny'}: ${msg.content}`)
        .join('\n');

      const systemPrompt = "You are Benny, a helpful and friendly AI assistant. Provide clear, concise, and helpful responses to user questions. Be conversational but informative.";
      
      const fullPrompt = conversationHistory 
        ? `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nBenny:`
        : `${systemPrompt}\n\n${messages[messages.length - 1]?.content || 'Hello!'}\n\nBenny:`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
      });

      return response.text || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Provide intelligent fallback responses 
      return this.getFallbackResponse(messages);
    }
  }

  private getFallbackResponse(messages: ChatMessage[]): string {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    // Simple pattern matching for common queries
    if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
      return "Hello! I'm Benny, your AI assistant. I'm here to help with any questions you have!";
    }
    
    if (lastMessage.includes('how are you')) {
      return "I'm doing well, thank you for asking! I'm ready to assist you with any questions or tasks you have.";
    }
    
    if (lastMessage.includes('what') && lastMessage.includes('do')) {
      return "I'm an AI assistant designed to help with various tasks like answering questions, providing information, helping with problem-solving, and having conversations. What would you like to know?";
    }
    
    if (lastMessage.includes('help')) {
      return "I'd be happy to help! I can assist with general questions, explanations, and guidance. What specific topic would you like help with?";
    }
    
    // Default fallback response
    return `Thanks for your message! I received: "${messages[messages.length - 1]?.content}". I'm here to help - please feel free to ask me anything!`;
  }
}

export const aiService = new AIService();