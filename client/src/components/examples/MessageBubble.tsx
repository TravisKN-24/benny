import MessageBubble from '../MessageBubble'

export default function MessageBubbleExample() {
  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <MessageBubble
        message="Hello! I'm looking for help with my project. Can you assist me?"
        isUser={true}
        timestamp={new Date(Date.now() - 120000)}
      />
      <MessageBubble
        message="Of course! I'd be happy to help with your project. What specific area would you like assistance with?"
        isUser={false}
        timestamp={new Date(Date.now() - 60000)}
      />
      <MessageBubble
        message="I need help with React components and state management. Any best practices you can share?"
        isUser={true}
        timestamp={new Date()}
      />
    </div>
  )
}