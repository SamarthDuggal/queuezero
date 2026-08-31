import { HostDesk } from "@/components/HostDesk";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Host desk" };

export default async function HostPage({
  params,
}: PageProps<"/host/[code]">) {
  const { code } = await params;
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <HostDesk code={code.toUpperCase()} />
    </div>
  );
}
