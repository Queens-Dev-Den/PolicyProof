import { useRef, useState } from "react";
import { ComplianceFramework } from "@/components/audit/ComplianceFramework";
import { DocumentViewer } from "@/components/audit/DocumentViewer";
import { FindingsPanel } from "@/components/audit/FindingsPanel";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useDocumentContext } from "@/context/DocumentContext";

export default function DocumentAudit() {
  const {
    uploadedDocument,
    fileName,
    setUploadedDocument,
    setFileName,
  } = useDocumentContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the input value to allow re-uploading
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setUploadedDocument(fileURL); // Update the document URL
      setFileName(file.name); // Update the file name
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Main Content - 3 Column Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-0 overflow-hidden">
        {/* Column 1: Compliance Framework (20%) */}
        <div className="border-r border-border overflow-hidden hidden lg:block">
          <ComplianceFramework />
        </div>

        {/* Column 2: Document Viewer or Upload Prompt (50%) */}
        <div className="overflow-hidden flex items-center justify-center">
          {uploadedDocument ? (
            <DocumentViewer
              document={uploadedDocument}
              fileName={fileName || "Document"}
              onUpload={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              fileInputRef={fileInputRef} // Pass fileInputRef as a prop
            />
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Please upload a document to begin the audit.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange} // Ensure the file change handler is used
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary"
                onClick={handleButtonClick}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          )}
        </div>

        {/* Column 3: Findings Panel (30%) */}
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
