import { useState } from "react";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PolicyDirectoryTable,
  PolicyDirectory,
} from "@/components/settings/PolicyDirectoryTable";
import { AddDirectoryModal } from "@/components/settings/AddDirectoryModal";
import { DirectoryContentsDrawer } from "@/components/settings/DirectoryContentsDrawer";

export default function GovernanceSettings() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDirectory, setSelectedDirectory] =
    useState<PolicyDirectory | null>(null);

  return (
    <div className="h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Policy Sources Section */}
          <div className="enterprise-card">
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
                    <FolderOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      Policy Sources
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage where compliance policies are ingested from.
                    </p>
                  </div>
                </div>
                <Button onClick={() => setAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Policy Directory
                </Button>
              </div>
            </div>

            <div className="p-6">
              <PolicyDirectoryTable
                onViewDirectory={(dir) => setSelectedDirectory(dir)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddDirectoryModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <DirectoryContentsDrawer
        directory={selectedDirectory}
        onClose={() => setSelectedDirectory(null)}
      />
    </div>
  );
}
