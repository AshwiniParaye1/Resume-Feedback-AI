//app/page.tsx

"use client";

import ResumeUploader from "./components/ResumeUpload";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <ResumeUploader />
      </div>
    </main>
  );
}
