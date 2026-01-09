import { useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  FolderOpen,
  Cloud,
  HardDrive,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface PolicyDirectory {
  id: string;
  name: string;
  policyName: string;
  path: string;
  type: "local" | "cloud";
  enabled: boolean;
}

const initialDirectories: PolicyDirectory[] = [
  {
    id: "1",
    name: "GDPR_Policies",
    policyName: "GDPR Data Protection Policy",
    path: "/policies/gdpr/",
    type: "local",
    enabled: true,
  },
  {
    id: "2",
    name: "ISO_Standards",
    policyName: "ISO 27001 Security Standards",
    path: "/policies/iso/",
    type: "local",
    enabled: true,
  },
  {
    id: "3",
    name: "Cloud_Compliance",
    policyName: "Cloud Compliance Framework",
    path: "https://s3.amazonaws.com/compliance-bucket/",
    type: "cloud",
    enabled: false,
  },
  {
    id: "4",
    name: "HR_Policies",
    policyName: "HR Compliance Guidelines",
    path: "https://storage.company.com/hr-policies/",
    type: "cloud",
    enabled: true,
  },
];

interface PolicyDirectoryTableProps {
  onViewDirectory: (directory: PolicyDirectory) => void;
}

export function PolicyDirectoryTable({
  onViewDirectory,
}: PolicyDirectoryTableProps) {
  const [directories, setDirectories] =
    useState<PolicyDirectory[]>(initialDirectories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const toggleDirectory = (id: string) => {
    setDirectories((prev) =>
      prev.map((dir) =>
        dir.id === id ? { ...dir, enabled: !dir.enabled } : dir
      )
    );
  };

  const startEditing = (directory: PolicyDirectory) => {
    setEditingId(directory.id);
    setEditValue(directory.policyName);
  };

  const saveEdit = (id: string) => {
    setDirectories((prev) =>
      prev.map((dir) =>
        dir.id === id ? { ...dir, policyName: editValue } : dir
      )
    );
    setEditingId(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const getTypeIcon = (type: PolicyDirectory["type"]) => {
    switch (type) {
      case "local":
        return <HardDrive className="w-4 h-4" />;
      case "cloud":
        return <Cloud className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: PolicyDirectory["type"]) => {
    switch (type) {
      case "local":
        return "Local";
      case "cloud":
        return "Cloud";
    }
  };

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-16">Enabled</TableHead>
            <TableHead>Directory Name</TableHead>
            <TableHead>Policy Name</TableHead>
            <TableHead className="hidden md:table-cell">Path / URL</TableHead>
            <TableHead className="hidden sm:table-cell">Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {directories.map((directory) => (
            <TableRow
              key={directory.id}
              className={cn(
                "group",
                !directory.enabled && "opacity-60"
              )}
            >
              <TableCell>
                <Switch
                  checked={directory.enabled}
                  onCheckedChange={() => toggleDirectory(directory.id)}
                  className="data-[state=checked]:bg-primary"
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{directory.name}</span>
                </div>
              </TableCell>
              <TableCell>
                {editingId === directory.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(directory.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-success hover:text-success"
                      onClick={() => saveEdit(directory.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={cancelEdit}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {directory.policyName}
                  </span>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {directory.path}
                </code>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getTypeIcon(directory.type)}
                  <span className="text-sm">{getTypeLabel(directory.type)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onViewDirectory(directory)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => startEditing(directory)}
                    disabled={editingId !== null}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export type { PolicyDirectory };
