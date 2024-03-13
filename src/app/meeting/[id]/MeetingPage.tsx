"use client";

import useLoadCall from "@/hooks/useLoadCall";
import useStreamCall from "@/hooks/useStreamCall";
import { useUser } from "@clerk/nextjs";
import {
  Call,
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  useCall,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MeetingPageProps {
  id: string;
}

export default function MeetingPage({ id }: MeetingPageProps) {
  const { user, isLoaded: userLoaded } = useUser();
  const { call, callLoading } = useLoadCall(id);

  const client = useStreamVideoClient();

  if (!userLoaded || callLoading) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (!call) {
    //call does not exist
    return (
      <div className="mx-auto text-center">
        <h1 className="font-bold">Call not found!</h1>
        <p className="text-center">
          Either the call has ended or this link is invalid.
        </p>
      </div>
    );
  }
  const notAllowedToJoin =
    (call.type === "PrivateMeeting" && !user) ||
    (user && !call.state.members.find((m) => m.user.id === user.id));

  console.log("notAllowedToJoin", notAllowedToJoin);
  console.log("user", call.state.members);

  if (notAllowedToJoin) {
    return (
      <div className="mx-auto text-center">
        <h1 className="font-bold">Private meeting!</h1>
        <p className="text-center">
          You do not have permission to view this meeting.
        </p>
      </div>
    );
  }
  return (
    <StreamCall call={call}>
      <StreamTheme className="space-y-3">
        <MeetingScreen />
      </StreamTheme>
    </StreamCall>
  );
}

function MeetingScreen() {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();

  const callEndedAt = useCallEndedAt();
  const callStartsAt = useCallStartsAt();

  const futureCall = callStartsAt && new Date(callStartsAt) > new Date();
  if (futureCall) {
    return <FutureMeetingScreen />;
  }

  const callEnded = !!callEndedAt;
  // if (callEnded) {
  //   return <MeetingEndedScreen />;
  // }

  return <div>Call ui</div>;
}

function FutureMeetingScreen() {
  const call = useStreamCall();

  return (
    <div className="flex flex-col items-center gap-6">
      <p>
        This meeting has not started yet. It will start at{" "}
        <span className="font-bold">
          {call.state.startsAt?.toLocaleString()}
        </span>
      </p>

      {call.state.custom.description && (
        <p>
          Description:{" "}
          <span className="font-bold">{call.state.custom.description}</span>
        </p>
      )}

      <Link className="underline" href="/">Home</Link>
    </div>
  );
}
