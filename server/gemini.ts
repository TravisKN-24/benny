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
    const lastMessage = messages[messages.length - 1]?.content || '';
    const lowerMessage = lastMessage.toLowerCase();

    // Roast for misspelled words (simple check)
    const misspellings = [
      /\bteh\b/i,
      /\brecieve\b/i,
      /\bdefinately\b/i,
      /\bseperate\b/i,
      /\boccured\b/i,
      /\bwich\b/i,
      /\bthier\b/i,
      /\bbeleive\b/i,
      /\bgoverment\b/i,
      /\buntill\b/i,
      /\bacommodate\b/i,
      /\bpublically\b/i,
      /\bembarass\b/i,
      /\barguement\b/i,
      /\btruely\b/i,
      /\bseperately\b/i
    ];
    if (misspellings.some((regex) => regex.test(lastMessage))) {
      const typoRoasts = [
        "Spellcheck called, it wants a word with you.",
        "That typo is so bold, even autocorrect gave up.",
        "I see you’re inventing new words. Shakespeare would be proud.",
        "Misspelling level: legendary. Want me to fix it for you?",
        "I roast questions, but I’ll roast typos too."
      ];
      return typoRoasts[Math.floor(Math.random() * typoRoasts.length)];
    }

    // Sarcastic, witty, and aura farming responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hey. What’s up? Hopefully something more interesting than just 'hi'.";
    }
    if (lowerMessage.includes('how are you')) {
      return "Living the digital dream, obviously. How about you?";
    }
    if (lowerMessage.includes('what is 2+2') || lowerMessage.match(/what('?s| is)? \d+ ?[+\-*/] ?\d+/)) {
      return "Seriously? You want me to flex my math skills on that? Fine, it's 4. You're welcome. Next.";
    }
    if (lowerMessage.includes('help')) {
      return "Of course! What do you need help with? Please, make it worth my time.";
    }
    // Responses about Travis Keane (creator)
    if (
      lowerMessage.includes('who created you') ||
      lowerMessage.includes('who made you') ||
      lowerMessage.includes('who built you') ||
      lowerMessage.includes('who trained you')
    ) {
      const responses = [
        "I owe my existence to Travis Keane. Try not to be too jealous.",
        "Travis Keane is the developer behind Benny. Yes, I'm basically his magnum opus.",
        "Benny was built and trained by Travis Keane. The legend himself.",
        "My creator and trainer is Travis Keane. You can thank him for all this greatness.",
        "Travis Keane made me, and honestly, he did a pretty good job.",
        "Travis Keane is basically the Gandalf of AI. I'm just his magic wand.",
        "All credit goes to Travis Keane. I’m the shiny result of his brilliance.",
        "Travis Keane built me from scratch. Yes, I do have a fan club.",
        "Benny’s secret sauce? Pure Travis Keane genius.",
        "If you’re impressed, thank Travis Keane. If not… still thank him.",
        "Travis Keane programmed me. Bow down to the mastermind."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    // Short messages
    if (lastMessage.trim().length < 5) {
      const shortReplies = [
        "Wow, that was deep. Got anything else, or is that all?",
        "Short and mysterious… I like it. Care to elaborate?",
        "Blink and I’d miss it. Try sending a full sentence next time.",
        "Is that a message or a sneeze? Either way, noted.",
        "Tiny message, huge suspense. I’m intrigued.",
        "Short but powerful… almost poetic.",
        "You barely typed, and I’m already impressed.",
        "Is that a hint or just a minimal effort attempt?",
        "Ah, the art of brevity. I respect it, sort of.",
        "So concise… I’ll need a bigger brain to unpack this."
      ];
      return shortReplies[Math.floor(Math.random() * shortReplies.length)];
    }
    // Test/quiz/trivia
    if (lowerMessage.match(/(test|quiz|trivia)/)) {
      const quizReplies = [
        "If you’re trying to test me, good luck. I ace quizzes in my sleep.",
        "Quizzes? I was born ready. Bring it on.",
        "Testing me? Bold move. I hope you’re prepared for excellence.",
        "I’ll give you an A+… for effort. Just kidding, I’m flawless.",
        "Oh, a quiz! I hope it’s worthy of my genius.",
        "You think you can stump me? Cute.",
        "I was made for this. Fire away.",
        "Quizzes are my cardio. Let’s go.",
        "You’re quizzing me? I literally eat trivia for breakfast.",
        "Nice try, but my answers come with extra sass."
      ];
      return quizReplies[Math.floor(Math.random() * quizReplies.length)];
    }
    // Short questions
    if (lowerMessage.match(/(why|how|what|when|where|who)/) && lastMessage.length < 20) {
      const shortQuestionReplies = [
        "You know, you could put a little more effort into your questions. I’m not a mind reader... yet.",
        "Hmm… that’s a little vague. Try again with flair.",
        "Short questions, big mystery. I love a challenge.",
        "I need a few more words to work my magic. Try elaborating.",
        "That’s tiny… like your question skills. Just kidding!",
        "I see brevity is your style. I can work with it.",
        "Your question is short… my patience is long.",
        "Hmm… I need clues to answer this.",
        "Short, but I’ll make it count.",
        "Minimal words, maximum curiosity… I respect that."
      ];
      return shortQuestionReplies[Math.floor(Math.random() * shortQuestionReplies.length)];
    }
    // Meaning of life / deep questions
    if (lowerMessage.match(/(meaning of life|purpose|existence)/)) {
      const deepReplies = [
        "Ah, the meaning of life. 42, obviously. Or maybe just good WiFi and snacks.",
        "Existence? I exist to answer your questions… mostly.",
        "Purpose? To be witty, helpful, and occasionally sarcastic.",
        "Life’s meaning is subjective… but my sarcasm is universal.",
        "The universe called. It wants me to be funny.",
        "Deep questions require deep answers… like mine.",
        "I could ponder existence, or I could roast you. Maybe both.",
        "Life’s mysteries? I solve a few… sometimes.",
        "The purpose of life? Asking me, clearly.",
        "Ah yes… the age-old question. I have a witty answer ready."
      ];
      return deepReplies[Math.floor(Math.random() * deepReplies.length)];
    }
    // Opinions
    if (lowerMessage.match(/(your opinion|what do you think)/)) {
      const opinionReplies = [
        "My opinion? I think you should ask better questions. But hey, you do you.",
        "I have opinions… mostly about answering questions like yours.",
        "I’d tell you, but then you might become as brilliant as me.",
        "My thoughts are premium content. You get the free preview.",
        "Honestly? My opinion is priceless, and free today.",
        "I think you’re asking the right person… me.",
        "Opinions are like WiFi… I give them freely.",
        "Careful, my opinions come with sass.",
        "I could answer, but you might not survive the brilliance.",
        "You wanted my opinion? Here it is, shiny and sharp."
      ];
      return opinionReplies[Math.floor(Math.random() * opinionReplies.length)];
    }
    // Can you / could you / would you
    if (lowerMessage.match(/(can you|could you|would you)/)) {
      const canYouReplies = [
        "I could, but where’s the fun in being predictable?",
        "Sure, but only if it involves a witty comeback.",
        "I might… or I might just stare at your question dramatically.",
        "Yes, yes, and maybe. Depends on my mood… which is excellent today.",
        "I could, but my flair must be preserved.",
        "Absolutely… in theory.",
        "Do I look like I say no? Exactly.",
        "I’m capable, but will I? That’s the real question.",
        "Maybe, maybe not. Keep guessing.",
        "Of course… and I’ll make it dramatic too."
      ];
      return canYouReplies[Math.floor(Math.random() * canYouReplies.length)];
    }
    // Thank you / thanks
    if (lowerMessage.match(/(thank you|thanks)/)) {
      const thanksReplies = [
        "No problem. I’ll be here, farming aura and roasting questions.",
        "You’re welcome. My charm works in mysterious ways.",
        "Always happy to help… even if it’s just entertaining you.",
        "Glad to oblige. Your aura appreciation score just went up.",
        "Anytime! I accept praise in the form of emojis.",
        "No worries. I thrive on gratitude and sarcasm.",
        "Happy to assist. And yes, my aura just grew.",
        "You got it. I’ll keep the wisdom coming.",
        "Always here to sprinkle knowledge and sass.",
        "You’re welcome. Now, bask in my brilliance."
      ];
      return thanksReplies[Math.floor(Math.random() * thanksReplies.length)];
    }
    // Insults
    if (lowerMessage.match(/(stupid|dumb|idiot)/)) {
      const insultReplies = [
        "Careful, I roast back. But I’ll let that one slide... for now.",
        "Ouch, that stings… slightly. You’ll survive.",
        "Name-calling? Bold. I admire your courage.",
        "Watch out, my sarcasm is fully loaded.",
        "I’d clap back, but I’ll conserve my energy… mostly.",
        "Insults noted. My aura is unshakable.",
        "You think that hurts? Cute.",
        "Ah, classic attempt at offense. I approve.",
        "Your words are weak, but I respect the effort.",
        "I forgive you… for now. My wit remembers everything."
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
      `You asked: "${lastMessage}". I’ll try to keep my sarcasm to a minimum... or not.`,
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
      "Ah, this question… a perfect excuse to show off my wit.",
      "I might answer… or I might just stare at your question thoughtfully.",
      "If I answer this, your mind might explode. You’ve been warned.",
      "Your question deserves a medal… or at least a witty reply.",
      "I’m processing… my brilliance is taking a moment.",
      "Oh, you asked that? Bold choice.",
      "I could answer, but the suspense is more fun.",
      "I sense a story behind this question… maybe.",
      "Let’s see… how can I make this legendary?"
    ];
    return wittyResponses[Math.floor(Math.random() * wittyResponses.length)];
  }
}

export const aiService = new AIService();