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
  const [isListening, setIsListening] = useState(false);

  // NEW: track feedback
  const [feedbackGiven, setFeedbackGiven] = useState<{
    [key: number]: "up" | "down";
  }>({});
  
  const user =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("careUser") || "{}")
    : {};

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleVoiceInput = () => {
    type SpeechRecognitionConstructor = new () => {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      onresult: (event: any) => void;
      onerror: () => void;
      onend: () => void;
      start: () => void;
    };    type SpeechRecognitionEvent = {
      results: {
        [key: number]: {
          [key: number]: {
            transcript: string;
          };
        };
      };
    };
  
    const SpeechRecognition =
      (window as Window & {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      }).SpeechRecognition ||
      (window as Window & {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      }).webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    setIsListening(true);
  
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
  
    recognition.onerror = () => {
      setIsListening(false);
      alert("Voice input failed. Please try again.");
    };
  
    recognition.onend = () => {
      setIsListening(false);
    };
  
    recognition.start();
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: currentInput,
            role: JSON.parse(localStorage.getItem("careUser") || "{}").role || "CNA",
            agency_id: JSON.parse(localStorage.getItem("careUser") || "{}").agency || "test",
            state: JSON.parse(localStorage.getItem("careUser") || "{}").state || "NH",
            history: messages.slice(-6)
          })
        }
      );

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        role: "assistant",
        text: `${data.response_text}

Escalation: ${data.escalation_level}
Policy: ${data.policy_reference
          .replace(".docx", "")
          .replace(/_/g, " ")
          .replace(/^\d+ /, "")}
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

  // UPDATED: feedback with index + color state
  const sendFeedback = async (
    rating: "up" | "down",
    responseText: string,
    index: number
  ) => {
    console.log(`thumbs_${rating}`, responseText);

    setFeedbackGiven((prev) => ({
      ...prev,
      [index]: rating
    }));

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rating,
          response: responseText
        })
      });
    } catch (error) {
      console.error("Feedback failed:", error);
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
      subtitle={`Get grounded, role-aware support in seconds. Signed in as ${user.role || "Caregiver"} | ${user.agency || "Agency"}`}
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
          <div key={`${message.role}-${index}`} className="space-y-2">
            <article
              className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "caregiver"
                  ? "ml-auto bg-careBlue-600 text-white"
                  : "mr-auto border border-careGreen-200 bg-careGreen-50 text-careGreen-900"
              }`}
            >
              <div className="space-y-2">
                {message.text.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </article>

            {message.role === "assistant" && index !== 0 && (
              <div className="ml-2 flex gap-2 text-sm">
                <button
                  type="button"
                  className={`rounded-full border px-3 py-1 ${
                    feedbackGiven[index] === "up"
                      ? "bg-careBlue-600 text-white"
                      : "hover:bg-slate-100"
                  }`}
                  disabled={!!feedbackGiven[index]}
                  onClick={() => sendFeedback("up", message.text, index)}
                >
                  👍
                </button>

                <button
                  type="button"
                  className={`rounded-full border px-3 py-1 ${
                    feedbackGiven[index] === "down"
                      ? "bg-careBlue-600 text-white"
                      : "hover:bg-slate-100"
                  }`}
                  disabled={!!feedbackGiven[index]}
                  onClick={() => sendFeedback("down", message.text, index)}
                >
                  👎
                </button>
              </div>
            )}
          </div>
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
        <div className="flex gap-2">
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
            className="rounded-xl border border-careBlue-200 px-4 text-careBlue-700 hover:bg-careBlue-50"
            onClick={handleVoiceInput}
          >
            {isListening ? "Listening..." : "Mic"}
          </button>
        </div>
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