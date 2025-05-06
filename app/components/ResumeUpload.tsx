//app/components/ResumeUpload.tsx

"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeUploader() {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setError("");
    } else {
      setFileName(null);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const fileInput = fileInputRef.current;

    if (!fileInput?.files || fileInput.files.length === 0) {
      setError("Please select a PDF file");
      return;
    }

    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const res = await fetch("/api/feedback/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage =
          data.error ||
          `Error: ${res.status} - ${res.statusText || "Unknown error"}`;
        throw new Error(errorMessage);
      }

      setFeedback(data.feedback);
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setFeedback("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Resume Feedback AI
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Upload your resume (PDF only) to get instant AI-powered feedback to help
        improve your job application.
      </p>

      <form onSubmit={handleUpload} className="space-y-6">
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:border-blue-400 transition duration-200 ease-in-out">
          <label
            htmlFor="resume-upload"
            className="cursor-pointer block text-lg font-semibold text-blue-700 mb-4"
          >
            {fileName
              ? `Selected File: ${fileName}`
              : "Click or drag to upload your resume (PDF only)"}
          </label>
          <input
            id="resume-upload"
            type="file"
            name="resume"
            accept="application/pdf"
            required
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          {!fileName && (
            <div className="text-gray-500 text-sm">Maximum file size: 10MB</div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !fileName}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 ease-in-out flex items-center justify-center"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                role="status"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Analyzing Resume...
            </span>
          ) : (
            "Get Resume Feedback"
          )}
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm"
            role="alert"
          >
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Resume Feedback
            </h2>
            <div
              className="prose prose-blue max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: feedback.replace(/\n/g, "<br />"),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
