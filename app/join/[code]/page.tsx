import { JoinForm } from "@/components/JoinForm";

export default async function JoinCodePage({
  params,
}: PageProps<"/join/[code]">) {
  const { code } = await params;
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <JoinForm presetCode={code.toUpperCase()} />
    </div>
  );
}
