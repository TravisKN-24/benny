import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MessageBubbleProps {
  message: string
  isUser: boolean
  timestamp?: Date
}

export default function MessageBubble({ message, isUser, timestamp }: MessageBubbleProps) {
  // Helper to format message: code blocks and clean markdown
  function renderMessage(msg: string) {
    // Remove unwanted asterisks, tildes, etc. from start/end
    msg = msg.replace(/^[*~]+|[*~]+$/g, "").trim()

    // Find code blocks (```lang\ncode\n```)
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match
    while ((match = codeBlockRegex.exec(msg)) !== null) {
      // Push text before code block
      if (match.index > lastIndex) {
        parts.push(msg.slice(lastIndex, match.index))
      }
      // Push code block
      parts.push(
        <SyntaxHighlighter
          key={match.index}
          language={match[1] || "javascript"}
          style={oneDark}
          customStyle={{ borderRadius: "8px", fontSize: "0.95em", margin: "0.5em 0" }}
        >
          {match[2]}
        </SyntaxHighlighter>
      )
      lastIndex = codeBlockRegex.lastIndex
    }
    // Push remaining text
    if (lastIndex < msg.length) {
      parts.push(msg.slice(lastIndex))
    }
    return parts.map((part, i) => typeof part === "string" ? <span key={i}>{part}</span> : part)
  }

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
          <div className="text-sm whitespace-pre-wrap">{renderMessage(message)}</div>
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