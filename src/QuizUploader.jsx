import { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import logo from "/pdf.png";
const SkeletonCard = () => (
  <div className="border p-4 rounded shadow animate-pulse space-y-4 bg-white">
    <div className="h-64 bg-gray-300 rounded" />
    <div className="h-4 bg-gray-300 rounded w-2/3" />
    <div className="h-3 bg-gray-300 rounded w-3/4" />
    <div className="h-3 bg-gray-300 rounded w-1/2" />
    <div className="h-3 bg-gray-300 rounded w-1/4" />
  </div>
);

const QuizUploader = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // Reference to reset file input

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a PDF file.");

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);
    setResults([]);

    try {
      const response = await axios.post(
        `https://pdf-quiz-server.onrender.com/api/quiz/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResults(response.data);
      toast.success("Quiz generated successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to process PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResults([]);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset input manually
    }
    toast.success("Cleared successfully!");
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-center items-center gap-2">
          <img className="w-8" src={logo} alt="PDF Logo" />
          <h2 className="text-3xl font-bold text-center">PDF Generator</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded shadow max-w-2xl mx-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="border px-2 py-1 text-black rounded w-full sm:w-auto"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 transition-colors text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Processing..." : "Upload and Generate"}
          </button>
          <button
            onClick={handleClear}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="mt-10 space-y-10">
          {loading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {!loading &&
            results.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col sm:flex-row items-center border rounded-lg p-6 shadow-md bg-white text-black space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <img
                  src={item.image}
                  alt={`Page Image ${idx + 1}`}
                  className="w-40 h-auto rounded-md shadow"
                  onError={(e) => (e.target.src = "/fallback-image.png")}
                />
                <div className="flex-1">
                  <p className="font-semibold text-lg mb-2">
                    {idx + 1}. {item.question}
                  </p>
                  <ul className="list-disc ml-6 text-gray-700 space-y-1">
                    {item.options.map((opt, optIdx) => (
                      <li key={optIdx}>{opt}</li>
                    ))}
                  </ul>
                  <div className="text-green-600 font-semibold mt-3">
                    Answer: {item.answer}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default QuizUploader;
