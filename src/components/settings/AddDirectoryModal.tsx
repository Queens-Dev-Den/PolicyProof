import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddDirectoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDirectoryModal({
  open,
  onOpenChange,
}: AddDirectoryModalProps) {
  const [name, setName] = useState("");
  const [policyName, setPolicyName] = useState("");
  const [path, setPath] = useState("");
  const [sourceType, setSourceType] = useState<"local" | "cloud" | "">("");
  const [enabled, setEnabled] = useState(true);

  const handleSelectLocalDirectory = () => {
    // In a real implementation, this would open a file picker
    // For now, we'll simulate selecting a directory
    setPath("/policies/selected-directory/");
  };

  const handleSave = () => {
    // Handle save logic
    onOpenChange(false);
    // Reset form
    setName("");
    setPolicyName("");
    setPath("");
    setSourceType("");
    setEnabled(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Policy Directory</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Directory Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., GDPR_Policies"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policyName">Policy Name</Label>
            <Input
              id="policyName"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder="e.g., GDPR Data Protection Policy"
            />
          </div>

          <div className="space-y-2">
            <Label>Source Type</Label>
            <Select value={sourceType} onValueChange={(value: "local" | "cloud") => {
              setSourceType(value);
              setPath(""); // Reset path when type changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select source type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="cloud">Cloud</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sourceType === "local" && (
            <div className="space-y-2">
              <Label>Local Directory</Label>
              <div className="flex gap-2">
                <Input
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="Selected directory path"
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSelectLocalDirectory}
                  className="flex-shrink-0"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Browse
                </Button>
              </div>
            </div>
          )}

          {sourceType === "cloud" && (
            <div className="space-y-2">
              <Label htmlFor="cloudUrl">Cloud URL</Label>
              <Input
                id="cloudUrl"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="e.g., https://s3.amazonaws.com/bucket/ or https://storage.company.com/"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enable Directory</Label>
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
