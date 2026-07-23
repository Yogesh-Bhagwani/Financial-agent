# 📊 Autonomous Financial & Stock Research Agent

An AI-powered financial research platform that autonomously analyzes stocks, gathers real-time market data, and generates comprehensive investment reports using Large Language Models (LLMs).

Built with the **Agno Framework**, **Groq Llama-3.3-70B**, **FastAPI**, **React**, **Vite**, **Tailwind CSS**, and **Shadcn UI**, the application combines autonomous reasoning, live web search, and financial data retrieval into a seamless user experience.

---

## 🚀 Features

- 🤖 Autonomous AI agent powered by Agno Framework
- 📈 Real-time stock market analysis using Yahoo Finance
- 🌐 Live web search integration with DuckDuckGo
- 💬 Multi-step reasoning and autonomous tool selection
- ⚡ Streaming AI responses using FastAPI StreamingResponse
- 🎨 Modern responsive dashboard built with React + Tailwind CSS
- 🌙 Beautiful dark mode interface
- 📊 Markdown-based financial report rendering
- 🔍 Live agent execution logs for debugging and transparency

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Shadcn UI
- React Markdown
- Lucide React

### Backend
- FastAPI
- Agno Framework
- Groq API (Llama-3.3-70B-Versatile)
- Yahoo Finance API
- DuckDuckGo Search (DDGS)
- Python
- Uvicorn

---

## 📂 Project Structure

```
financial-agent/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env
│   └── ...
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/financial-agent.git

cd financial-agent
```

---

# Backend Setup

Navigate to the server folder

```bash
cd server
```

Create a virtual environment

```bash
python -m venv .venv
```

Activate the virtual environment

### Windows

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file

```env
GROQ_API_KEY=your_groq_api_key
PORT=8000
```

Run the backend

```bash
python app.py
```

Backend will run at

```
http://localhost:8000
```

Swagger Documentation

```
http://localhost:8000/docs
```

---

# Frontend Setup

Navigate to the client folder

```bash
cd client
```

Install dependencies

```bash
npm install
```

Run the frontend

```bash
npm run dev
```

Frontend will run at

```
http://localhost:5173
```

---

# 🧠 How It Works

1. User submits a stock-related query.
2. The AI agent analyzes the request.
3. The agent autonomously selects the required tools.
4. Yahoo Finance retrieves live financial metrics.
5. DuckDuckGo fetches recent news and market updates.
6. The LLM performs reasoning over collected information.
7. A comprehensive investment report is streamed back to the user in real time.

---

# 📊 AI Agent Workflow

```
            User Query
                 │
                 ▼
      Autonomous AI Agent
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
Yahoo Finance API     DuckDuckGo Search
      │                     │
      └──────────┬──────────┘
                 ▼
        Llama-3.3-70B (Groq)
                 │
                 ▼
      Streaming Financial Report
                 │
                 ▼
           React Dashboard
```

---

# 🌐 Deployment

## Backend (Render)

**Root Directory**

```
server
```

**Build Command**

```bash
pip install -r requirements.txt
```

**Start Command**

```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

Environment Variables

```env
GROQ_API_KEY=your_api_key
```

---

## Frontend (Vercel)

**Framework**

```
Vite
```

**Root Directory**

```
client
```

Environment Variables

```env
VITE_BACKEND_URL=https://your-render-url.onrender.com
```

Deploy and enjoy!

---


# 📌 Future Enhancements

- Portfolio Management
- Technical Indicator Analysis
- Company Financial Statement Analysis
- News Sentiment Analysis
- Stock Price Prediction
- User Authentication
- Watchlist Management
- Chat History
- PDF Report Export
- Multi-Agent Collaboration

---

# 👨‍💻 Author

**Yogesh Kumar**

- Full Stack Developer
- ServiceNow CSA & CAD Certified
- AI & Agentic Application Developer

---

⭐ If you found this project helpful, don't forget to star the repository!