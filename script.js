/* ============================================================
   NovaBot — a rule-based AI chat assistant
   ------------------------------------------------------------
   This is a genuine (if simple) AI technique: intent matching.
   Each "intent" has a list of example patterns. When the user
   types something, we score their message against every intent
   by counting matching keywords, and reply with the best match.
   This is the same basic idea behind early chatbots and a
   simplified version of what real NLU systems do before deep
   learning got involved.
   ============================================================ */

const chatWindow = document.getElementById('chat-window');
const inputForm = document.getElementById('input-form');
const userInput = document.getElementById('user-input');
const suggestions = document.getElementById('suggestions');

/* ----------------------------
   1. Knowledge base of intents
   ---------------------------- */
const intents = [
  {
    tag: 'greeting',
    patterns: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'yo', 'sup'],
    responses: [
      "Hey there! I'm NovaBot. Ask me anything.",
      "Hello! What's on your mind today?",
      "Hi! How can I help you?"
    ]
  },
  {
    tag: 'goodbye',
    patterns: ['bye', 'goodbye', 'see you', 'later', 'cya', 'exit'],
    responses: [
      "Goodbye! Come back anytime.",
      "See you later!",
      "Take care!"
    ]
  },
  {
    tag: 'thanks',
    patterns: ['thanks', 'thank you', 'appreciate', 'thx'],
    responses: [
      "You're welcome!",
      "Anytime!",
      "Glad I could help."
    ]
  },
  {
    tag: 'about',
    patterns: ['who are you', 'what are you', 'who made you', 'your name', 'created you'],
    responses: [
      "I'm NovaBot, a rule-based chat assistant built entirely with HTML, CSS, and JavaScript — no external AI API required.",
      "I'm a small AI project! I match your message against known patterns to figure out the best reply."
    ]
  },
  {
    tag: 'capabilities',
    patterns: ['what can you do', 'help', 'features', 'what do you do'],
    responses: [
      "I can chat with you, tell jokes, tell you the time and date, and answer simple questions. Try the suggestion chips below!",
      "Right now I understand greetings, jokes, time/date questions, and small talk. I'm intentionally simple so you can read my code and extend me."
    ]
  },
  {
    tag: 'joke',
    patterns: ['joke', 'make me laugh', 'funny', 'tell me something funny'],
    responses: [
      "Why do programmers prefer dark mode? Because light attracts bugs.",
      "I told my computer I needed a break, and it said no problem — it froze immediately.",
      "There are 10 types of people in the world: those who understand binary, and those who don't."
    ]
  },
  {
    tag: 'time',
    patterns: ["what's the time", 'what time is it', 'current time', 'time now'],
    responses: [] // handled dynamically
  },
  {
    tag: 'date',
    patterns: ["what's the date", "today's date", 'what day is it', 'current date'],
    responses: [] // handled dynamically
  },
  {
    tag: 'mood',
    patterns: ['how are you', 'how do you feel', 'are you ok'],
    responses: [
      "I'm just code, so I don't have feelings — but I'm running smoothly! How are you doing?",
      "Doing great, thanks for asking! What about you?"
    ]
  },
  {
    tag: 'compliment',
    patterns: ['you are smart', 'you are cool', 'good bot', 'nice bot', 'i like you'],
    responses: [
      "Thank you! I try my best with the logic I've been given.",
      "That's kind of you to say!"
    ]
  }
];

const fallbackResponses = [
  "I'm not sure I understand that yet — I'm a simple rule-based bot. Try one of the suggestions below!",
  "Hmm, I don't have a pattern that matches that. Could you rephrase it?",
  "I don't know that one yet. My creator can teach me by adding it to the intents list in script.js!"
];

/* ----------------------------
   2. Matching logic
   ---------------------------- */
function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s']/g, '').trim();
}

function scoreIntent(userText, intent) {
  const words = userText.split(/\s+/);
  let score = 0;

  intent.patterns.forEach(pattern => {
    const patternNorm = normalize(pattern);
    // Exact phrase match scores highest
    if (userText.includes(patternNorm)) {
      score += patternNorm.split(/\s+/).length * 2;
    }
    // Partial word overlap adds a little too
    patternNorm.split(/\s+/).forEach(pw => {
      if (words.includes(pw)) score += 1;
    });
  });

  return score;
}

function getResponse(rawText) {
  const userText = normalize(rawText);

  if (userText === '') {
    return "Type something and I'll try to respond!";
  }

  // Dynamic intents first
  if (intents.find(i => i.tag === 'time').patterns.some(p => userText.includes(normalize(p)))) {
    const now = new Date();
    return `It's currently ${now.toLocaleTimeString()} on your device.`;
  }
  if (intents.find(i => i.tag === 'date').patterns.some(p => userText.includes(normalize(p)))) {
    const now = new Date();
    return `Today is ${now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
  }

  // Score every intent, pick the best
  let bestIntent = null;
  let bestScore = 0;

  intents.forEach(intent => {
    const score = scoreIntent(userText, intent);
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  });

  if (bestIntent && bestIntent.responses.length > 0) {
    const list = bestIntent.responses;
    return list[Math.floor(Math.random() * list.length)];
  }

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

/* ----------------------------
   3. UI rendering
   ---------------------------- */
function timestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `msg ${sender}`;
  msg.innerHTML = `${escapeHtml(text)}<span class="msg-time">${timestamp()}</span>`;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'typing';
  typing.id = 'typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

function handleUserMessage(text) {
  if (!text.trim()) return;
  addMessage(text, 'user');
  userInput.value = '';

  showTyping();
  const delay = 500 + Math.random() * 700; // feels more natural than an instant reply
  setTimeout(() => {
    hideTyping();
    const reply = getResponse(text);
    addMessage(reply, 'bot');
  }, delay);
}

/* ----------------------------
   4. Event listeners
   ---------------------------- */
inputForm.addEventListener('submit', e => {
  e.preventDefault();
  handleUserMessage(userInput.value);
});

suggestions.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (chip) {
    handleUserMessage(chip.dataset.msg);
  }
});

/* ----------------------------
   5. Welcome message on load
   ---------------------------- */
window.addEventListener('DOMContentLoaded', () => {
  addMessage("Hi! I'm NovaBot, a simple AI assistant built with HTML, CSS & JavaScript. Ask me something, or tap a suggestion below.", 'bot');
});
