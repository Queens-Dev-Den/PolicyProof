import { useRef, useState } from "react";
import { DocumentViewer } from "@/components/audit/DocumentViewer";
import { FindingsPanel } from "@/components/audit/FindingsPanel";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useDocumentContext } from "@/context/DocumentContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/clerk-react";

export default function DocumentAudit() {
  const {
    uploadedDocument,
    fileName,
    uploadedFile,
    setUploadedDocument,
    setFileName,
    setUploadedFile,
    setFindings,
    isAnalyzing,
    setIsAnalyzing,
    selectedFrameworks,
  } = useDocumentContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const { getToken } = useAuth();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the input value to allow re-uploading
      fileInputRef.current.click();
    }
  };

  const analyzeDocument = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Get auth token from Clerk
      const token = await getToken();
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('frameworks', JSON.stringify(selectedFrameworks));
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/analyze-document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
      setUploadedFile(file); // Store the file object
      setFindings([]); // Clear previous findings
      
      // Analyze the document
      await analyzeDocument(file);
    }
  };

  const handleReanalyze = async () => {
    if (uploadedFile) {
      setFindings([]); // Clear previous findings
      await analyzeDocument(uploadedFile);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Main Content - 2 Column Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0 overflow-hidden">
        {/* Column 1: Document Viewer or Upload Prompt */}
        <div className="overflow-hidden flex items-center justify-center relative">
          {isAnalyzing && uploadedDocument && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-6 p-8">
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin text-primary" />
                  <div className="absolute inset-0 w-16 h-16 animate-ping text-primary/30">
                    <Loader2 className="w-16 h-16" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Analyzing Document</h3>
                  <p className="text-sm text-muted-foreground">
                    AI is reviewing your document for compliance violations...
                  </p>
                  <div className="flex items-center justify-center gap-1 pt-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {uploadedDocument ? (
            <DocumentViewer
              document={uploadedDocument}
              fileName={fileName || "Document"}
              onUpload={handleFileChange}
              onReanalyze={handleReanalyze}
              fileInputRef={fileInputRef}
            />
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Please upload a document to begin the audit.
              </p>
              {isAnalyzing && (
                <div className="flex flex-col items-center gap-4 mb-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <div className="absolute inset-0 w-12 h-12 animate-ping text-primary/30">
                      <Loader2 className="w-12 h-12" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground mb-1">Analyzing document...</p>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
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
