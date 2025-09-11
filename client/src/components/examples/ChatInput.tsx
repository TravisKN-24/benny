import { useState } from 'react'
import ChatInput from '../ChatInput'

export default function ChatInputExample() {
  const [lastMessage, setLastMessage] = useState<string>('')

  const handleSendMessage = (message: string) => {
    setLastMessage(message)
    console.log('Message sent:', message)
  }

  return (
    <div className="space-y-4">
      {lastMessage && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Last message sent:</p>
          <p className="font-medium">{lastMessage}</p>
        </div>
      )}
      <div className="border rounded-lg bg-background">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}