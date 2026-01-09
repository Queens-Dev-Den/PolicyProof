import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocumentViewer() {
  return (
    <div className="enterprise-card h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Uploaded Contract.pdf
          </h2>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6 scrollbar-thin">
        <div className="prose prose-sm max-w-none text-foreground">
          <h3 className="text-lg font-semibold mb-4">
            DATA PROCESSING AGREEMENT
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Version 2.4 | Last Updated: January 2024
          </p>

          <h4 className="text-sm font-semibold mt-6 mb-3">1. DEFINITIONS</h4>
          <p className="text-sm leading-relaxed mb-4">
            For the purposes of this Agreement, the following terms shall have
            the meanings set forth below. "Personal Data" means any information
            relating to an identified or identifiable natural person.
          </p>

          <h4 className="text-sm font-semibold mt-6 mb-3">
            2. DATA RETENTION POLICY
          </h4>
          <p className="text-sm leading-relaxed mb-4">
            The Processor shall process Personal Data only for the duration
            necessary to fulfill the purposes specified herein.{" "}
            <span className="highlight-violation">
              Customer data may be retained indefinitely for business analytics
              and improvement purposes, unless explicitly requested otherwise.
            </span>{" "}
            This retention shall be subject to periodic review.
          </p>

          <h4 className="text-sm font-semibold mt-6 mb-3">
            3. SECURITY MEASURES
          </h4>
          <p className="text-sm leading-relaxed mb-4">
            <span className="highlight-compliant">
              The Processor implements appropriate technical and organizational
              measures to ensure a level of security appropriate to the risk,
              including encryption of personal data both at rest and in
              transit.
            </span>{" "}
            Regular security assessments shall be conducted quarterly.
          </p>

          <h4 className="text-sm font-semibold mt-6 mb-3">
            4. DATA SUBJECT RIGHTS
          </h4>
          <p className="text-sm leading-relaxed mb-4">
            The Controller shall ensure that Data Subjects can exercise their
            rights under applicable data protection laws, including the right
            to access, rectification, erasure, and data portability. The
            Processor shall assist the Controller in responding to such
            requests within the statutory timeframe.
          </p>

          <h4 className="text-sm font-semibold mt-6 mb-3">
            5. SUB-PROCESSING
          </h4>
          <p className="text-sm leading-relaxed mb-4">
            The Processor shall not engage another processor without prior
            specific or general written authorization of the Controller. Where
            general authorization is given, the Processor shall inform the
            Controller of any intended changes concerning the addition or
            replacement of other processors.
          </p>

          <h4 className="text-sm font-semibold mt-6 mb-3">
            6. INTERNATIONAL TRANSFERS
          </h4>
          <p className="text-sm leading-relaxed mb-4">
            Any transfer of Personal Data to third countries shall be subject
            to appropriate safeguards as required by applicable law. The
            Processor shall ensure that adequate protection measures are in
            place prior to any such transfer.
          </p>
        </div>
      </div>
    </div>
  );
}
