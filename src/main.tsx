import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DocumentProvider } from "@/context/DocumentContext";

createRoot(document.getElementById("root")!).render(
  <DocumentProvider>
    <App />
  </DocumentProvider>
);
