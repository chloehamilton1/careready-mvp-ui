"use client";

import { useState } from "react";
import ShellLayout from "@/components/ShellLayout";
import DisclaimerCard from "@/components/DisclaimerCard";

const quickPrompts = [
  "Client refuses scheduled meal support. What should I do?",
  "Unsafe home condition discovered during shift.",
  "Transportation option for non-emergency appointment.",
  "How do I escalate a policy concern to supervisor?"
];

type ChatMessage = {
  role: "caregiver" | "assistant";
  text: string;
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi — ask me a caregiver support question and I’ll return grounded, role-aware guidance."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input.trim();

    const userMessage: ChatMessage = {
      role: "caregiver",
      text: currentInput
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("https://care-ready-backend.onrender.com/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: currentInput,
          role: "CNA",
          agency_id: "test",
          state: "NH"
        })
      });

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        role: "assistant",
        text: `${data.response_text}

Escalation: ${data.escalation_level}
Policy: ${data.policy_reference}
Confidence: ${data.confidence}`
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage: ChatMessage = {
        role: "assistant",
        text: "Sorry — I couldn’t reach the backend right now. Please try again."
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleSend();
    }
  };

  return (
    <ShellLayout
      title="Caregiver Chat"
      subtitle="Get grounded, role-aware support in seconds."
    >
      <DisclaimerCard
        title="Non-clinical support only"
        content="CareReady provides non-clinical support only. It does not provide medical advice, clinical diagnosis, or treatment guidance. For any medical question, always contact a qualified medical professional or your supervisor."
      />

      <section className="card">
        <h2 className="text-sm font-semibold text-slate-700">Quick prompt starters</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="chip text-left"
              onClick={() => handleQuickPrompt(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <section className="card space-y-3">
        {messages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={`max-w-[92%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              message.role === "caregiver"
                ? "ml-auto bg-careBlue-600 text-white"
                : "mr-auto border border-careGreen-200 bg-careGreen-50 text-careGreen-900"
            }`}
          >
            {message.text}
          </article>
        ))}

        {isLoading && (
          <article className="mr-auto max-w-[92%] rounded-2xl border border-careGreen-200 bg-careGreen-50 px-4 py-3 text-sm leading-relaxed text-careGreen-900">
            Thinking...
          </article>
        )}
      </section>

      <section className="card">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
          Ask your question
        </label>
        <input
          className="input"
          placeholder="PHI warning: Do not include names, DOB, address, diagnosis, or any identifiable patient details."
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="btn-primary mt-3"
          onClick={handleSend}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </section>
    </ShellLayout>
  );
}
