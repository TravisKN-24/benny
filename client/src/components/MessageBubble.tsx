import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface MessageBubbleProps {
  message: string
  isUser: boolean
  timestamp?: Date
}

export default function MessageBubble({ message, isUser, timestamp }: MessageBubbleProps) {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
          {isUser ? "U" : "B"}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col gap-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
          data-testid={`message-${isUser ? 'user' : 'ai'}`}
        >
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
        
        {timestamp && (
          <span className="text-xs text-muted-foreground px-2" data-testid="text-timestamp">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  )
}