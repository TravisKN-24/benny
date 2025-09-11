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

  // Load chat history on mount
  const { data: chatHistory } = useQuery<ApiMessage[]>({
    queryKey: ['/api/chat/history'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  useEffect(() => {
    if (chatHistory && Array.isArray(chatHistory)) {
      const formattedMessages: Message[] = chatHistory.map((msg: ApiMessage) => ({
        id: msg.id,
        text: msg.content,
        isUser: msg.isUser,
        timestamp: new Date(msg.timestamp),
      }))
      setMessages(formattedMessages)
    }
  }, [chatHistory])

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', { message })
      return await response.json()
    },
    onSuccess: (data: any) => {
      // Add both user and AI messages from the response
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

      setMessages(prev => [...prev, userMessage, aiMessage])
      setIsTyping(false)

      // Invalidate history cache
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] })
    },
    onError: (error: any) => {
      console.error('Chat error:', error)
      setIsTyping(false)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleSendMessage = async (messageText: string) => {
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