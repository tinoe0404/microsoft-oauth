import React from 'react';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
            <LogIn className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Welcome to Tano Digital
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Sign in to access the enterprise dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-xl shadow-gray-900/50 sm:rounded-xl sm:px-10 border border-gray-700">
          <div className="space-y-6">
            <div>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/oauth2/authorization/microsoft`}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0078D4] hover:bg-[#0066B3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[#0078D4] transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                Sign in with Microsoft
              </a>
            </div>
          </div>
          
          <div className="mt-6 text-center">
             <p className="text-xs text-gray-500">Only @tanodigitalgroup.com accounts are permitted.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
