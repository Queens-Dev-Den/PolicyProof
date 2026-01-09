import { AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Finding {
  id: string;
  type: "violation" | "compliant";
  title: string;
  description: string;
  section: string;
  lineNumber?: number;
}

const findings: Finding[] = [
  {
    id: "1",
    type: "violation",
    title: "Data Retention Error",
    description:
      "Clause permits indefinite storage of customer data, violating GDPR Article 5(1)(e) which requires storage limitation.",
    section: "Section 2",
    lineNumber: 12,
  },
  {
    id: "2",
    type: "compliant",
    title: "Security Measures Compliant",
    description:
      "Encryption requirements meet ISO 27001 standards for data protection at rest and in transit.",
    section: "Section 3",
    lineNumber: 24,
  },
  {
    id: "3",
    type: "violation",
    title: "Missing DPO Reference",
    description:
      "No reference to Data Protection Officer contact information as required by GDPR Article 37.",
    section: "Section 1",
    lineNumber: 5,
  },
];

export function FindingsPanel() {
  const violations = findings.filter((f) => f.type === "violation");
  const compliant = findings.filter((f) => f.type === "compliant");

  const handleViewInDocument = (lineNumber?: number) => {
    // In a real implementation, this would scroll to the specific line in the document
    console.log("Scrolling to line:", lineNumber);
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
        {findings.map((finding) => (
          <div
            key={finding.id}
            className={cn(
              "p-4 rounded-md border transition-all hover:shadow-sm",
              finding.type === "violation"
                ? "bg-violation-light border-destructive/30"
                : "bg-compliant-light border-success/30"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-md flex-shrink-0",
                  finding.type === "violation"
                    ? "bg-destructive/10"
                    : "bg-success/10"
                )}
              >
                {finding.type === "violation" ? (
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-success" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "text-sm font-medium mb-1",
                    finding.type === "violation"
                      ? "text-destructive"
                      : "text-success"
                  )}
                >
                  {finding.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {finding.section}
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {finding.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 text-primary hover:text-primary p-0 h-auto"
                  onClick={() => handleViewInDocument(finding.lineNumber)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View in document
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
