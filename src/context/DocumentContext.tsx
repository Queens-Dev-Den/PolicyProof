import React, { createContext, useContext, useState, ReactNode } from "react";

interface Finding {
  type: "VIOLATION" | "COMPLIANCE";
  title: string;
  section: string;
  message: string;
  policy_reference?: string;
  location_metadata: {
    page_number: number;
    exact_quote: string;
  };
}

interface DocumentContextType {
  uploadedDocument: string | null;
  fileName: string | null;
  findings: Finding[];
  isAnalyzing: boolean;
  setUploadedDocument: (document: string | null) => void;
  setFileName: (name: string | null) => void;
  setFindings: (findings: Finding[]) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [uploadedDocument, setUploadedDocument] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <DocumentContext.Provider
      value={{ 
        uploadedDocument, 
        fileName, 
        findings,
        isAnalyzing,
        setUploadedDocument, 
        setFileName,
        setFindings,
        setIsAnalyzing
      }}
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