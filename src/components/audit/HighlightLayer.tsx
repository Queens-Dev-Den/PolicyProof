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
    const margin = 50; // pixels from edges
    const findingHeight = 40;
    const spacing = 20;
    const y = margin + (index * (findingHeight + spacing));
    
    return {
      x: margin,
      y: y,
      width: pageWidth - 2 * margin,
      height: findingHeight,
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
        
        return (
          <div
            key={index}
            className={cn(
              "absolute pointer-events-auto cursor-pointer transition-all duration-300",
              isSelected && "animate-pulse"
            )}
            style={{
              left: `${box.x}px`,
              top: `${box.y}px`,
              width: `${box.width}px`,
              height: `${box.height}px`,
            }}
            onClick={() => onFindingClick(finding)}
            title={finding.title}
          >
            {/* Semi-transparent background overlay */}
            <div
              className={cn(
                "absolute inset-0 rounded transition-opacity",
                finding.type === "VIOLATION"
                  ? "bg-destructive/20 hover:bg-destructive/30"
                  : "bg-success/20 hover:bg-success/30"
              )}
            />
            
            {/* Colored underline */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-1 rounded-full",
                finding.type === "VIOLATION" ? "bg-destructive" : "bg-success"
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
