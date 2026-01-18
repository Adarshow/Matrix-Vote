"use client"

import { SignInPage } from "@/components/ui/sign-in-flow-1";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleEmailPasswordSubmit = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Check if user needs to complete profile
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      
      if (session?.user?.linkedinUrl) {
        router.push("/vote");
      } else {
        router.push("/complete-profile");
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/vote" });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleLinkedInSignIn = async () => {
    try {
      await signIn("linkedin", { callbackUrl: "/vote" });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <SignInPage
      onEmailPasswordSubmit={handleEmailPasswordSubmit}
      onGoogleSignIn={handleGoogleSignIn}
      onLinkedInSignIn={handleLinkedInSignIn}
      logoSrc="/logo.png"
      companyName="Matrix Vote"
    />
  );
}
