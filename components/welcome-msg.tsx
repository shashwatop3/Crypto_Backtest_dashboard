import { useUser } from "@clerk/nextjs";

export default function WelcomeMsg() {
  const {user, isLoaded} = useUser();

  return (
    <div>
      {user ? (
        <div className="text-2xl text-white pt-16 px-11 space-y-2">
          <h1 className="text-2xl lg:text-4xl font-medium text-white">Welcome back{isLoaded ? "," : ""} {user?.firstName}</h1>
          <p className="text-xl lg:text-2xl text-white/70">ML based bitcoin intraday trading signal generator</p>
        </div>
      ) : (
        <h1>Welcome! Please sign in.</h1>
      )}
    </div>
  );
}