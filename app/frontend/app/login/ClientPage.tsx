"use client";

import LoginForm from "@/components/Auth/LoginForm";

export default function ClientPage() {
  // Changed function name to match file name
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <LoginForm />
    </div>
  );
}
