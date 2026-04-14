import ShellLayout from "@/components/ShellLayout";
import DisclaimerCard from "@/components/DisclaimerCard";

const stats = [
  { label: "Queries today", value: "34" },
  { label: "Queries this week", value: "189" },
  { label: "Active caregivers", value: "21" }
];

const breakdown = [
  { category: "Policy guidance", percent: 42, color: "bg-careBlue-600" },
  { category: "Escalation decisions", percent: 26, color: "bg-careGreen-600" },
  { category: "Resource lookup", percent: 21, color: "bg-careBlue-400" },
  { category: "Other", percent: 11, color: "bg-careGreen-400" }
];

export default function AdminDashboardPage() {
  return (
    <ShellLayout
      title="Admin Dashboard"
      subtitle="Read-only visibility into usage and question categories."
    >
      <DisclaimerCard
        title="Privacy boundary"
        tone="green"
        content="Admins can view usage metrics and question type trends, but cannot view individual caregiver conversations."
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="card">
            <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-careBlue-800">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="card">
        <h2 className="text-sm font-semibold text-slate-700">Question type breakdown</h2>
        <div className="mt-4 space-y-3">
          {breakdown.map((item) => (
            <div key={item.category}>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                <span>{item.category}</span>
                <span>{item.percent}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100">
                <div
                  className={`h-2.5 rounded-full ${item.color}`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-sm font-semibold text-slate-700">Usage trend (sample)</h2>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {[12, 18, 15, 27, 21, 33, 26].map((value, index) => (
            <div key={`${value}-${index}`} className="flex flex-col items-center">
              <div
                className="w-full rounded-t bg-careBlue-400"
                style={{ height: `${value * 2}px` }}
              />
              <span className="mt-1 text-[10px] text-slate-500">D{index + 1}</span>
            </div>
          ))}
        </div>
      </section>
    </ShellLayout>
  );
}
