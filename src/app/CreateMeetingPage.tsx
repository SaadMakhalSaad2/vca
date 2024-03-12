"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function CreateMeetingPage() {
  const [descriptionInput, setDescriptionInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  const client = useStreamVideoClient();
  const { user } = useUser();

  if (!user || !client) return <Loader2 className="mx-auto animate-spin" />;

  return (
    <div className="item-center flex flex-col space-y-6">
      <h1 className="text-center text-2xl font-bold">
        Welcome, {user.username}
      </h1>
      <div className="mx-auto w-80 space-y-6 rounded-md bg-slate-50 p-5">
        <h2 className="text-xl font-bold">New meeting</h2>
        <DescriptionInput
          value={descriptionInput}
          onChange={setDescriptionInput}
        />
        <StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />
      </div>
    </div>
  );
}

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="space-y-2">
      <div className="font-medium">Meeting info</div>
      <label className="flex items-center gap-1.5">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => {
            setActive(e.target.checked);
            // onChange("");
          }}
        />
        Add description
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Description</span>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={500}
            className="w-full rounded-md border border-b-orange-900 p-2"
          />
        </label>
      )}
    </div>
  );
}

interface StartTimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

function StartTimeInput({ value, onChange }: StartTimeInputProps) {
  const [active, setActive] = useState(false);
  return (
    <div className="space-y-2">
      <div className="font-medium">Meeting start</div>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={!active}
          onChange={() => {
            setActive(false);
            onChange("");
          }}
        />
        Start meeting now
      </label>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={active}
          onChange={() => {
            setActive(true);
            onChange("");
          }}
        />
        Start meeting at
      </label>
    </div>
  );
}
