import { ComplianceFramework } from "@/components/audit/ComplianceFramework";
import { DocumentViewer } from "@/components/audit/DocumentViewer";
import { FindingsPanel } from "@/components/audit/FindingsPanel";

export default function DocumentAudit() {
  return (
    <div className="h-screen flex flex-col">
      {/* Main Content - 3 Column Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-0 overflow-hidden">
        {/* Column 1: Compliance Framework (20%) */}
        <div className="border-r border-border overflow-hidden hidden lg:block">
          <ComplianceFramework />
        </div>

        {/* Column 2: Document Viewer (50%) */}
        <div className="overflow-hidden">
          <DocumentViewer />
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
