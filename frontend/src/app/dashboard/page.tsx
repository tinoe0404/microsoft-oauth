import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { User, Briefcase, Building, Mail } from "lucide-react";
import LogoutButton from "../components/LogoutButton";

interface UserProfile {
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  userPrincipalName: string;
}

async function getProfile(): Promise<UserProfile | null> {
  const cookieStore = cookies();
  const jsessionid = cookieStore.get("JSESSIONID");

  if (!jsessionid) {
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  try {
    const res = await fetch(`${apiUrl}/api/me`, {
      headers: {
        Cookie: `JSESSIONID=${jsessionid.value}`,
      },
      cache: "no-store", // Ensure we always fetch fresh data for authenticated user
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Tano Digital
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-300 mr-4">{profile.fullName}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Enterprise Dashboard</h1>
          <p className="mt-2 text-gray-400">Welcome back! Here are your profile details from Entra ID.</p>
        </div>

        <div className="bg-gray-800 shadow-xl shadow-gray-900/50 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-blue-500/10 rounded-xl">
                  <User className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Full Name</p>
                  <p className="mt-1 text-lg font-semibold text-white">{profile.fullName || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-purple-500/10 rounded-xl">
                  <Mail className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Email Address</p>
                  <p className="mt-1 text-lg font-semibold text-white">{profile.email || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-emerald-500/10 rounded-xl">
                  <Briefcase className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Job Title</p>
                  <p className="mt-1 text-lg font-semibold text-white">{profile.jobTitle || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-amber-500/10 rounded-xl">
                  <Building className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Department</p>
                  <p className="mt-1 text-lg font-semibold text-white">{profile.department || "N/A"}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-700">
               <p className="text-sm text-gray-500">
                 <strong>UPN:</strong> {profile.userPrincipalName || "N/A"}
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
