import { Eye, FileSearch, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDocumentContext } from "@/context/DocumentContext";

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

export function FindingsPanel() {
  const { findings, isAnalyzing } = useDocumentContext();
  
  const violations = findings.filter((f) => f.type === "VIOLATION");
  const compliant = findings.filter((f) => f.type === "COMPLIANCE");

  const handleViewInDocument = (finding: Finding) => {
    // Emit custom event to navigate to the specific page and highlight the finding
    const event = new CustomEvent("scrollToFinding", {
      detail: {
        pageNumber: finding.location_metadata.page_number,
        finding: finding,
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="enterprise-card h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          Document Analysis
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {violations.length} violations · {compliant.length} compliant
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3 scrollbar-thin">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <FileSearch className="w-16 h-16 text-primary/20" />
              <Sparkles className="w-8 h-8 text-primary absolute top-0 right-0 animate-pulse" />
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Scanning Document</h3>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                AI is analyzing compliance violations and compliant sections
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary/60 animate-pulse rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary/40 animate-pulse rounded-full" style={{ width: '40%', animationDelay: '200ms' }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary/20 animate-pulse rounded-full" style={{ width: '80%', animationDelay: '400ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : findings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Upload a document to see compliance findings
            </p>
          </div>
        ) : (
          findings.map((finding, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-md border transition-all hover:shadow-sm",
                finding.type === "VIOLATION"
                  ? "bg-violation-light border-destructive/30"
                  : "bg-compliant-light border-success/30"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "text-sm font-medium mb-1",
                      finding.type === "VIOLATION"
                        ? "text-destructive"
                        : "text-success"
                    )}
                  >
                    {finding.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {finding.section}
                    {finding.policy_reference && ` · ${finding.policy_reference}`}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {finding.message}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-primary hover:text-primary p-0 h-auto"
                    onClick={() => handleViewInDocument(finding)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View in document (Page {finding.location_metadata.page_number})
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
