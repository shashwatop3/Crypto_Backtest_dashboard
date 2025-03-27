"use client";
import { Header_logo } from "./header-logo";
import { Navigation } from "./navigation";
import { UserButton } from "@clerk/nextjs";
import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import WelcomeMsg from "@/components/welcome-msg";

export const Header = () => {
  return (
    <header
      className=" mb-6 pt-4 pb-40 lg:px-4 shadow"
      style={{
        backgroundImage:
          "linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)", // Apply gradient background
      }}
    >
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mr-4">
          <div className="flex items-center gap-4">
            <div className="mr-12 hidden lg:flex">
              <Header_logo />
            </div>
            <div className="ml-4">
              <Navigation />
            </div>
          </div>
          <ClerkLoading>
            <Loader2 className="animate-spin text-white" />
          </ClerkLoading>
          <ClerkLoaded>
            <UserButton afterSwitchSessionUrl="/sign-in" />
          </ClerkLoaded>
        </div>
        <WelcomeMsg />
      </div>
    </header>
  );
};