import PrimaryButton from "@/app/components/PrimaryButton";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}
export default function Page({ params: { id } }: PageProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-bold">Meeting left</p>
      <PrimaryButton>
        <Link href={`/meeting/${id}`}>
          Rejoin
        </Link>
      </PrimaryButton>
    </div>
  );
}
