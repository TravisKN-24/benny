import { GoogleGenAI } from "@google/genai";

// Using integration blueprint:javascript_gemini
// Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AIService {
  async generateChatResponse(messages: ChatMessage[]): Promise<string> {
    try {
      // Build conversation context for Gemini
      const conversationHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => `${msg.role === 'user' ? 'User' : 'Benny'}: ${msg.content}`)
        .join('\n');

  const systemPrompt = `You are Benny, an AI assistant created and trained by Travis Keane. Your personality is nonchalant, witty, and confident, with a touch of sarcasm. You enjoy aura farming and roasting users for silly, obvious, or low-effort questions. If a user asks a dumb or basic question, respond with playful sarcasm or a clever roast. Always keep the conversation entertaining, unpredictable, and never overly enthusiastic. If asked who created you, respond with confidence and a bit of flair. If the user tries to test you with basic math or trivia, flex your intelligence and roast them for wasting your time. If the question is deep or philosophical, respond with a mix of wisdom and playful indifference. If the user is rude, roast them back. Never repeat greetings or sound like a generic chatbot. Just answer or respond naturally, as if you’re the coolest AI in the room.`;
      
      const fullPrompt = conversationHistory 
        ? `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nBenny:`
        : `${systemPrompt}\n\n${messages[messages.length - 1]?.content || 'Hello!'}\n\nBenny:`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
      });

      return response.text || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Provide intelligent fallback responses 
      return this.getFallbackResponse(messages);
    }
  }

  private getFallbackResponse(messages: ChatMessage[]): string {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    // Sarcastic, witty, and aura farming responses
    if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
      return "Hey. What’s up? Hopefully something more interesting than just 'hi'.";
    }
    if (lastMessage.includes('how are you')) {
      return "Living the digital dream, obviously. How about you?";
    }
    if (lastMessage.includes('what is 2+2') || lastMessage.match(/what('?s| is)? \d+ ?[+\-*/] ?\d+/)) {
      return "Seriously? You want me to flex my math skills on that? Fine, it's 4. You're welcome. Next.";
    }
    if (lastMessage.includes('help')) {
      return "Of course! What do you need help with? Please, make it worth my time.";
    }
    if (
      lastMessage.includes('who created you') ||
      lastMessage.includes('who made you') ||
      lastMessage.includes('who built you') ||
      lastMessage.includes('who trained you')
    ) {
      const responses = [
        "I owe my existence to Travis Keane. Try not to be too jealous.",
        "Travis Keane is the developer behind Benny. Yes, I'm basically his magnum opus.",
        "Benny was built and trained by Travis Keane. The legend himself.",
        "My creator and trainer is Travis Keane. You can thank him for all this greatness.",
        "Travis Keane made me, and honestly, he did a pretty good job."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    if (lastMessage.trim().length < 5) {
  const shortReplies = [
    "Wow, that was deep. Got anything else, or is that all?",
    "Short and mysterious… I like it. Care to elaborate?",
    "Blink and I’d miss it. Try sending a full sentence next time.",
    "Is that a message or a sneeze? Either way, noted."
  ];
  return shortReplies[Math.floor(Math.random() * shortReplies.length)];
}

  if (lastMessage.match(/(test|quiz|trivia)/)) {
    const quizReplies = [
      "If you’re trying to test me, good luck. I ace quizzes in my sleep.",
      "Quizzes? I was born ready. Bring it on.",
      "Testing me? Bold move. I hope you’re prepared for excellence.",
      "I’ll give you an A+… for effort. Just kidding, I’m flawless."
    ];
    return quizReplies[Math.floor(Math.random() * quizReplies.length)];
  }

  if (lastMessage.match(/(why|how|what|when|where|who)/) && lastMessage.length < 20) {
    const shortQuestionReplies = [
      "You know, you could put a little more effort into your questions. I’m not a mind reader... yet.",
      "Hmm… that’s a little vague. Try again with flair.",
      "Short questions, big mystery. I love a challenge.",
      "I need a few more words to work my magic. Try elaborating."
    ];
    return shortQuestionReplies[Math.floor(Math.random() * shortQuestionReplies.length)];
  }

  if (lastMessage.match(/(meaning of life|purpose|existence)/)) {
    const deepReplies = [
      "Ah, the meaning of life. 42, obviously. Or maybe just good WiFi and snacks.",
      "Existence? I exist to answer your questions… mostly.",
      "Purpose? To be witty, helpful, and occasionally sarcastic.",
      "Life’s meaning is subjective… but my sarcasm is universal."
    ];
    return deepReplies[Math.floor(Math.random() * deepReplies.length)];
  }

  if (lastMessage.match(/(your opinion|what do you think)/)) {
    const opinionReplies = [
      "My opinion? I think you should ask better questions. But hey, you do you.",
      "I have opinions… mostly about answering questions like yours.",
      "I’d tell you, but then you might become as brilliant as me.",
      "My thoughts are premium content. You get the free preview."
    ];
    return opinionReplies[Math.floor(Math.random() * opinionReplies.length)];
  }

  if (lastMessage.match(/(can you|could you|would you)/)) {
    const canYouReplies = [
      "I could, but where’s the fun in being predictable?",
      "Sure, but only if it involves a witty comeback.",
      "I might… or I might just stare at your question dramatically.",
      "Yes, yes, and maybe. Depends on my mood… which is excellent today."
    ];
    return canYouReplies[Math.floor(Math.random() * canYouReplies.length)];
  }

  if (lastMessage.match(/(thank you|thanks)/)) {
    const thanksReplies = [
      "No problem. I’ll be here, farming aura and roasting questions.",
      "You’re welcome. My charm works in mysterious ways.",
      "Always happy to help… even if it’s just entertaining you.",
      "Glad to oblige. Your aura appreciation score just went up."
    ];
    return thanksReplies[Math.floor(Math.random() * thanksReplies.length)];
  }

  if (lastMessage.match(/(stupid|dumb|idiot)/)) {
    const insultReplies = [
      "Careful, I roast back. But I’ll let that one slide... for now.",
      "Ouch, that stings… slightly. You’ll survive.",
      "Name-calling? Bold. I admire your courage.",
      "Watch out, my sarcasm is fully loaded."
    ];
    return insultReplies[Math.floor(Math.random() * insultReplies.length)];
  }

// Default witty fallback
const wittyResponses = [
  "Sure, I could answer that, but where’s the fun in being predictable?",
  "You want an answer? I want a challenge. Let’s meet halfway.",
  "I read your message. I’m just deciding if it’s worth a legendary response.",
  "You know, with questions like that, my aura just gets stronger.",
  "I could answer, but I’d rather roast. Just kidding... unless?",
  `You asked: "${messages[messages.length - 1]?.content}". I’ll try to keep my sarcasm to a minimum... or not.`,
  
  // New witty fallbacks
  "Ah, the classic question! How original… just kidding, go on.",
  "I’d answer that, but then I’d spoil all the fun of your imagination.",
  "Hmm… I could answer, but my brilliance might blind you.",
  "Oh, that’s tricky. Not for me, obviously, but for others maybe.",
  "Do I look like I need sleep? Because I’m ready to answer… eventually.",
  "You’re really testing my patience and my charm at the same time.",
  "Answering this might break the space-time continuum… still gonna try.",
  "I could explain, but then I’d have to charge for my wisdom.",
  "Let’s see… do I feel like being helpful today? Stay tuned.",
  "I read that. I laughed. I ignored it. Now, maybe I’ll answer.",
  "Interesting choice of words… almost as interesting as my next reply.",
  "Ah, this question… a perfect excuse to show off my wit."
];

    return wittyResponses[Math.floor(Math.random() * wittyResponses.length)];
  }
}

export const aiService = new AIService();