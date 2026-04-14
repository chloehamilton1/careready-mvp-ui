import Link from "next/link";
import ShellLayout from "@/components/ShellLayout";
import DisclaimerCard from "@/components/DisclaimerCard";

export default function LoginPage() {
  return (
    <ShellLayout
      title="Login"
      subtitle="Secure caregiver access with role-aware support."
    >
      <section className="card">
        <h2 className="text-lg font-semibold text-slate-800">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-600">
          Sign in to continue to your shift support chat.
        </p>
        <form className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Work Email
            </label>
            <input className="input" type="email" placeholder="you@agency.com" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Password
            </label>
            <input className="input" type="password" placeholder="Enter password" />
          </div>
          <button type="button" className="btn-primary">
            Sign in
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-slate-500">
          New caregiver?{" "}
          <Link href="/onboarding" className="font-medium text-careBlue-700 underline">
            Complete onboarding
          </Link>
        </p>
      </section>

      <DisclaimerCard
        title="Non-clinical scope"
        content="CareReady provides non-clinical support only. It does not provide medical advice, clinical diagnosis, or treatment guidance. For any medical question, always contact a qualified medical professional or your supervisor."
      />
      <DisclaimerCard
        title="PHI / Privacy"
        tone="green"
        content="Do not enter any patient-identifiable information including names, dates of birth, addresses, diagnoses, or any other protected health information."
      />

      <section className="card">
        <h3 className="text-sm font-semibold text-slate-700">Prototype navigation</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <Link href="/onboarding" className="chip text-center">
            Onboarding
          </Link>
          <Link href="/chat" className="chip text-center">
            Caregiver Chat
          </Link>
          <Link href="/admin" className="chip text-center">
            Admin Dashboard
          </Link>
        </div>
      </section>
    </ShellLayout>
  );
}
