import { DisplayBoard } from "@/components/DisplayBoard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Now serving" };

export default async function BoardPage({
  params,
}: PageProps<"/board/[code]">) {
  const { code } = await params;
  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <DisplayBoard code={code.toUpperCase()} />
    </div>
  );
}
