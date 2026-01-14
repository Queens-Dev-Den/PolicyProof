import { cn } from "@/lib/utils";

interface Finding {
  type: "VIOLATION" | "COMPLIANCE";
  title: string;
  section: string;
  message: string;
  policy_reference?: string;
  location_metadata: {
    page_number: number;
    exact_quote: string;
    bounding_box?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

interface HighlightLayerProps {
  findings: Finding[];
  pageNumber: number;
  pageWidth: number;
  pageHeight: number;
  onFindingClick: (finding: Finding) => void;
  selectedFinding: Finding | null;
}

export function HighlightLayer({
  findings,
  pageNumber,
  pageWidth,
  pageHeight,
  onFindingClick,
  selectedFinding,
}: HighlightLayerProps) {
  // Filter findings for the current page
  const pageFindings = findings.filter(
    (f) => f.location_metadata.page_number === pageNumber
  );

  /**
   * Calculate approximate bounding box for a finding based on quote text.
   * Since the backend doesn't provide real bounding boxes yet, we mock them
   * by distributing findings vertically across the page.
   * 
   * In a production implementation, this would use actual PDF text extraction
   * and coordinate mapping from the backend.
   */
  const calculateBoundingBox = (finding: Finding, index: number) => {
    // If bounding box is provided from backend, use it
    if (finding.location_metadata.bounding_box) {
      return finding.location_metadata.bounding_box;
    }

    // Mock bounding box calculation
    // Divide page into vertical sections and place findings
    // Using more realistic text dimensions
    const margin = 72; // 1 inch margin (typical PDF margin)
    const lineHeight = 16; // Typical line height in pixels
    const spacing = 24; // Space between findings
    const y = margin + (index * (lineHeight + spacing));
    
    // Estimate width based on quote length (rough approximation)
    const charWidth = 7; // Average character width
    const quoteLength = finding.location_metadata.exact_quote.length;
    const estimatedWidth = Math.min(quoteLength * charWidth, pageWidth - 2 * margin);
    
    return {
      x: margin,
      y: y,
      width: estimatedWidth,
      height: lineHeight,
    };
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: pageWidth,
        height: pageHeight,
      }}
    >
      {pageFindings.map((finding, index) => {
        const box = calculateBoundingBox(finding, index);
        const isSelected = selectedFinding === finding;
        const underlineThickness = isSelected ? 3 : 2;
        
        return (
          <div
            key={index}
            className={cn(
              "absolute pointer-events-auto cursor-pointer transition-all duration-200"
            )}
            style={{
              left: `${box.x}px`,
              top: `${box.y + box.height}px`, // Position directly at bottom of text
              width: `${box.width}px`,
              height: `${underlineThickness}px`,
              backgroundColor: finding.type === "VIOLATION" 
                ? "rgb(239 68 68)" // red-500
                : "rgb(34 197 94)", // green-500
              opacity: isSelected ? 1 : 0.8,
              boxShadow: isSelected 
                ? finding.type === "VIOLATION"
                  ? "0 0 8px rgba(239, 68, 68, 0.6)"
                  : "0 0 8px rgba(34, 197, 94, 0.6)"
                : "none",
            }}
            onClick={() => onFindingClick(finding)}
            title={finding.title}
          />
        );
      })}
    </div>
  );
}
