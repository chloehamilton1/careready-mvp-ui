"use client";

import { useState } from "react";
import ShellLayout from "@/components/ShellLayout";
import DisclaimerCard from "@/components/DisclaimerCard";

const promptCategories = [
  {
    title: "Care situations",
    description:
      "Meal refusal, confusion, hygiene support, or difficult shift moments.",
    prompts: [
      "Client refuses scheduled meal support. What should I do?",
      "Client is confused or agitated during my shift.",
      "Client will not accept help with hygiene."
    ]
  },
  {
    title: "Safety & escalation",
    description:
      "Unsafe home conditions, fall risk concerns, and supervisor escalation.",
    prompts: [
      "Unsafe home condition discovered during shift.",
      "When should I call my supervisor?",
      "Client may be at risk of falling."
    ]
  },
  {
    title: "Agency policy & Documentation",
    description:
      "Documentation, missed visits, unclear care instructions, and policy questions.",
    prompts: [
      "How do I escalate a policy concern to supervisor?",
      "How should I document a missed visit?",
      "What should I do if care instructions are unclear?"
    ]
  },
  {
    title: "Logistics & resources",
    description:
      "Transportation, appointments, family requests, and community resources.",
    prompts: [
      "Transportation option for non-emergency appointment.",
      "Client needs help finding a community resource.",
      "Family asks for support outside my role."
    ]
  }
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
      text: "Hi — I can help with care situations, safety escalation, agency policy, and non-clinical resources. Ask a question or choose a category below."
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
    type VoiceRecognitionEvent = {
      results: {
        0: {
          0: {
            transcript: string;
          };
        };
      };
    };
  
    type SpeechRecognitionInstance = {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      onresult: (event: VoiceRecognitionEvent) => void;
      onerror: () => void;
      onend: () => void;
      start: () => void;
    };
  
    type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
  
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
  
    const SpeechRecognition =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
  
    setIsListening(true);
  
    recognition.onresult = (event: VoiceRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
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
        content="Matriva provides non-clinical support only. It does not provide medical advice, clinical diagnosis, or treatment guidance. For any medical question, always contact a qualified medical professional or your supervisor."
      />

<section className="card">
  <h2 className="text-sm font-semibold text-slate-700">
    What you can ask about
  </h2>

  <p className="mt-1 text-xs text-slate-500">
    Choose a category below or ask your own non-clinical caregiver support question.
  </p>

  <div className="mt-4 grid gap-4 md:grid-cols-2">
    {promptCategories.map((category) => (
      <div
        key={category.title}
        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
      >
        <h3 className="text-sm font-semibold text-careBlue-800">
          {category.title}
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {category.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {category.prompts.map((prompt) => (
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
      </div>
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
            {isListening ? "Listening..." : "Start voice"}
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Tap Start voice, speak, then pause to auto-fill.
        </p>
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