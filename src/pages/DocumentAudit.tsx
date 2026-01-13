import { useRef, useState } from "react";
import { DocumentViewer } from "@/components/audit/DocumentViewer";
import { FindingsPanel } from "@/components/audit/FindingsPanel";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useDocumentContext } from "@/context/DocumentContext";
import { useToast } from "@/hooks/use-toast";

export default function DocumentAudit() {
  const {
    uploadedDocument,
    fileName,
    setUploadedDocument,
    setFileName,
    setFindings,
    isAnalyzing,
    setIsAnalyzing,
  } = useDocumentContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the input value to allow re-uploading
      fileInputRef.current.click();
    }
  };

  const analyzeDocument = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/analyze-document`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }
      
      const data = await response.json();
      setFindings(data.findings || []);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${data.findings?.length || 0} findings in the document.`,
      });
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the document. Please make sure the backend server is running.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setUploadedDocument(fileURL); // Update the document URL
      setFileName(file.name); // Update the file name
      setFindings([]); // Clear previous findings
      
      // Analyze the document
      await analyzeDocument(file);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Main Content - 2 Column Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0 overflow-hidden">
        {/* Column 1: Document Viewer or Upload Prompt */}
        <div className="overflow-hidden flex items-center justify-center">
          {uploadedDocument ? (
            <DocumentViewer
              document={uploadedDocument}
              fileName={fileName || "Document"}
              onUpload={handleFileChange}
              fileInputRef={fileInputRef}
            />
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Please upload a document to begin the audit.
              </p>
              {isAnalyzing && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Analyzing document...</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isAnalyzing}
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary"
                onClick={handleButtonClick}
                disabled={isAnalyzing}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          )}
        </div>

        {/* Column 2: Findings Panel */}
        <div className="border-l border-border overflow-hidden hidden lg:block">
          <FindingsPanel />
        </div>
      </div>

      {/* Mobile: Tabs for smaller screens */}
      <div className="lg:hidden border-t border-border p-4 bg-card">
        <p className="text-xs text-muted-foreground text-center">
          View full audit dashboard on desktop for best experience
        </p>
      </div>
    </div>
  );
}
