import { Upload, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { HighlightLayer } from "./HighlightLayer";
import { useDocumentContext } from "@/context/DocumentContext";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function DocumentViewer({
  document,
  fileName,
  onUpload,
  fileInputRef,
}: {
  document: string;
  fileName: string;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageInput, setPageInput] = useState<string>("1");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const { findings, selectedFinding, setSelectedFinding } = useDocumentContext();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageInput("1");
    setPageNumber(1);
  }

  function onPageLoadSuccess(page: any) {
    const viewport = page.getViewport({ scale: 1 });
    setPageWidth(viewport.width);
    setPageHeight(viewport.height);
  }

  // Listen for scrollToFinding event from FindingsPanel
  useEffect(() => {
    const handleScrollToFinding = (event: CustomEvent) => {
      const { pageNumber: targetPage, finding } = event.detail;
      setPageNumber(targetPage);
      setSelectedFinding(finding);
      
      // Clear selection after 3 seconds
      setTimeout(() => {
        setSelectedFinding(null);
      }, 3000);
    };

    window.addEventListener("scrollToFinding" as any, handleScrollToFinding);
    return () => {
      window.removeEventListener("scrollToFinding" as any, handleScrollToFinding);
    };
  }, [setSelectedFinding]);

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

  const handleFindingClick = (finding: any) => {
    setSelectedFinding(finding);
    setTimeout(() => {
      setSelectedFinding(null);
    }, 3000);
  };

  return (
    <div className="enterprise-card h-full w-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            {fileName}
          </h2>
        </div>
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

      {/* Page Navigation Controls */}
      {numPages > 0 && (
        <div className="p-2 border-b border-border flex items-center justify-center gap-4">
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
      )}

      <div className="flex-1 overflow-auto bg-muted/30 flex items-start justify-center p-4">
        <div className="relative">
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
            <div className="relative shadow-lg">
              <Page
                pageNumber={pageNumber}
                onLoadSuccess={onPageLoadSuccess}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="max-w-full"
              />
              {/* Overlay highlight layer on top of the page */}
              {pageWidth > 0 && pageHeight > 0 && (
                <HighlightLayer
                  findings={findings}
                  pageNumber={pageNumber}
                  pageWidth={pageWidth}
                  pageHeight={pageHeight}
                  onFindingClick={handleFindingClick}
                  selectedFinding={selectedFinding}
                />
              )}
            </div>
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
