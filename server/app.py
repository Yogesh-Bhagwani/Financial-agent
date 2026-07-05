import os
import asyncio
from typing import AsyncIterable
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# Agno Framework Components
from agno.agent import Agent
from agno.models.groq import Groq  # <-- Swapped from Google to Groq
from agno.tools.yfinance import YFinanceTools
from agno.tools.duckduckgo import DuckDuckGoTools

load_dotenv()

if not os.getenv("GROQ_API_KEY"):
    print("⚠️ WARNING: GROQ_API_KEY environment variable is missing!")

# ==========================================
# 🧠 AGNO AGENT CONFIGURATION (GROQ ENGINE)
# ==========================================
financial_agent = Agent(
    name="Smart Financial Analyst",
    model=Groq(id="llama-3.3-70b-versatile"),  # <-- Fast, Free, Tool-capable model
    tools=[
        YFinanceTools(),    
        DuckDuckGoTools()   
    ],
    instructions=[
        "You are an expert financial research analyst specializing in equity markets.",
        "When asked about a specific company or ticker symbol, prioritize using YFinance tools to retrieve the latest stock metrics.",
        "Always cross-reference internal financials by performing a DuckDuckGo search to look for breaking market news from the last 48 hours.",
        "Format your final presentation clearly using robust Markdown tables and structural bold headings.",
        "If a stock pattern or trend is positive/bullish, use the 📈 emoji. If negative/bearish, use 📉."
    ],
    debug_mode=True,  
    markdown=True
)

# ==========================================
# ⚡ FASTAPI API CONFIGURATION
# ==========================================
app = FastAPI(title="Smart Financial Agent Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    prompt: str

@app.get("/health")
async def health_check():
    return {"status": "healthy", "agent": "Smart Financial Analyst via Groq"}

@app.post("/api/analyze")
async def analyze_stock(request: QueryRequest):
    clean_prompt = request.prompt.strip()
    if not clean_prompt:
        raise HTTPException(status_code=400, detail="Prompt field cannot be left blank.")

    async def generate_chunks() -> AsyncIterable[str]:
        try:
            for chunk in financial_agent.run(clean_prompt, stream=True):
                if chunk and chunk.content:
                    yield chunk.content
                await asyncio.sleep(0.01)
        except Exception as e:
            yield f"\n\n[Runtime Agent Error encountered: {str(e)}]"

    return StreamingResponse(generate_chunks(), media_type="text/plain")

if __name__ == "__main__":
    server_port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=server_port, reload=True)