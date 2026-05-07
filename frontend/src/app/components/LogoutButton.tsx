"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/logout`, {
        method: "POST",
        credentials: "include", // Send session cookie to invalidate it
      });
    } catch (err) {
      console.error("Failed to logout:", err);
    } finally {
      router.push("/login");
      router.refresh(); // Clear client cache
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
      title="Logout"
    >
      <LogOut className="h-5 w-5" />
    </button>
  );
}
