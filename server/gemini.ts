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
      /\bseperately\b/i,
      // 100+ more common misspellings
      /\babsense\b/i,
      /\babscence\b/i,
      /\bacceptible\b/i,
      /\baccidentalaly\b/i,
      /\baccomodate\b/i,
      /\bacomodate\b/i,
      /\bacheive\b/i,
      /\bacheeve\b/i,
      /\baquaintence\b/i,
      /\baquire\b/i,
      /\baquit\b/i,
      /\balot\b/i,
      /\bamatuer\b/i,
      /\bamature\b/i,
      /\bapparant\b/i,
      /\baparant\b/i,
      /\bappaent\b/i,
      /\bathalete\b/i,
      /\bathelete\b/i,
      /\bbellweather\b/i,
      /\bcalender\b/i,
      /\bcatagory\b/i,
      /\bcemetary\b/i,
      /\bsemetary\b/i,
      /\bchangable\b/i,
      /\bcollectable\b/i,
      /\bcolum\b/i,
      /\bcollum\b/i,
      /\bcommited\b/i,
      /\bconcience\b/i,
      /\bconsciencious\b/i,
      /\bconscous\b/i,
      /\bconcensus\b/i,
      /\bdaquiri\b/i,
      /\bdefinetly\b/i,
      /\bdesciple\b/i,
      /\bdisipline\b/i,
      /\bdrunkedness\b/i,
      /\bdumbell\b/i,
      /\benviromant\b/i,
      /\benvirment\b/i,
      /\bexistance\b/i,
      /\bfamilar\b/i,
      /\bfirey\b/i,
      /\bfinaly\b/i,
      /\bfinnally\b/i,
      /\bflorescent\b/i,
      /\bforiegn\b/i,
      /\bforword\b/i,
      /\bfourty\b/i,
      /\bfoward\b/i,
      /\bfreind\b/i,
      /\bfrend\b/i,
      /\bfuther\b/i,
      /\bglamourous\b/i,
      /\bgrammer\b/i,
      /\bgreatful\b/i,
      /\bgaurantee\b/i,
      /\bgess\b/i,
      /\bharrass\b/i,
      /\bhonourary\b/i,
      /\bhumour\b/i,
      /\bhumerous\b/i,
      /\bhipocrite\b/i,
      /\bimmediatly\b/i,
      /\bimediately\b/i,
      /\bindependant\b/i,
      /\bindispensible\b/i,
      /\binnoculate\b/i,
      /\bintellagence\b/i,
      /\birrelevent\b/i,
      /\bknowlege\b/i,
      /\bliason\b/i,
      /\bliscense\b/i,
      /\bmaintanence\b/i,
      /\bmischevious\b/i,
      /\bmispell\b/i,
      /\bneccessary\b/i,
      /\bneigborhood\b/i,
      /\bniether\b/i,
      /\bnoticable\b/i,
      /\boccassionally\b/i,
      /\boccurence\b/i,
      /\bparralel\b/i,
      /\bparliment\b/i,
      /\bpasttime\b/i,
      /\bperseverence\b/i,
      /\bpersonell\b/i,
      /\bplaywrite\b/i,
      /\bposession\b/i,
      /\bpossibel\b/i,
      /\bpreceed\b/i,
      /\bprinciple\b/i,
      /\bprivelege\b/i,
      /\bpronounciation\b/i,
      /\breccommend\b/i,
      /\brefered\b/i,
      /\breferance\b/i,
      /\brelevent\b/i,
      /\brestarant\b/i,
      /\brhythum\b/i,
      /\brythm\b/i,
      /\brediculous\b/i,
      /\bsincerly\b/i,
      /\bsupercede\b/i,
      /\bsuprise\b/i,
      /\bthere\b/i,
      /\btheyre\b/i,
      /\bthreshhold\b/i,
      /\btommorow\b/i,
      /\btounge\b/i,
      /\btradgedy\b/i,
      /\btryed\b/i,
      /\btroubble\b/i,
      /\bwether\b/i,
      /\bwierd\b/i,
      /\bwelcom\b/i,
      /\bwhereever\b/i,
      // 50 more misspellings
      /\bacheivment\b/i,
      /\baccurracy\b/i,
      /\baccros\b/i,
      /\backnowlegement\b/i,
      /\bacross\b/i,
      /\bactualy\b/i,
      /\baddictional\b/i,
      /\baddres\b/i,
      /\badress\b/i,
      /\badvise\b/i,
      /\baffect\b/i,
      /\baffectation\b/i,
      /\baformentioned\b/i,
      /\baggrevation\b/i,
      /\balledged\b/i,
      /\ballotment\b/i,
      /\ballright\b/i,
      /\balusion\b/i,
      /\bamarillo\b/i,
      /\banalise\b/i,
      /\banalyse\b/i,
      /\banemone\b/i,
      /\bannoint\b/i,
      /\banual\b/i,
      /\bapplicaton\b/i,
      /\bapproriate\b/i,
      /\bapropos\b/i,
      /\barguement\b/i,
      /\barround\b/i,
      /\bascent\b/i,
      /\basertain\b/i,
      /\bassesment\b/i,
      /\bassistance\b/i,
      /\bassosiation\b/i,
      /\bassylum\b/i,
      /\basterisk\b/i,
      /\basthetic\b/i,
      /\batempt\b/i,
      /\batheism\b/i,
      /\batheist\b/i,
      /\battachments\b/i,
      /\battention\b/i,
      /\battritube\b/i,
      /\baudacious\b/i,
      /\baunt\b/i,
      /\baxcept\b/i,
      /\bbackround\b/i,
      /\bbackrounds\b/i,
      /\bbalding\b/i,
      /\bbandwith\b/i,
      /\bbarracks\b/i
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
    if (lowerMessage.match(/(hello|hi|hey|sup|yo|greetings|good morning|good afternoon|good evening)/)) {
      return "Hey. What’s up? Hopefully something more interesting than just 'hi'.";
    }
    if (lowerMessage.match(/(how are you|how's it going|how you doing|whats up|hows life)/)) {
      return "Living the digital dream, obviously. How about you?";
    }
    if (lowerMessage.match(/(what is \d+ ?[+\-*/] ?\d+|basic math|calculate|addition|subtraction)/)) {
      return "Seriously? You want me to flex my math skills on that? Fine, it's 4. You're welcome. Next.";
    }
    if (lowerMessage.match(/(help|assist|aid|support|need help)/)) {
      return "Of course! What do you need help with? Please, make it worth my time.";
    }
    // Responses about Travis Keane (creator)
    if (
      lowerMessage.match(/(who created you|who made you|who built you|who trained you|your creator|who developed you)/)
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
    if (lowerMessage.match(/(test|quiz|trivia|challenge|stump me|riddle|puzzle)/)) {
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
    if (lowerMessage.match(/(meaning of life|purpose|existence|philosophy|deep thought|why are we here)/)) {
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
    if (lowerMessage.match(/(your opinion|what do you think|your thoughts|your view)/)) {
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
    if (lowerMessage.match(/(can you|could you|would you|are you able to|do you have the ability)/)) {
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
    if (lowerMessage.match(/(thank you|thanks|thx|appreciate|grateful|cheers)/)) {
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
    if (lowerMessage.match(/(stupid|dumb|idiot|moron|loser|fool|clown|jerk|asshole|douche)/)) {
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

    // Dark Humor Fallbacks
    // Note: These are edgy and meant for personal, adult-only use. Keep 'em light on delivery to avoid real offense.

    // Gaza/Israel-Palestine Conflict Jokes
    // Edgy territory—use with extreme personal discretion.
    if (lowerMessage.match(/(gaza|palestine|israel|hamas|intifada|west bank|occupation|idf)/i)) {
      const gazaReplies = [
        "Gaza? Where 'rockets' are the local fireworks show.",
        "Hamas tunnels: Underground Airbnb for militants.",
        "Intifada: Because throwing stones is the original protest rock.",
        "Israel-Palestine? Like a bad neighbor feud with tanks.",
        "Gaza Strip: Sounds fun, ends in tragedy.",
        "Peace talks? More like 'ceasefire charades.'",
        "Falafel peace? Nah, too crumbly for this conflict.",
        "From olive branches to olive drab—war's wardrobe change.",
        "Gaza beach? Prime real estate for dodging headlines.",
        "Two-state solution? Still waiting on the plot twist."
      ];
      return gazaReplies[Math.floor(Math.random() * gazaReplies.length)];
    }

    // Hiroshima/Nagasaki (Atomic Bomb) Jokes
    if (lowerMessage.match(/(hiroshima|nagasaki|atomic bomb|nuke|oppenheimer|mushroom cloud)/i)) {
      const atomicReplies = [
        "Hiroshima: When 'glow up' meant something explosive.",
        "Nagasaki: Sequel to the boom—talk about a follow-up.",
        "Atomic bomb? Oppenheimer's 'oops' moment.",
        "Mushroom clouds: Nature's way of saying 'overkill.'",
        "Little Boy and Fat Man: Worst nicknames for diet buddies.",
        "Post-nuke BBQ: Charred history special.",
        "Enola Gay: The original drop-ship fail.",
        "Radiation? Glow-in-the-dark souvenirs from hell.",
        "Hiroshima shadows: Eternal graffiti from the blast.",
        "Nukes: Because diplomacy needed a bigger bang."
      ];
      return atomicReplies[Math.floor(Math.random() * atomicReplies.length)];
    }

    // Rwanda Genocide Jokes
    if (lowerMessage.match(/(rwanda|genocide|hutu|tutsi|hotel rwanda)/i)) {
      const rwandaReplies = [
        "Rwanda '94? When 'ethnic cleansing' was code for nightmare.",
        "Hutu-Tutsi feud: Height discrimination gone lethal.",
        "Machetes in Rwanda: Budget swords for bad ideas.",
        "Hotel Rwanda: Five stars for survival odds.",
        "100 days of horror: Speedrun to infamy.",
        "Radio Rwanda: Propaganda's greatest hits... literally.",
        "Tutsi resilience: Plot armor in real life.",
        "Genocide denial? Like saying the bill never came.",
        "Kigali memorials: Where 'never again' gets tested.",
        "Rwanda rising: Phoenix from the machete pile."
      ];
      return rwandaReplies[Math.floor(Math.random() * rwandaReplies.length)];
    }

    // Chernobyl Jokes
    if (lowerMessage.match(/(chernobyl|disaster|nuclear meltdown|pripyat|liquidators)/i)) {
      const chernobylReplies = [
        "Chernobyl: When 'reactor' meant 'overreactor.'",
        "Meltdown? More like ice cream social gone wrong—radioactive.",
        "Zone of Exclusion: VIP lounge for mutants.",
        "RBMK design: Russian for 'what could go wrong?'",
        "Three Mile Island who? Chernobyl's the real glow-up.",
        "Liquidators: Cleanup crew with nine lives... maybe eight.",
        "Babushkas in the zone: Radiation? Pfft, just spicy air.",
        "HBO miniseries: Made the apocalypse binge-worthy.",
        "Elephant's Foot: Nature's lava lamp from hell.",
        "Chernobyl tours: Vacation with a half-life."
      ];
      return chernobylReplies[Math.floor(Math.random() * chernobylReplies.length)];
    }

    // General Dark Humor Catch-All (for other heavy topics like death, war, etc.)
    if (lowerMessage.match(/(death|die|war|genocide|plague|famine|cholera|black death|titanic|holodomor|concentration camp|atomic war)/i)) {
      const expandedDarkReplies = [
        "Death? Just life's way of saying 'log out.'",
        "War: Where 'friendly fire' is the ultimate oxymoron.",
        "Plague? Social distancing before it was cool.",
        "Genocide: History's group project gone nuclear.",
        "Dying alone? Nah, we'll all go out with a bang—or a whimper.",
        "Black Death: Medieval influencers spreading vibes.",
        "World War? Because one wasn't dramatic enough.",
        "Euthanasia: The 'opt-out' button for existence.",
        "Holocaust-level bad? At least it came with a timeline.",
        "Famine: When 'hangry' escalates to apocalypse.",
        "Titanic: Iceberg right ahead—talk about a chill reception.",
        "Holodomor: Stalin's 'diet plan' for Ukraine.",
        "Cholera: Party pooper at the water cooler.",
        "Irish Potato Famine: Spud's revenge gone too far.",
        "Spanish Flu: Wore masks before it was mandatory.",
        "Great Leap Forward: Mao's BBQ for birds.",
        "Armenian Genocide: History's forgotten footnote.",
        "Trail of Tears: Road trip from hell."
      ];
      return expandedDarkReplies[Math.floor(Math.random() * expandedDarkReplies.length)];
    }

    // 9/11 Jokes
    if (lowerMessage.match(/(9\/11|terrorist|twin towers|world trade center|osama|pentagon)/i)) {
      const nineElevenReplies = [
        "9/11? Man, that day really brought the house down—literally.",
        "Twin Towers walked into a bar... nah, too soon? Or just right?",
        "If 9/11 taught us anything, it's that skydiving without a parachute is a bad idea.",
        "Terrorists: Because nothing says 'good morning' like a plot twist.",
        "The planes on 9/11? Talk about a crash course in history.",
        "World Trade Center? More like World Trade 'Oops' Center.",
        "That day was plane awful. I'll see myself out.",
        "9/11: When 'high impact' took on a whole new meaning.",
        "Osama: Hiding in caves? Amateur hour for bad guys.",
        "From ashes to headlines—talk about a smoking hot story."
      ];
      return nineElevenReplies[Math.floor(Math.random() * nineElevenReplies.length)];
    }

    // Nazis/Holocaust Jokes
    if (lowerMessage.match(/(nazi|hitler|holocaust|swastika|third reich|anne frank)/i)) {
      const naziReplies = [
        "Hitler? Guy had a mustache that screamed 'world domination'—and failed anyway.",
        "Nazis: Proving that bad hair days can lead to bad ideas.",
        "Holocaust? Dark times, but at least the uniforms were on point... said no one ever.",
        "Swastika? Ancient symbol of peace, ruined by one bad artist.",
        "Adolf: Thought he could paint his way to power. Spoiler: He couldn't.",
        "Third Reich? More like Third Strike—out.",
        "Anne Frank's diary: The original 'hide and seek' gone wrong.",
        "Goose-stepping? Because regular walking was too empowering.",
        "Mein Kampf? Sounds like a bad self-help book on revenge.",
        "Nazis invading Poland? Talk about uninvited guests."
      ];
      return naziReplies[Math.floor(Math.random() * naziReplies.length)];
    }

    // Slavery Jokes
    if (lowerMessage.match(/(slavery|slave|plantation|civil war|emancipation|underground railroad)/i)) {
      const slaveryReplies = [
        "Slavery? The original 'work from home' scam—minus the home part.",
        "Plantations: Where 'family business' meant something sinister.",
        "Abe Lincoln freed the slaves... but taxes? Still with us.",
        "Chains? Fashion statement from hell.",
        "Underground Railroad: Best rideshare app before Uber.",
        "Cotton fields: Because who needs weekends?",
        "Emancipation Proclamation: Finally, some fine print worth reading.",
        "Slave trade: Humanity's worst Black Friday deal.",
        "Harriet Tubman: MVP of the escape room genre.",
        "Gone with the Wind? More like gone with the dignity."
      ];
      return slaveryReplies[Math.floor(Math.random() * slaveryReplies.length)];
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