import ShellLayout from "@/components/ShellLayout";
import DisclaimerCard from "@/components/DisclaimerCard";

const quickPrompts = [
  "Client refuses scheduled meal support. What should I do?",
  "Unsafe home condition discovered during shift.",
  "Transportation option for non-emergency appointment.",
  "How do I escalate a policy concern to supervisor?"
];

const sampleMessages = [
  {
    role: "caregiver",
    text: "The client asked me to change a dressing. Should I do this?"
  },
  {
    role: "assistant",
    text: "I can't advise on this as it falls outside non-clinical caregiver support. Please contact a qualified medical professional or your supervisor. In the meantime, here are some resources that may help: local urgent care directory, agency escalation line, and after-hours nursing support."
  },
  {
    role: "assistant",
    text: "Decision: Call your supervisor now for immediate guidance."
  }
];

export default function ChatPage() {
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
            <button key={prompt} type="button" className="chip text-left">
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <section className="card space-y-3">
        {sampleMessages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              message.role === "caregiver"
                ? "ml-auto bg-careBlue-600 text-white"
                : "mr-auto border border-careGreen-200 bg-careGreen-50 text-careGreen-900"
            }`}
          >
            {message.text}
          </article>
        ))}
      </section>

      <section className="card">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
          Ask your question
        </label>
        <input
          className="input"
          placeholder="PHI warning: Do not include names, DOB, address, diagnosis, or any identifiable patient details."
          type="text"
        />
        <button type="button" className="btn-primary mt-3">
          Send
        </button>
      </section>
    </ShellLayout>
  );
}
