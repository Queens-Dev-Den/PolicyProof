import { useState } from "react";
import { X, Search, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PolicyDirectory } from "./PolicyDirectoryTable";

interface PolicyFile {
  id: string;
  name: string;
  framework: string;
  lastUpdated: string;
  status: "active" | "deprecated" | "draft";
}

const mockFiles: PolicyFile[] = [
  {
    id: "1",
    name: "data_retention_policy.pdf",
    framework: "GDPR",
    lastUpdated: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "right_to_erasure_v2.pdf",
    framework: "GDPR",
    lastUpdated: "2024-01-10",
    status: "active",
  },
  {
    id: "3",
    name: "consent_framework.pdf",
    framework: "GDPR",
    lastUpdated: "2023-12-20",
    status: "deprecated",
  },
  {
    id: "4",
    name: "data_portability_draft.pdf",
    framework: "GDPR",
    lastUpdated: "2024-01-18",
    status: "draft",
  },
  {
    id: "5",
    name: "breach_notification.pdf",
    framework: "GDPR",
    lastUpdated: "2024-01-05",
    status: "active",
  },
];

interface DirectoryContentsDrawerProps {
  directory: PolicyDirectory | null;
  onClose: () => void;
}

export function DirectoryContentsDrawer({
  directory,
  onClose,
}: DirectoryContentsDrawerProps) {
  const [search, setSearch] = useState("");

  const filteredFiles = mockFiles.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: PolicyFile["status"]) => {
    switch (status) {
      case "active":
        return <span className="status-active">Active</span>;
      case "deprecated":
        return (
          <span className="status-deprecated flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Deprecated
          </span>
        );
      case "draft":
        return <span className="status-draft">Draft</span>;
    }
  };

  return (
    <Sheet open={!!directory} onOpenChange={() => onClose()}>
      <SheetContent className="sm:max-w-xl w-full">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {directory?.name}
          </SheetTitle>
        </SheetHeader>

        <div className="py-4">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search policies..."
              className="pl-10"
            />
          </div>

          {/* Files Table */}
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>File Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Framework</TableHead>
                  <TableHead className="hidden sm:table-cell">Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow
                    key={file.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50",
                      file.status === "deprecated" && "opacity-60"
                    )}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-primary hover:underline">
                          {file.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {file.framework}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {file.lastUpdated}
                    </TableCell>
                    <TableCell>{getStatusBadge(file.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No policies found matching "{search}"
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
