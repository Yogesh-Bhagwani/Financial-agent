"use client";

import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { 
  TrendingUp, 
  Search, 
  Loader2, 
  StopCircle, 
  Sparkles, 
  Globe, 
  Database,
  Terminal
} from "lucide-react";

export default function StockAgentUI() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<"idle" | "searching" | "analyzing">("idle");
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse("");
    setAgentStatus("searching");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      if (!res.body) throw new Error("No response streaming body found.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      setAgentStatus("analyzing");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        setResponse((prev) => prev + chunkText);
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        setResponse((prev) => prev + "\n\n⏱️ **Analysis cancelled by operator.**");
      } else {
        setResponse((prev) => prev + `\n\n❌ **Error executing workflow:** ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      setAgentStatus("idle");
      abortControllerRef.current = null;
    }
  };

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-4 antialiased selection:bg-emerald-500/30">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Main Container Dashboard Card (Shadcn Architecture) */}
      <div className="w-full max-w-4xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Header Section */}
        <div className="p-6 border-b border-zinc-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-800/80 border border-zinc-700/50 rounded-xl text-emerald-400 shadow-inner">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2">
                Smart Financial Agent <span className="text-xs bg-zinc-800 text-zinc-400 font-mono px-1.5 py-0.5 rounded border border-zinc-700/60">v2.0</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">Autonomous market terminal & cross-reference network</p>
            </div>
          </div>

          {/* Dynamic Status Badges */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {agentStatus === "searching" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full animate-pulse">
                <Globe className="w-3 h-3 animate-spin" /> Fetching Live Feeds
              </span>
            )}
            {agentStatus === "analyzing" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                <Database className="w-3 h-3 text-emerald-400" /> Compiling Matrix
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700/60 rounded-full">
              <Sparkles className="w-3 h-3 text-purple-400" /> Agentic Engine Connected
            </span>
          </div>
        </div>

        {/* Console Prompt Input Form */}
        <div className="p-6 bg-zinc-950/40 border-b border-zinc-800/40">
          <form onSubmit={handleAnalyze} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Query market metrics (e.g., 'Analyze Apple (AAPL) stock performance and search recent breaking headlines')"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 text-sm text-zinc-100 placeholder-zinc-500 border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
              />
            </div>
            
            {!isLoading ? (
              <button
                type="submit"
                disabled={!prompt.trim()}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-40 disabled:hover:bg-emerald-600 shadow-md shadow-emerald-950/20 flex items-center gap-2 shrink-0"
              >
                Execute
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopStream}
                className="px-5 py-3 bg-zinc-800 hover:bg-red-950 hover:text-red-400 text-zinc-200 font-medium text-sm rounded-xl border border-zinc-700 transition-all flex items-center gap-2 shrink-0 group"
              >
                <StopCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> Stop Agent
              </button>
            )}
          </form>
        </div>

        {/* Output Stream Terminal Panel */}
        <div className="p-6 min-h-[380px] max-h-[580px] overflow-y-auto bg-zinc-950/60">
          {response ? (
            <div className="text-left text-zinc-200 text-sm space-y-4 max-w-none">
              {/* Specialized Markdown Component Object Renderers for Custom Tailwind Execution */}
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-xl font-bold text-zinc-50 border-b border-zinc-800 pb-2 mt-6 mb-4 tracking-tight" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-semibold text-zinc-100 mt-5 mb-3 tracking-tight flex items-center gap-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-base font-medium text-emerald-400 mt-4 mb-2 tracking-wide" {...props} />,
                  p: ({node, ...props}) => <p className="leading-relaxed text-zinc-300 my-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside pl-2 space-y-1.5 my-3 text-zinc-300" {...props} />,
                  li: ({node, ...props}) => <li className="marker:text-emerald-500" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-zinc-50 bg-zinc-800/40 px-1 py-0.5 rounded border border-zinc-800" {...props} />,
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-4 border border-zinc-800 rounded-xl bg-zinc-900/40">
                      <table className="w-full border-collapse text-left text-xs" {...props} />
                    </div>
                  ),
                  thead: ({node, ...props}) => <thead className="bg-zinc-900 text-zinc-300 font-medium border-b border-zinc-800" {...props} />,
                  tbody: ({node, ...props}) => <tbody className="divide-y divide-zinc-800/60" {...props} />,
                  tr: ({node, ...props}) => <tr className="hover:bg-zinc-800/20 transition-colors" {...props} />,
                  th: ({node, ...props}) => <th className="px-4 py-3 font-semibold" {...props} />,
                  td: ({node, ...props}) => <td className="px-4 py-3 font-mono text-zinc-300" {...props} />,
                }}
              >
                {response}
              </ReactMarkdown>

              {/* Streaming Indicator */}
              {isLoading && (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10 mt-4 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Synchronizing incoming blocks...
                </span>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    <Terminal className="w-4 h-4 text-zinc-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-sm text-zinc-400 font-medium animate-pulse mt-2">Initializing runtime environment tools...</p>
                  <p className="text-xs text-zinc-600 max-w-xs font-mono">Invoking YFinance API Engine & DuckDuckGo Indexers</p>
                </div>
              ) : (
                <div className="flex flex-col items-center max-w-sm">
                  <Terminal className="w-8 h-8 text-zinc-600 mb-3" />
                  <p className="text-sm font-medium text-zinc-400">System Pipeline Standing By</p>
                  <p className="text-xs text-zinc-600 mt-1">Submit a financial research target above to deploy tool orchestration loops.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}