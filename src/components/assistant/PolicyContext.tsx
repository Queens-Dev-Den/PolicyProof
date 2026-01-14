import { useEffect } from "react";
import { BookOpen, FileText, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDocumentContext } from "@/context/DocumentContext";

export function PolicyContext() {
  const { referencedFrameworks, relevantArticles, setReferencedFrameworks, setRelevantArticles } = useDocumentContext();

  // Listen for policy context updates from PolicyChat
  useEffect(() => {
    const handleUpdatePolicyContext = (event: CustomEvent) => {
      const { referencedFrameworks: frameworks, relevantArticles: articles } = event.detail;
      setReferencedFrameworks(frameworks || []);
      setRelevantArticles(articles || []);
    };

    window.addEventListener("updatePolicyContext" as any, handleUpdatePolicyContext);
    return () => {
      window.removeEventListener("updatePolicyContext" as any, handleUpdatePolicyContext);
    };
  }, [setReferencedFrameworks, setRelevantArticles]);

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
          {referencedFrameworks.length > 0 ? (
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
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Ask a question to see referenced frameworks
            </p>
          )}
        </div>

        {/* Relevant Articles */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Relevant Articles / Clauses
          </h3>
          {relevantArticles.length > 0 ? (
            <div className="space-y-2">
              {relevantArticles.map((article, index) => (
                <div
                  key={index}
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
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Ask a question to see relevant articles
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
