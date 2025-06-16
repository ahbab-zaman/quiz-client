import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import QuizUploader from "./QuizUploader.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QuizUploader />
  </StrictMode>
);
