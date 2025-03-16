"use client"; // This makes it a Client Component

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/pages/signup"); // Redirect to signup after sign out
  };

  return (
    <button
      onClick={handleSignOut}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
    >
      Sign Out
    </button>
  );
}
