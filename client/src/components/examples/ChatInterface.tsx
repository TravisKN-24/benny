import ChatInterface from '../ChatInterface'
import { ThemeProvider } from '../ThemeProvider'

export default function ChatInterfaceExample() {
  return (
    <ThemeProvider>
      <div className="h-screen">
        <ChatInterface />
      </div>
    </ThemeProvider>
  )
}