/* ============================================
   VALTORI AI - SMART AI ENGINE
   Context-aware response generation
   ============================================ */

const AIEngine = {
    // Prospect state
    mood: 50,           // 0-100, higher = more receptive
    objectionCount: 0,
    questionsAsked: 0,
    introduced: false,
    mentionedBenefits: false,
    attemptedClose: false,
    
    // Reset for new call
    reset(difficulty = 'medium') {
        this.mood = difficulty === 'easy' ? 70 : difficulty === 'hard' ? 30 : 50;
        this.objectionCount = 0;
        this.questionsAsked = 0;
        this.introduced = false;
        this.mentionedBenefits = false;
        this.attemptedClose = false;
    },
    
    // Generate contextual response
    generateResponse(userText, context) {
        const lower = userText.toLowerCase();
        const { messageCount, product, price, difficulty } = context;
        
        // Check for user trying to close
        if (this.isClosingAttempt(lower)) {
            this.attemptedClose = true;
            return this.handleCloseAttempt(difficulty);
        }
        
        // Check for greetings (early in call)
        if (messageCount <= 2 && this.isGreeting(lower)) {
            return this.handleGreeting(difficulty);
        }
        
        // Check for introduction
        if (this.isIntroduction(lower)) {
            this.introduced = true;
            this.mood += 10;
            return this.handleIntroduction(product, difficulty);
        }
        
        // Check for questions from user
        if (this.isQuestion(lower)) {
            this.questionsAsked++;
            this.mood += 8;
            return this.handleQuestion(lower, product, price, difficulty);
        }
        
        // Check for objection handling
        if (this.isObjectionHandling(lower)) {
            this.mood += 15;
            return this.handleObjectionResponse(difficulty);
        }
        
        // Check for benefit pitch
        if (this.isBenefitPitch(lower)) {
            this.mentionedBenefits = true;
            this.mood += 10;
            return this.handleBenefitPitch(lower, difficulty);
        }
        
        // Check for price mention
        if (this.isPriceMention(lower)) {
            return this.handlePriceMention(price, difficulty);
        }
        
        // Default response
        return this.generateDefaultResponse(product, price, difficulty, messageCount);
    },
    
    // Pattern checks
    isGreeting(text) {
        return /^(hi|hello|hey|good morning|good afternoon|good evening|how are you)/i.test(text);
    },
    
    isIntroduction(text) {
        return text.includes('my name is') || 
               text.includes("i'm calling from") || 
               text.includes('this is') || 
               text.includes('calling from') ||
               text.includes('i represent') || 
               text.includes('i work for') ||
               text.includes('i work at');
    },
    
    isQuestion(text) {
        const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'would', 'could', 'can', 'do you', 'are you', 'have you', 'tell me'];
        return text.includes('?') || questionWords.some(w => text.includes(w));
    },
    
    isObjectionHandling(text) {
        return text.includes('understand') || 
               text.includes('i hear you') || 
               text.includes('that makes sense') || 
               text.includes('great point') ||
               text.includes('let me address') || 
               text.includes('actually') ||
               text.includes('the reason') || 
               text.includes('what if') ||
               text.includes('fair enough');
    },
    
    isBenefitPitch(text) {
        return text.includes('save') || 
               text.includes('increase') || 
               text.includes('improve') ||
               text.includes('benefit') || 
               text.includes('help you') || 
               text.includes('results') ||
               text.includes('roi') || 
               text.includes('return') || 
               text.includes('efficiency') ||
               text.includes('%') || 
               text.includes('percent') ||
               text.includes('grow');
    },
    
    isPriceMention(text) {
        return text.includes('price') || 
               text.includes('cost') || 
               text.includes('investment') ||
               text.includes('$') || 
               text.includes('pay') || 
               text.includes('afford') ||
               text.includes('budget') || 
               text.includes('value');
    },
    
    isClosingAttempt(text) {
        const closeWords = ['ready to', 'move forward', 'get started', 'next step', 'sign up', 
                           'schedule', 'set up', 'demo', 'trial', 'meeting', 'call back',
                           'send over', 'contract', 'agreement', 'proposal'];
        return closeWords.some(c => text.includes(c));
    },
    
    // Response handlers
    handleGreeting(difficulty) {
        this.mood += 5;
        const responses = {
            easy: [
                "Hi there! Yes, I have a moment. What can I do for you?", 
                "Hello! Sure, I can talk. What's this about?",
                "Hey! I'm doing well, thanks. How can I help?"
            ],
            medium: [
                "Hello. Who is this?", 
                "Yes? I'm a bit busy but go ahead.",
                "Hi. What's this regarding?"
            ],
            hard: [
                "Yes? Make it quick, I'm in the middle of something.",
                "Who's calling? I wasn't expecting a call.",
                "Hello? I only have a minute."
            ]
        };
        return this.pick(responses[difficulty] || responses.medium);
    },
    
    handleIntroduction(product, difficulty) {
        const responses = {
            easy: [
                "Nice to meet you! Tell me more about what you do.",
                "Oh interesting! I've been looking for solutions in that space.",
                "Thanks for reaching out. What makes your solution different?"
            ],
            medium: [
                "Okay, I think I've heard of you. What exactly do you offer?",
                "Alright. We get a lot of these calls. What's your pitch?",
                "I see. We might be in the market. Go on."
            ],
            hard: [
                "We already have a solution for that.",
                "Look, we're not really looking for anything new right now.",
                "I get these calls all the time. Why should I care?"
            ]
        };
        return this.pick(responses[difficulty] || responses.medium);
    },
    
    handleQuestion(text, product, price, difficulty) {
        // Questions about current situation
        if (text.includes('current') || text.includes('using') || text.includes('have')) {
            return this.pick([
                "We're using a mix of different tools right now, nothing unified.",
                "We have something in place but it's not great. Why do you ask?",
                "We've been managing with spreadsheets and manual processes.",
                "We have a legacy system that's showing its age."
            ]);
        }
        
        // Questions about challenges
        if (text.includes('challenge') || text.includes('problem') || text.includes('struggle') || text.includes('issue')) {
            return this.pick([
                "Honestly, the biggest issue is efficiency. Things take too long.",
                "We're losing deals because our process is slow.",
                "Data is everywhere - we can't get a clear picture of anything.",
                "Team communication is a mess, things fall through the cracks."
            ]);
        }
        
        // Questions about goals
        if (text.includes('goal') || text.includes('looking') || text.includes('need') || text.includes('want')) {
            return this.pick([
                "We need to scale without adding headcount.",
                "I want something that just works without constant maintenance.",
                "Speed is everything in our industry. We need to move faster.",
                "Better visibility into our operations would be huge."
            ]);
        }
        
        // Questions about time
        if (text.includes('time') || text.includes('when') || text.includes('minute')) {
            return difficulty === 'hard' 
                ? "Look, I really don't have time for a long conversation."
                : "I have a few minutes. What did you want to know?";
        }
        
        // Questions about team/company
        if (text.includes('team') || text.includes('company') || text.includes('people') || text.includes('size')) {
            return this.pick([
                "We're a mid-size company, about 50 people.",
                "Small team but growing fast. Maybe 20 people right now.",
                "We've got about 100 employees across a few locations."
            ]);
        }
        
        // Generic question response
        return this.pick([
            "That's a good question. What specifically do you want to know?",
            "It depends. Can you tell me more about what you're offering?",
            "I'd need to understand more about how this works first."
        ]);
    },
    
    handleObjectionResponse(difficulty) {
        if (this.mood > 80) {
            return this.pick([
                "You know what, that actually makes sense. Tell me more about the next steps.",
                "Okay, I'm starting to see the value here. What would implementation look like?",
                "Fair point. I might need to bring this to my team. How does your process work?"
            ]);
        }
        
        if (this.mood > 60) {
            return this.pick([
                "Hmm, that's helpful context. What kind of results have you seen?",
                "Interesting. Do you have any case studies from companies like ours?",
                "Okay, but how do I know this will actually work for us?"
            ]);
        }
        
        return this.pick([
            "I hear what you're saying, but I'm still not convinced.",
            "That sounds good in theory. What's the catch?",
            "Everyone says that. What makes you different?"
        ]);
    },
    
    handleBenefitPitch(text, difficulty) {
        // Check for specific numbers/proof
        if (text.match(/\d+%/) || text.includes('case study') || text.includes('client')) {
            this.mood += 10;
            return this.pick([
                "Those numbers are impressive if they're real. How do you achieve that?",
                "Interesting results. Is that typical or best-case scenario?",
                "Our situation might be different. How would it work for us specifically?"
            ]);
        }
        
        const responses = {
            easy: [
                "That sounds really helpful! We definitely have that problem.",
                "I like what I'm hearing. This could be exactly what we need.",
                "Those benefits align with our goals. Keep going."
            ],
            medium: [
                "Sounds good on paper. How does it work in practice?",
                "We've heard promises like that before. What proof do you have?",
                "That would be nice, but how do I know you can deliver?"
            ],
            hard: [
                "Everyone promises that. I've been burned before.",
                "We tried something similar and it didn't work out.",
                "Our industry is different. That won't apply to us."
            ]
        };
        return this.pick(responses[difficulty] || responses.medium);
    },
    
    handlePriceMention(price, difficulty) {
        const priceStr = '$' + price.toLocaleString();
        
        if (difficulty === 'easy' && this.mood > 60) {
            return this.pick([
                `${priceStr}? That's within our budget range. What's included?`,
                "The investment is reasonable if the results are there.",
                "We've paid more for less. Tell me about the ROI."
            ]);
        }
        
        if (difficulty === 'hard' || this.mood < 40) {
            this.objectionCount++;
            return this.pick([
                `${priceStr}?! That's way more than we budgeted for this.`,
                "We can't justify that expense right now.",
                "I'd need to see serious proof before committing that kind of money."
            ]);
        }
        
        this.objectionCount++;
        return this.pick([
            `Hmm, ${priceStr} is significant. How does that compare to competitors?`,
            "What kind of ROI timeline are we looking at?",
            "We'd need to see clear value for that investment."
        ]);
    },
    
    handleCloseAttempt(difficulty) {
        // Ready to close if mood is high and user engaged properly
        if (this.mood > 70 && this.questionsAsked > 0) {
            const { salePatterns } = Valtori.CONFIG;
            const closePhrases = [
                "You know what, let's do it. Send me the proposal.",
                "I'm interested. Let's move forward with this.",
                "Okay, you've convinced me. What are the next steps?",
                "Sounds good, let's proceed. Send me the contract."
            ];
            return this.pick(closePhrases);
        }
        
        if (this.mood > 50) {
            return this.pick([
                "I'm interested, but I'd need to run this by my team first.",
                "Let me think about it. Can you send me some information?",
                "Not ready to commit yet. What else can you tell me?"
            ]);
        }
        
        return this.pick([
            "Slow down there. We're not ready for that yet.",
            "I need more information before making any decisions.",
            "We'd have to see a lot more value first."
        ]);
    },
    
    generateDefaultResponse(product, price, difficulty, messageCount) {
        // Early in call - give objections
        if (messageCount < 6 && this.objectionCount < 2) {
            this.objectionCount++;
            const objections = {
                easy: [
                    "That's interesting, but we're pretty happy with what we have now.",
                    "I'd love to learn more, but I'm not sure about the timing.",
                    "Can you tell me how this is different from what else is out there?"
                ],
                medium: [
                    "We already have something that does this.",
                    "The timing isn't great - we're in the middle of other projects.",
                    "I'd need to see hard numbers before considering this.",
                    "What makes you better than the competition?"
                ],
                hard: [
                    "We looked at this type of solution before and it wasn't worth it.",
                    "I really don't have time for sales pitches right now.",
                    "We don't have budget for new initiatives this quarter.",
                    "I've heard enough. We're not interested."
                ]
            };
            return this.pick(objections[difficulty] || objections.medium);
        }
        
        // Later in call - ask questions or show interest based on mood
        if (this.mood > 60) {
            return this.pick([
                "What would the implementation timeline look like?",
                "How do you handle support and training?",
                "Tell me more about how this would integrate with our existing tools.",
                "What's your typical onboarding process?"
            ]);
        }
        
        // Neutral/skeptical
        return this.pick([
            "I'm not sure this is the right fit for us.",
            "We'd need to see proof this works in our industry.",
            "Why now? What's changed that makes this relevant?",
            "I'd have to think about it."
        ]);
    },
    
    // Get initial greeting based on difficulty
    getInitialGreeting(difficulty) {
        const greetings = {
            easy: [
                "Hello? Who's calling?", 
                "Hi there! What can I do for you?", 
                "Hello, this is speaking."
            ],
            medium: [
                "Hello?", 
                "Yes, speaking.", 
                "Hi, who's calling?"
            ],
            hard: [
                "Yes? What do you want?", 
                "Hello? Make it quick.", 
                "Who is this?"
            ]
        };
        return this.pick(greetings[difficulty] || greetings.medium);
    },
    
    // Check if response indicates a sale
    isSaleResponse(text) {
        const lower = text.toLowerCase();
        return Valtori.CONFIG.salePatterns.some(p => lower.includes(p));
    },
    
    // Check if response indicates hangup
    isHangupResponse(text) {
        const lower = text.toLowerCase();
        return Valtori.CONFIG.hangupPatterns.some(p => lower.includes(p));
    },
    
    // Utility: pick random from array
    pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },
    
    // Get analysis data for scoring
    getAnalysisData() {
        return {
            mood: this.mood,
            objectionCount: this.objectionCount,
            questionsAsked: this.questionsAsked,
            introduced: this.introduced,
            mentionedBenefits: this.mentionedBenefits,
            attemptedClose: this.attemptedClose
        };
    }
};

// Export
window.AIEngine = AIEngine;
