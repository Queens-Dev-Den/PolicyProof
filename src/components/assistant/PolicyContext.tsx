import { BookOpen, FileText, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  source: string;
}

// These are the frameworks actually referenced in the current conversation
const referencedFrameworks = ["GDPR", "ISO 27001"];

const articles: Article[] = [
  { id: "1", title: "GDPR Art. 5 – Storage Limitation", source: "GDPR" },
  { id: "2", title: "GDPR Art. 17 – Right to Erasure", source: "GDPR" },
  { id: "3", title: "ISO 27001 A.8 – Asset Management", source: "ISO 27001" },
];

export function PolicyContext() {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Citation copied to clipboard");
  };

  return (
    <div className="enterprise-card h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Policy Context
        </h2>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6 scrollbar-thin">
        {/* Referenced Frameworks */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Referenced Frameworks
          </h3>
          <ul className="space-y-1.5">
            {referencedFrameworks.map((framework) => (
              <li
                key={framework}
                className="text-sm text-foreground flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {framework}
              </li>
            ))}
          </ul>
        </div>

        {/* Relevant Articles */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Relevant Articles / Clauses
          </h3>
          <div className="space-y-2">
            {articles.map((article) => (
              <div
                key={article.id}
                className="p-3 rounded-md border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {article.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleCopy(article.title)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
