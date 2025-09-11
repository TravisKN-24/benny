import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 opacity-70">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-muted">B</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-1 max-w-[70%]">
        <div className="rounded-lg px-4 py-3 bg-muted" data-testid="typing-indicator">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0ms', animationDuration: '1400ms' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '200ms', animationDuration: '1400ms' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '400ms', animationDuration: '1400ms' }} />
          </div>
        </div>
        
        <span className="text-xs text-muted-foreground px-2">
          Benny is typing...
        </span>
      </div>
    </div>
  )
}