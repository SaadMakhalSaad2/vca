"use server";

import { clerkClient } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export async function getToken() {
  const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
  const streamApiSecret = process.env.STREAM_VIDEO_API_SECRET;

  if (!streamApiKey || !streamApiSecret) {
    throw new Error("Stream credentials are null");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("user not authenticated");
  }

  const streamClient = new StreamClient(streamApiKey, streamApiSecret);

  const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;

  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  const token = streamClient.createToken(user.id, expirationTime, issuedAt);
  console.log("successfully generated token", token);
  return token;
}

//api endpoint/server action to fetch user ids memebers for a call
export async function getUserIds(emails: string[]) {
  const response = await clerkClient.users.getUserList({
    emailAddress: emails,
  });

  return response.map((user) => user.id);
}
