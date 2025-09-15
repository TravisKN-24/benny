import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import React, { useState } from "react"

interface MessageBubbleProps {
  message: string
  isUser: boolean
  timestamp?: Date
}

export default function MessageBubble({ message, isUser, timestamp }: MessageBubbleProps) {
  const [copiedFull, setCopiedFull] = useState(false)
  const [copiedSnippet, setCopiedSnippet] = useState<number | null>(null)

  // Helper to format message: code blocks and clean markdown
  function renderMessage(msg: string) {
    msg = msg.replace(/^[*~]+|[*~]+$/g, "").trim()
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let snippetIndex = 0

  while ((match = codeBlockRegex.exec(msg)) !== null) {
      // Push text before code block
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{msg.slice(lastIndex, match.index)}</span>)
      }
      // Push code block with copy button, responsive container
      parts.push(
        <div
          key={`code-${snippetIndex}`}
          style={{
            position: "relative",
            maxWidth: "100vw",
            overflowX: "auto",
            boxSizing: "border-box"
          }}
        >
          <SyntaxHighlighter
            language={match[1] || "javascript"}
            style={oneDark}
            customStyle={{
              borderRadius: "8px",
              fontSize: "0.95em",
              margin: "0.5em 0",
              maxWidth: "100%",
              boxSizing: "border-box",
              overflowX: "auto"
            }}
          >
            {match[2]}
          </SyntaxHighlighter>
          <button
            onClick={() => {
              navigator.clipboard.writeText(match[2])
              setCopiedSnippet(snippetIndex)
              setTimeout(() => setCopiedSnippet(null), 1500)
            }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              background: "#eee",
              border: "none",
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: "0.85em",
              borderRadius: "4px"
            }}
          >
            {copiedSnippet === snippetIndex ? "Copied!" : "Copy"}
          </button>
        </div>
      )
      lastIndex = codeBlockRegex.lastIndex
      snippetIndex++
    }
    // Push remaining text
    if (lastIndex < msg.length) {
      parts.push(<span key={`text-end`}>{msg.slice(lastIndex)}</span>)
    }
    return parts
  }

  // Only show full copy button for Benny's (AI) messages
  const showFullCopy = !isUser

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
          {isUser ? "U" : "B"}
        </AvatarFallback>
      </Avatar>
      <div className={`flex flex-col gap-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-lg px-4 py-2 relative ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
          data-testid={`message-${isUser ? 'user' : 'ai'}`}
        >
          <div className="text-sm whitespace-pre-wrap">{renderMessage(message)}</div>
          {showFullCopy && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(message)
                setCopiedFull(true)
                setTimeout(() => setCopiedFull(false), 1500)
              }}
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                zIndex: 2,
                background: "#eee",
                border: "none",
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: "0.85em",
                borderRadius: "4px"
              }}
            >
              {copiedFull ? "Copied!" : "Copy All"}
            </button>
          )}
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