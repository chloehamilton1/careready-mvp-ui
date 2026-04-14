import type { ReactNode } from "react";

type ShellLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function ShellLayout({
  title,
  subtitle,
  children
}: ShellLayoutProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-4 py-5 sm:max-w-2xl sm:px-6">
      <header className="rounded-2xl bg-gradient-to-r from-careBlue-700 to-careGreen-700 p-5 text-white shadow-care">
        <p className="text-xs uppercase tracking-wide text-careBlue-100">CareReady MVP</p>
        <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-careBlue-100">{subtitle}</p>
      </header>
      {children}
    </main>
  );
}
