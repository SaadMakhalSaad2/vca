import useLoadRecordings from "@/hooks/useLoadRecordings";
import useStreamCall from "@/hooks/useStreamCall";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function RecordingsList() {
  const call = useStreamCall();

  const { recordings, recordingsLoading } = useLoadRecordings(call);

  const { user, isLoaded: userLoaded } = useUser();
  if (userLoaded && !user) {
    return (
      <p className="text-center">
        You must be logged in to view meeting recordings
      </p>
    );
  }

  if (recordingsLoading) return <Loader2 className="mx-auto animate-spin" />;

  return (
    <div className="space-y-3 text-center">
      {recordings.length === 0 && <p>No recordings found for this meeting</p>}
      <ul className="list-inside list-disc">
        {recordings
          .sort((a, b) => b.end_time.localeCompare(a.end_time))
          .map((r) => (
            <li key={r.url}>
              <Link href={r.url} target="_blank" className="hover:underline">
                {new Date(r.end_time).toLocaleString()}
              </Link>
            </li>
          ))}
      </ul>
      <p className="text-sm text-gray-400">
        Please note it will take a minute for the recorings to load. 
        <br />
        Refresh the page to see if recordings became available
      </p>
    </div>
  );
}
