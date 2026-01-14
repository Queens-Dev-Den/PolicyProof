import { Upload, FileText, ChevronLeft, ChevronRight, X, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useDocumentContext } from "@/context/DocumentContext";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function DocumentViewer({
  document,
  fileName,
  onUpload,
  onReanalyze,
  fileInputRef,
}: {
  document: string;
  fileName: string;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReanalyze: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageInput, setPageInput] = useState<string>("1");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const { findings, isAnalyzing } = useDocumentContext();
  const containerRef = useRef<HTMLDivElement>(null);

  // Get findings for current page
  const currentPageFindings = findings.filter(
    (f) => f.location_metadata.page_number === pageNumber
  );
  const pageViolations = currentPageFindings.filter((f) => f.type === "VIOLATION").length;
  const pageCompliances = currentPageFindings.filter((f) => f.type === "COMPLIANCE").length;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Subtract padding (16px on each side = 32px total)
        const newWidth = containerRef.current.offsetWidth - 32;
        setContainerWidth(newWidth);
      }
    };

    updateWidth();
    
    const resizeObserver = new ResizeObserver(updateWidth);
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageInput("1");
    setPageNumber(1);
  }

  // Listen for scrollToFinding event from FindingsPanel
  useEffect(() => {
    const handleScrollToFinding = (event: CustomEvent) => {
      const { pageNumber: targetPage } = event.detail;
      setPageNumber(targetPage);
      setPageInput(targetPage.toString());
    };

    window.addEventListener("scrollToFinding" as any, handleScrollToFinding);
    return () => {
      window.removeEventListener("scrollToFinding" as any, handleScrollToFinding);
    };
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pageNumber]);



  const goToPrevPage = () => {
    const newPage = Math.max(pageNumber - 1, 1);
    setPageNumber(newPage);
    setPageInput(newPage.toString());
  };

  const goToNextPage = () => {
    const newPage = Math.min(pageNumber + 1, numPages);
    setPageNumber(newPage);
    setPageInput(newPage.toString());
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const page = parseInt(pageInput, 10);
      if (!isNaN(page) && page >= 1 && page <= numPages) {
        setPageNumber(page);
      } else {
        // Reset to current page if invalid
        setPageInput(pageNumber.toString());
      }
    }
  };

  const handlePageInputBlur = () => {
    const page = parseInt(pageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      setPageNumber(page);
    } else {
      // Reset to current page if invalid
      setPageInput(pageNumber.toString());
    }
  };

  return (
    <div className="enterprise-card h-full w-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <h2 className="text-sm font-semibold text-foreground truncate">
            {fileName}
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary"
            onClick={onReanalyze}
            disabled={isAnalyzing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Re-analyze
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the input value to allow re-uploading
                fileInputRef.current.click();
              }
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload New Document
          </Button>
        </div>
      </div>

      {/* Page Navigation Controls */}
      {numPages > 0 && (
        <div className="p-2 border-b border-border flex items-center justify-between gap-4">
            {/* Current Page Findings Indicator */}
            <div className="flex items-center gap-2 ml-2">
              {pageViolations > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-destructive/10 border border-destructive/30 rounded-md">
                  <X className="w-3 h-3 text-destructive" />
                  <span className="text-xs font-semibold text-destructive">
                    {pageViolations} violation{pageViolations !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {pageCompliances > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-success/10 border border-success/30 rounded-md">
                  <Check className="w-3 h-3 text-success" />
                  <span className="text-xs font-semibold text-success">
                    {pageCompliances} compliance{pageCompliances !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Page</span>
                <Input
                  type="text"
                  value={pageInput}
                  onChange={handlePageInputChange}
                  onKeyDown={handlePageInputSubmit}
                  onBlur={handlePageInputBlur}
                  className="w-12 h-7 text-center text-sm px-1"
                />
                <span className="text-sm text-muted-foreground">of {numPages}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
        </div>
      )}

      <div ref={scrollContainerRef} className="flex-1 overflow-auto bg-muted/30 flex items-start justify-center p-4">
        <div ref={containerRef} className="w-full flex justify-center">
          <Document
            file={document}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center p-8">
                <p className="text-sm text-muted-foreground">Loading PDF...</p>
              </div>
            }
            error={
              <div className="flex items-center justify-center p-8">
                <p className="text-sm text-destructive">Failed to load PDF</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
              width={containerWidth > 0 ? containerWidth : undefined}
            />
          </Document>
        </div>
      </div>

      {/* Hidden file input for uploading new document */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onUpload}
      />
    </div>
  );
}
