import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocumentViewer({
  document,
  fileName,
  onUpload,
  fileInputRef,
}: {
  document: string;
  fileName: string;
  onUpload: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) {
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
              fileInputRef.current.click();
            }
          }}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload New Document
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        {/* PDF Viewer */}
        <iframe
          src={document}
          title="PDF Viewer"
          className="w-full h-full border-none"
        ></iframe>
      </div>
    </div>
  );
}
