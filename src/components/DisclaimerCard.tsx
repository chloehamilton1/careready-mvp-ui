type DisclaimerCardProps = {
  title: string;
  content: string;
  tone?: "blue" | "green";
};

export default function DisclaimerCard({
  title,
  content,
  tone = "blue"
}: DisclaimerCardProps) {
  const toneClasses =
    tone === "green"
      ? "border-careGreen-200 bg-careGreen-50 text-careGreen-900"
      : "border-careBlue-200 bg-careBlue-50 text-careBlue-900";

  return (
    <section className={`rounded-2xl border p-4 ${toneClasses}`}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1 text-xs leading-relaxed">{content}</p>
    </section>
  );
}
