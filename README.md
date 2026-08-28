# NovaBot — AI Chat Assistant

A beginner-friendly AI project built with **HTML, CSS, and JavaScript only** — no
backend, no API key, no external AI service. It runs entirely in the browser.

## What makes this "AI"?

NovaBot uses **intent matching**, a real and classic AI/NLU technique:

1. It keeps a list of *intents* (things a user might want), each with example
   *patterns* (ways people phrase that intent) and possible *responses*.
2. When you type a message, NovaBot scores it against every intent based on
   keyword overlap.
3. It replies using the response set from whichever intent scored highest.
4. If nothing scores well enough, it falls back to an "I don't understand"
   reply.

This is the same core idea used by early chatbots (and still used today for
simple, fast, offline assistants) before more advanced machine learning
models took over.

## Files

```
ai-chatbot-project/
├── index.html   → page structure and chat UI
├── style.css    → dark-themed chat interface styling
├── script.js    → the "AI" logic (intents, matching, replies)
└── README.md    → this file
```

## How to run it

1. Extract the zip file.
2. Double-click `index.html` — it opens directly in your browser. No install,
   no server needed.
3. Or, in VS Code, right-click `index.html` → "Open with Live Server" for
   auto-refresh while you edit.

## How to extend it (make it smarter)

Open `script.js` and look at the `intents` array near the top. To teach
NovaBot something new, add an object like this:

```javascript
{
  tag: 'weather',
  patterns: ['weather', 'is it raining', 'temperature outside'],
  responses: [
    "I can't check live weather since I don't connect to the internet, but you could hook me up to a weather API!"
  ]
}
```

## Leveling this up further (optional next steps)

- **Connect a real API**: swap the rule-based `getResponse()` function for a
  call to a real AI API (like the Anthropic API) to get genuinely intelligent
  replies instead of pattern-matched ones. This requires a backend or a
  secure way to store an API key — never put a real API key directly in
  front-end JavaScript that gets shared publicly.
- **Add memory**: store the last few messages in an array and reference them
  for more context-aware replies.
- **Add voice input/output**: use the browser's built-in `SpeechRecognition`
  and `SpeechSynthesis` APIs for a voice assistant feel.

## Uploading to GitHub

```
git init
git add .
git commit -m "Initial commit: NovaBot AI chatbot"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

Then enable **GitHub Pages** (Settings → Pages → deploy from `main` branch)
to get a free live link to share.
