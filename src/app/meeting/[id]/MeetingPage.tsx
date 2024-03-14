"use client";

import AudioVolumeIndicator from "@/app/components/AudioVolumeIndicator";
import FlexibleCallLayout from "@/app/components/FlexibleCallLayout";
import PermissionPrompt from "@/app/components/PermissionPrompt";
import PrimaryButton from "@/app/components/PrimaryButton";
import RecordingsList from "@/app/components/RecordingsList";
import useLoadCall from "@/hooks/useLoadCall";
import useStreamCall from "@/hooks/useStreamCall";
import { useUser } from "@clerk/nextjs";
import {
  Call,
  CallControls,
  CallingState,
  DeviceSettings,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  VideoPreview,
  useCall,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    (user &&
      !call.state.members.find((m) => m.user.id === user.id) &&
      call.type === "PrivateMeeting");

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
      <StreamTheme>
        <MeetingScreen />
      </StreamTheme>
    </StreamCall>
  );
}

function MeetingScreen() {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();

  const callEndedAt = useCallEndedAt();
  const callStartsAt = useCallStartsAt();
  const call = useStreamCall();
  const description = call.state.custom.description;

  const [setupComplete, setSetupComplete] = useState(false);

  async function handleSetupComplete() {
    call.join();
    setSetupComplete(true);
  }

  const futureCall = callStartsAt && new Date(callStartsAt) > new Date();
  if (futureCall) {
    return <FutureMeetingScreen />;
  }

  const callEnded = !!callEndedAt;
  if (callEnded) {
    return <MeetingEndedScreen />;
  }

  return (
    <div className="space-y-6">
      {description && (
        <p className="text-center">
          Meeting Description: <span className="font-bold">{description}</span>
        </p>
      )}
      {setupComplete ? (
        <CallUI />
      ) : (
        <SetupUI onSetupComplete={handleSetupComplete} />
      )}
    </div>
  );
}

interface SetUpUIProps {
  onSetupComplete: () => void;
}

function SetupUI({ onSetupComplete }: SetUpUIProps) {
  const call = useStreamCall();

  const { useMicrophoneState, useCameraState } = useCallStateHooks();

  const micState = useMicrophoneState();
  const camState = useCameraState();
  const [micCamDisabled, setMicCamDisabled] = useState(false);

  useEffect(() => {
    if (micCamDisabled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [micCamDisabled, call]);

  if (!micState.hasBrowserPermission || !camState.hasBrowserPermission) {
    return <PermissionPrompt />;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-center text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center gap-3">
        <AudioVolumeIndicator />
        <DeviceSettings />
      </div>
      <label className="flex items-center gap-2 font-medium">
        <input
          type="checkbox"
          checked={micCamDisabled}
          onChange={(e) => setMicCamDisabled(e.target.checked)}
        />
        Join without mic & camera
      </label>
      <PrimaryButton onClick={onSetupComplete}>Join meeting</PrimaryButton>
    </div>
  );
}

function CallUI() {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <Loader2 className="mx-auto animate-spin"></Loader2>;
  }

  return <FlexibleCallLayout />;
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

      <Link className="underline" href="/">
        Home
      </Link>
    </div>
  );
}

function MeetingEndedScreen() {
  return (
    <div className="flex flex-col items-center gap-6">
      <p>This meeting has ended</p>
      <Link href="/" className="underline"></Link>
      <div className="space-y-3">
        <h2 className="text-center text-xl font-bold">Recordings</h2>
        <RecordingsList />
      </div>
    </div>
  );
}
