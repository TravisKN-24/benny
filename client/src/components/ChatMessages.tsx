import { useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"
import TypingIndicator from "./TypingIndicator"

export interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatMessagesProps {
  messages: Message[]
  isTyping?: boolean
}

export default function ChatMessages({ messages, isTyping = false }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages-container">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <span className="text-2xl font-bold">B</span>
          </div>
          <h2 className="text-lg font-semibold mb-2" data-testid="text-welcome-title">
            Welcome to Benny!
          </h2>
          <p className="text-muted-foreground max-w-md" data-testid="text-welcome-message">
            I'm your AI assistant, ready to help with questions, tasks, and conversations. 
            What would you like to talk about?
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}