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

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  referencedFrameworks?: string[];
  relevantArticles?: Array<{ title: string; source: string }>;
}

interface DocumentContextType {
  uploadedDocument: string | null;
  fileName: string | null;
  uploadedFile: File | null;
  findings: Finding[];
  isAnalyzing: boolean;
  selectedFinding: Finding | null;
  selectedFrameworks: string[];
  chatMessages: ChatMessage[];
  referencedFrameworks: string[];
  relevantArticles: Array<{ title: string; source: string }>;
  setUploadedDocument: (document: string | null) => void;
  setFileName: (name: string | null) => void;
  setUploadedFile: (file: File | null) => void;
  setFindings: (findings: Finding[]) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setSelectedFinding: (finding: Finding | null) => void;
  setSelectedFrameworks: (frameworks: string[]) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setReferencedFrameworks: (frameworks: string[]) => void;
  setRelevantArticles: (articles: Array<{ title: string; source: string }>) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

const ALL_FRAMEWORKS = [
  "GDPR",
  "CCPA",
  "HIPAA",
  "SOC 2",
  "ISO 27001",
  "PCI DSS",
  "NIST",
  "FERPA",
  "GLBA",
  "SOX",
  "FISMA",
  "FedRAMP",
  "CMMC",
  "CIS Controls",
  "COBIT",
];

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [uploadedDocument, setUploadedDocument] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(ALL_FRAMEWORKS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [referencedFrameworks, setReferencedFrameworks] = useState<string[]>([]);
  const [relevantArticles, setRelevantArticles] = useState<Array<{ title: string; source: string }>>([]);

  return (
    <DocumentContext.Provider
      value={{ 
        uploadedDocument, 
        fileName,
        uploadedFile,
        findings,
        isAnalyzing,
        selectedFinding,
        selectedFrameworks,
        chatMessages,
        referencedFrameworks,
        relevantArticles,
        setUploadedDocument, 
        setFileName,
        setUploadedFile,
        setFindings,
        setIsAnalyzing,
        setSelectedFinding,
        setSelectedFrameworks,
        setChatMessages,
        setReferencedFrameworks,
        setRelevantArticles
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