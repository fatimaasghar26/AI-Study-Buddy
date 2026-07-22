# 📚 AI Study Buddy

**Study smarter, not longer.**

AI Study Buddy is a lightweight, all-in-one web app for students — ask study questions in an AI chat, plan your week with a task planner, and stay focused with a Pomodoro-style timer, all in one place.

🔗 **Live app:** [ai-study-buddy-beta-hazel.vercel.app](https://ai-study-buddy-beta-hazel.vercel.app/)

![Status](https://img.shields.io/badge/status-in%20development-yellow)

![Made with](https://img.shields.io/badge/frontend-HTML%2FCSS%2FJS-blue)

![Backend](https://img.shields.io/badge/backend-Vercel%20Serverless-black)

![AI](https://img.shields.io/badge/AI-Groq%20(Llama%203.3%2070B)-orange)

![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Chat** | Ask study questions and get clear, step-by-step explanations, powered by Groq's Llama 3.3 70B model. |
| 🗂️ **Study Planner** | Add tasks with subject, due date, and priority. Filter by all / pending / done. |
| ⏱️ **Study Timer** | Pomodoro-style focus timer with custom session lengths and a session log. |
| 👤 **Account** | Sign up, log in, edit your profile, change password, and delete your account. |
| 📱 **Responsive Nav** | Collapsible navigation bar for mobile and desktop. |

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML, CSS, and JavaScript (no framework, no build step)
- **Backend:** Vercel Serverless Function (`/api/groq-chat.js`) acting as a secure proxy to the Groq API
- **AI Model:** [Groq](https://groq.com/) — `llama-3.3-70b-versatile`
- **Markdown Rendering:** [marked.js](https://marked.js.org/) for formatting AI responses
- **Storage:** Browser `localStorage` / `sessionStorage` (see [Known Limitations](#-known-limitations))
- **Hosting:** [Vercel](https://vercel.com/)

---

## 📂 Project Structure

```
AI Study Buddy/
├── api/
│   └── groq-chat.js       # Serverless function — proxies chat requests to Groq securely
├── public/
│   ├── index.html          # Landing page
│   ├── AI_Chat.html / .js  # AI chat interface + logic
│   ├── Study_Planner.html / planner.js   # Task planner
│   ├── Study_Timer.html / timer.js       # Pomodoro-style timer
│   ├── Account.html / account.js         # Sign up / log in / profile
│   ├── authGuard.js        # Blocks key actions until the user is logged in
│   ├── nav-toggle.js       # Mobile nav menu toggle
│   ├── style.css           # Global styles
│   └── icon.png            # App icon
├── package.json
└── README.md
```

---

## 🚀 Getting Started (Local Setup)

1. **Clone the repo**
   ```bash
   git clone https://github.com/fatimaasghar26/ai-study-buddy.git
   cd ai-study-buddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your Groq API key**
   Create a `.env` file in the project root:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
   Get a free key at [console.groq.com](https://console.groq.com/).

4. **Run locally with Vercel CLI**
   ```bash
   npm install -g vercel
   vercel dev
   ```
   The app will be available at `http://localhost:3000`.

5. **Deploy**
   Push to GitHub and import the repo on [vercel.com](https://vercel.com/), then add `GROQ_API_KEY` under **Project Settings → Environment Variables**.

---

## 🔒 Security Notes

The `/api/groq-chat` endpoint includes basic protections against misuse:

- **Origin check** — only accepts requests from the app's own domain(s).
- **Rate limiting** — caps each visitor to a limited number of messages per minute.
- **Payload limits** — caps conversation length and message size to control cost and prevent abuse.
- **Server-controlled instructions** — the AI's system prompt is always set server-side and can't be overridden by the client.

---

## 🗺️ Roadmap

- [ ] Hash passwords before storing (move toward a real backend + database)
- [ ] Scope planner/timer data to the logged-in user
- [ ] Add password reset flow
- [ ] Sort/filter planner tasks by due date and priority
- [ ] Persist timer state across page refresh
- [ ] Sanitize AI chat output before rendering as HTML

---

## 👩‍💻 Author

**Fatima Asghar**
GitHub: [@fatimaasghar26](https://github.com/fatimaasghar26)

---

## 📄 License

This project is licensed under the MIT License.
