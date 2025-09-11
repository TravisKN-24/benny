import ChatMessages, { type Message } from '../ChatMessages'

const sampleMessages: Message[] = [
  {
    id: '1',
    text: 'Hello Benny! Can you help me understand quantum computing?',
    isUser: true,
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    text: 'Absolutely! Quantum computing is a fascinating field that leverages quantum mechanical phenomena to process information. Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or "qubits" that can exist in multiple states simultaneously through superposition.',
    isUser: false,
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: '3',
    text: 'That sounds complex! Can you give me a simple example?',
    isUser: true,
    timestamp: new Date(Date.now() - 180000)
  }
]

export default function ChatMessagesExample() {
  return (
    <div className="h-96 bg-background border rounded-lg">
      <ChatMessages messages={sampleMessages} isTyping={true} />
    </div>
  )
}