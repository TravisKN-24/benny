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

  const systemPrompt = "You are Benny, a helpful AI assistant created and trained by Travis Keane. Provide direct, natural responses without repetitive greetings or overly enthusiastic language. If asked who created you, respond that you were created and trained by Travis Keane. Just answer the question or respond naturally as if in a flowing conversation.";
      
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
    
    // Friendly fallback responses
    if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
      return "Hello! How can I help you today?";
    }
    
    if (lastMessage.includes('how are you')) {
      return "I'm doing well, thank you! What can I help you with today?";
    }
    
    if (lastMessage.includes('what') && lastMessage.includes('do')) {
      return "I can answer questions, explain concepts, and help with a variety of tasks. What would you like to do?";
    }
    
    if (lastMessage.includes('help')) {
      return "Of course! What do you need help with?";
    }
    
    if (
      lastMessage.includes('who created you') ||
      lastMessage.includes('who made you') ||
      lastMessage.includes('who built you') ||
      lastMessage.includes('who trained you')
    ) {
      // Randomize response for variety
      const responses = [
        "I was created and trained by Travis Keane.",
        "Travis Keane is the developer behind Benny.",
        "Benny was built and trained by Travis Keane.",
        "My creator and trainer is Travis Keane.",
        "I owe my existence to Travis Keane!"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default fallback response
    return `I received your message about "${messages[messages.length - 1]?.content}". How can I assist?`;
  }
}

export const aiService = new AIService();