import { useState } from "react"
import { FiCopy } from "react-icons/fi"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface MessageBubbleProps {
  message: string
  isUser: boolean
  timestamp?: Date
}

export default function MessageBubble({ message, isUser, timestamp }: MessageBubbleProps) {
  const [copiedFull, setCopiedFull] = useState(false)
  const [copiedSnippet, setCopiedSnippet] = useState<number | null>(null)

  // Helper to format message: code blocks and clean markdown
  function renderMessage(msg: string): { parts: React.ReactNode[]; foundCode: boolean } {
    msg = msg.replace(/^[*~]+|[*~]+$/g, "").trim()
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null
    let snippetIndex = 0
    let foundCode = false

    while ((match = codeBlockRegex.exec(msg)) !== null) {
      foundCode = true
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{msg.slice(lastIndex, match.index)}</span>)
      }
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1
            }}
          >
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(match[2])
                  setCopiedSnippet(snippetIndex)
                  setTimeout(() => setCopiedSnippet(null), 3000)
                } catch (e) {}
              }}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center"
              }}
              aria-label="Copy code snippet"
            >
              <FiCopy size={18} color="#888" />
            </button>
            {copiedSnippet === snippetIndex && (
              <span style={{ marginLeft: 6, fontSize: "0.85em", color: "#888" }}>Copied</span>
            )}
          </div>
        </div>
      )
      lastIndex = codeBlockRegex.lastIndex
      snippetIndex++
    }

    if (lastIndex < msg.length) {
      parts.push(<span key={`text-end`}>{msg.slice(lastIndex)}</span>)
    }

    return { parts, foundCode }
  }

  const showFullCopy = !isUser
  const { parts } = renderMessage(message)

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
          {isUser ? "U" : "B"}
        </AvatarFallback>
      </Avatar>

      <div className={`flex flex-col gap-1 max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-lg px-4 py-2 relative ${
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
          data-testid={`message-${isUser ? "user" : "ai"}`}
        >
          <div className="text-sm whitespace-pre-wrap">{parts}</div>
        </div>

        {showFullCopy && (
          <div style={{ display: "flex", alignItems: "center", marginTop: "0.5em" }}>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(message)
                  setCopiedFull(true)
                  setTimeout(() => setCopiedFull(false), 3000)
                } catch (e) {}
              }}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center"
              }}
              aria-label="Copy full message"
            >
              <FiCopy size={18} color="#888" />
            </button>
            {copiedFull && (
              <span style={{ marginLeft: 6, fontSize: "0.95em", color: "#888" }}>Copied</span>
            )}
          </div>
        )}

        {timestamp && (
          <span className="text-xs text-muted-foreground px-2" data-testid="text-timestamp">
            {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    </div>
  )
}
