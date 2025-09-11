import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openaiService, type ChatMessage as OpenAIChatMessage } from "./openai";
import { insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Store user message
      const userMessage = await storage.createChatMessage({
        content: message,
        isUser: true,
      });

      // Get recent chat history for context
      const recentMessages = await storage.getChatMessages(10);
      
      // Convert to OpenAI format for context
      const openaiMessages: OpenAIChatMessage[] = recentMessages
        .slice(-6) // Keep last 3 exchanges for context
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        }));

      // Generate AI response
      const aiResponse = await openaiService.generateChatResponse(openaiMessages);

      // Store AI response
      const aiMessage = await storage.createChatMessage({
        content: aiResponse,
        isUser: false,
      });

      res.json({
        userMessage,
        aiMessage,
      });

    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Get chat history
  app.get("/api/chat/history", async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      console.error('Chat history API error:', error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
