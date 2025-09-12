import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import ChatHeader from "./ChatHeader"
import ChatMessages, { type Message } from "./ChatMessages"
import ChatInput from "./ChatInput"
import { useToast } from "@/hooks/use-toast"

interface ApiMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const { toast } = useToast()


  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', { message })
      return await response.json()
    },
    onSuccess: (data: any) => {
      // Update the temporary user message with real ID and add AI response
      const userMessage: Message = {
        id: data.userMessage.id,
        text: data.userMessage.content,
        isUser: true,
        timestamp: new Date(data.userMessage.timestamp),
      }

      const aiMessage: Message = {
        id: data.aiMessage.id,
        text: data.aiMessage.content,
        isUser: false,
        timestamp: new Date(data.aiMessage.timestamp),
      }

      // Replace the temp user message and add AI response
      setMessages(prev => {
        const newMessages = [...prev]
        // Replace the last message (temp user message) with the real one
        newMessages[newMessages.length - 1] = userMessage
        // Add AI response
        newMessages.push(aiMessage)
        return newMessages
      })
      
      setIsTyping(false)

      // Invalidate history cache
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] })
    },
    onError: (error: any) => {
      console.error('Chat error:', error)
      setIsTyping(false)
      
      // Remove the temporary user message on error
      setMessages(prev => prev.slice(0, -1))
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleSendMessage = async (messageText: string) => {
    // Show user message immediately
    const tempId = Date.now().toString()
    const userMessage: Message = {
      id: tempId,
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    sendMessageMutation.mutate(messageText)
  }

  return (
    <div className="flex flex-col h-screen bg-background" data-testid="chat-interface">
      <ChatHeader />
      
      <ChatMessages 
        messages={messages} 
        isTyping={isTyping} 
      />
      
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isTyping || sendMessageMutation.isPending}
        placeholder="Ask me anything..."
      />
    </div>
  )
}