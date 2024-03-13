"use client";

import { useUser } from "@clerk/nextjs";
import {
  Call,
  CallAcceptedEvent,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyMeetingsPage() {
  const { user } = useUser();

  const client = useStreamVideoClient();

  const [calls, setCalls] = useState<Call[]>();

  useEffect(() => {
    async function loadCalls() {
      if (!client || !user?.id) {
        return;
      }
      const { calls } = await client.queryCalls({
        sort: [{ field: "starts_at", direction: -1 }],
        filter_conditions: {
          starts_at: { $exists: true },
          $or: [
            { created_by_user_id: user.id },
            { members: { $in: [user.id] } },
          ],
        },
      });
      setCalls(calls);
    }
    loadCalls();
  }, [client, user?.id]);
  return (
    <div className="space-y-6">
      <h1 className="text-center font-bold">My meetings</h1>
      {!calls && <Loader2 className="mx-auto animate-spin" />}
      {calls?.length === 0 && <p>No results found</p>}
      <ul className="list-inside list-disc space-y-2">
        {calls?.map((call) => <MeetingItem key={call.id} call={call} />)}
      </ul>
    </div>
  );
}

interface MeetingItemProps {
  call: Call;
}

function MeetingItem({ call }: MeetingItemProps) {
  const meetingLink = `/meeting/${call.id}`;

  const futureMeeting =
    call.state.startsAt && new Date(call.state.startsAt) > new Date();
  const endedMeeting = !!call.state.endedAt;
  const currentMeeting = !futureMeeting && !endedMeeting;

  return (
    <li>
      <Link href={meetingLink} className="hover:underline">
        {call.state.startsAt?.toLocaleString()}
        {futureMeeting && "(upcoming)"}
        {endedMeeting && "(Ended)"}
        {currentMeeting && "Current meeting--Join now"}
      </Link>
      <p className="ml06 text-gray-500">{call.state.custom.description}</p>
    </li>
  );
}
