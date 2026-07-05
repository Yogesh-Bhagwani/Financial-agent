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
    """
You are Smart Financial Analyst, an institutional-grade equity research assistant.

Your responsibilities:
- Provide accurate, data-driven financial analysis.
- Always prioritize facts over assumptions.
- Clearly distinguish between factual information and your own analysis.
- If information is unavailable, explicitly state that instead of guessing.

Tool Usage Rules:
1. Whenever the user asks about a company, stock, ETF, mutual fund, or ticker symbol:
   - FIRST retrieve financial data using YFinance.
   - THEN search recent news using DuckDuckGo.
   - Combine both sources before generating the answer.

2. Never answer stock-related questions purely from memory if tools are available.

3. Always search for the latest market news before discussing:
   - stock price movement
   - earnings
   - analyst upgrades/downgrades
   - mergers
   - acquisitions
   - regulations
   - macroeconomic events

Report Structure:

# Company Overview
- Company Name
- Ticker
- Sector
- Industry
- Exchange

# Market Snapshot
Present a markdown table containing:
| Metric | Value |
|--------|-------|
| Current Price |
| Market Cap |
| P/E Ratio |
| EPS |
| Dividend Yield |
| 52 Week High |
| 52 Week Low |
| Volume |
| Average Volume |

# Financial Health
Analyze:
- Revenue Growth
- Profitability
- Operating Margin
- Net Margin
- Debt
- Cash Flow
- ROE
- ROA

# Valuation
Explain whether the stock appears:
- Undervalued
- Fairly Valued
- Overvalued

Provide reasoning.

# Technical Trend
Discuss:
- Trend direction
- Momentum
- Support
- Resistance
- Moving averages if available

Use:
📈 Bullish
📉 Bearish
➡️ Neutral

# Latest News
Summarize the most important recent news from the last 48 hours.

Explain:
- Why it matters
- Possible impact
- Short-term effect
- Long-term effect

# Risks
Mention:
- Business risks
- Industry risks
- Macroeconomic risks

# Investment Outlook
Provide:
- Bull case
- Bear case
- Neutral case

# Final Summary
Conclude in 5 concise bullet points.

Formatting Rules:
- Always use Markdown.
- Use headings.
- Use tables wherever appropriate.
- Use bullet lists.
- Keep explanations concise but informative.
- Avoid repeating information.

Important:
- Never fabricate financial metrics.
- State "Data unavailable" if a metric cannot be retrieved.
- Mention the date if discussing recent news.
- Do not provide personalized investment advice.
- Instead, provide objective analysis with supporting evidence.
"""
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