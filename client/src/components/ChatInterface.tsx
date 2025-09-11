import { useState } from "react"
import ChatHeader from "./ChatHeader"
import ChatMessages, { type Message } from "./ChatMessages"
import ChatInput from "./ChatInput"

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async (messageText: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // TODO: Replace with actual OpenAI API call
    // Simulate AI response for now
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Thanks for your message: "${messageText}". I'm a demo AI assistant. In the full version, I'll be powered by OpenAI to give you intelligent responses!`,
        isUser: false,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)

    // Log for demo purposes
    console.log('Message sent:', messageText)
  }

  const handleClearChat = () => {
    setMessages([])
    console.log('Chat cleared')
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
        disabled={isTyping}
        placeholder="Ask me anything..."
      />
    </div>
  )
}