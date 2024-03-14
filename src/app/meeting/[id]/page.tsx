import { Metadata } from "next";
import MeetingPage from "./MeetingPage";
import { currentUser } from "@clerk/nextjs";
import MeetingLoginPage from "./MeetingLoginPage";

interface PageProps {
  params: { id: string };
  //adding extra parameter to the url
  searchParams: { guest: string };
}

export function generateMetadata({ params: { id } }: PageProps): Metadata {
  return {
    title: `Meeting ${id}`,
  };
}

export default async function Page({
  params: { id },
  searchParams: { guest },
}: PageProps) {
  //will load before displaying the page so no need for loader
  const user = await currentUser();
  const guestMode = guest === "true";

  if (!user && !guestMode) {
    return <MeetingLoginPage />;
  }

  return <MeetingPage id={id} />;
}
