import Link from "next/link";
import ShellLayout from "@/components/ShellLayout";
import DisclaimerCard from "@/components/DisclaimerCard";

const roles = ["CNA", "LNA", "HHA", "Homemaker"];

export default function OnboardingPage() {
  return (
    <ShellLayout
      title="Caregiver Onboarding"
      subtitle="Create your profile for role-specific, agency-grounded support."
    >
      <DisclaimerCard
        title="PHI / Privacy Agreement"
        tone="green"
        content="Do not enter any patient-identifiable information including names, dates of birth, addresses, diagnoses, or any other protected health information."
      />

      <section className="card">
        <h2 className="text-lg font-semibold text-slate-800">Set up your profile</h2>
        <p className="mt-1 text-sm text-slate-600">
          This profile context is prepended to each response.
        </p>
        <form className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Full name</label>
            <input className="input" type="text" placeholder="Your name" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Role</label>
            <select className="input">
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Agency code</label>
            <input className="input" type="text" placeholder="Ex: NH-HOME-01" />
          </div>
          <label className="flex items-start gap-2 rounded-xl border border-careBlue-200 bg-careBlue-50 p-3 text-xs text-slate-700">
            <input type="checkbox" className="mt-0.5 accent-careBlue-600" />
            I acknowledge this app is non-clinical and I am responsible for not submitting PHI.
          </label>
          <button type="button" className="btn-primary">
            Continue to chat
          </button>
        </form>
      </section>

      <p className="text-center text-xs text-slate-500">
        Already set up?{" "}
        <Link href="/" className="font-medium text-careBlue-700 underline">
          Return to login
        </Link>
      </p>
    </ShellLayout>
  );
}
