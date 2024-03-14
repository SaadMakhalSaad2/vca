import PrimaryButton from "@/app/components/PrimaryButton";
import { ClerkLoaded, ClerkLoading, SignInButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function MeetingLoginPage() {
  return (
    <div className="mx-auto w-fit space-y-3">
      <h1 className="text-center font-bold">Join meeting</h1>
      <ClerkLoaded>
        <SignInButton>
          <PrimaryButton className="w-44">Login</PrimaryButton>
        </SignInButton>
        <Link href="?guest=true" className="mt-2 block">
          <PrimaryButton className="w-44 bg-gray-400">
            Continue as guest
          </PrimaryButton>
        </Link>
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="mx-auto animate-spin"/>
      </ClerkLoading>
    </div>
  );
}
