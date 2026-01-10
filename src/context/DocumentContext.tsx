import React, { createContext, useContext, useState, ReactNode } from "react";

interface DocumentContextType {
  uploadedDocument: string | null;
  fileName: string | null;
  setUploadedDocument: (document: string | null) => void;
  setFileName: (name: string | null) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [uploadedDocument, setUploadedDocument] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <DocumentContext.Provider
      value={{ uploadedDocument, fileName, setUploadedDocument, setFileName }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocumentContext must be used within a DocumentProvider");
  }
  return context;
};