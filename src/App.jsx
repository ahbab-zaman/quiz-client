import React, { useState } from "react";
import axios from "axios";

const SkeletonCard = () => (
  <div className="border p-4 rounded shadow animate-pulse space-y-4">
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

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file.");

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);
    setResults([]);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/quiz/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResults(response.data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to process PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload PDF to Generate Quiz</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Upload and Generate"}
      </button>

      <div className="mt-6 space-y-8">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading &&
          results.map((page, idx) => (
            <div key={idx} className="border p-4 rounded shadow">
              <img
                src={page.image}
                alt={`Page ${idx + 1}`}
                className="w-full mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">
                Questions from Page {idx + 1}:
              </h3>
              {page.questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-4">
                  <p className="font-medium">{q.question}</p>
                  <ul className="list-disc ml-6">
                    {q.options.map((opt, optIndex) => (
                      <li key={optIndex}>{opt}</li>
                    ))}
                  </ul>
                  <p className="text-green-600 mt-1">Answer: {q.answer}</p>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default QuizUploader;
