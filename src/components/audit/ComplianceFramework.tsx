import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

interface Rule {
  id: string;
  title: string;
  checked: boolean;
}

interface Framework {
  id: string;
  name: string;
  rules: Rule[];
}

const initialFrameworks: Framework[] = [
  {
    id: "gdpr",
    name: "GDPR Art. 17",
    rules: [
      { id: "g1", title: "Right to erasure implemented", checked: true },
      { id: "g2", title: "Data retention policy defined", checked: false },
      { id: "g3", title: "User consent mechanism", checked: true },
      { id: "g4", title: "Data portability support", checked: true },
      { id: "g5", title: "Breach notification process", checked: false },
    ],
  },
  {
    id: "iso27001",
    name: "ISO 27001",
    rules: [
      { id: "i1", title: "Access control policy", checked: true },
      { id: "i2", title: "Information classification", checked: true },
      { id: "i3", title: "Cryptographic controls", checked: false },
      { id: "i4", title: "Physical security", checked: true },
      { id: "i5", title: "Incident management", checked: true },
    ],
  },
  {
    id: "soc2",
    name: "SOC 2 Type II",
    rules: [
      { id: "s1", title: "Security monitoring", checked: true },
      { id: "s2", title: "Availability controls", checked: true },
      { id: "s3", title: "Processing integrity", checked: false },
      { id: "s4", title: "Confidentiality measures", checked: true },
    ],
  },
];

export function ComplianceFramework() {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(["gdpr"]);
  const [frameworks, setFrameworks] = useState<Framework[]>(initialFrameworks);

  const toggleFramework = (frameworkId: string) => {
    setSelectedFrameworks((prev) =>
      prev.includes(frameworkId)
        ? prev.filter((id) => id !== frameworkId)
        : [...prev, frameworkId]
    );
  };

  const toggleRule = (ruleId: string) => {
    setFrameworks((prev) =>
      prev.map((framework) => ({
        ...framework,
        rules: framework.rules.map((rule) =>
          rule.id === ruleId ? { ...rule, checked: !rule.checked } : rule
        ),
      }))
    );
  };

  const selectedRules = frameworks
    .filter((f) => selectedFrameworks.includes(f.id))
    .flatMap((f) => f.rules);

  const checkedCount = selectedRules.filter((r) => r.checked).length;
  const complianceScore = selectedRules.length > 0
    ? Math.round((checkedCount / selectedRules.length) * 100)
    : 0;

  const selectedNames = frameworks
    .filter((f) => selectedFrameworks.includes(f.id))
    .map((f) => f.name);

  return (
    <div className="enterprise-card h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Compliance Framework
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-sm font-normal"
            >
              <span className="truncate">
                {selectedNames.length > 0
                  ? selectedNames.length > 1
                    ? `${selectedNames.length} frameworks selected`
                    : selectedNames[0]
                  : "Select frameworks"}
              </span>
              <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {frameworks.map((framework) => (
              <DropdownMenuCheckboxItem
                key={framework.id}
                checked={selectedFrameworks.includes(framework.id)}
                onCheckedChange={() => toggleFramework(framework.id)}
              >
                {framework.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2 scrollbar-thin">
        {selectedRules.map((rule) => (
          <label
            key={rule.id}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-md text-sm transition-colors cursor-pointer hover:bg-muted/50",
              rule.checked ? "bg-compliant-light" : "bg-muted/30"
            )}
          >
            <Checkbox
              checked={rule.checked}
              onCheckedChange={() => toggleRule(rule.id)}
              className={cn(
                "flex-shrink-0",
                rule.checked && "border-success data-[state=checked]:bg-success data-[state=checked]:text-success-foreground"
              )}
            />
            <span
              className={cn(
                "flex-1",
                rule.checked ? "text-success" : "text-foreground"
              )}
            >
              {rule.title}
            </span>
          </label>
        ))}
        {selectedRules.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Select a framework to view compliance rules
          </p>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Compliance Score
          </span>
          <span
            className={cn(
              "text-sm font-semibold",
              complianceScore >= 80
                ? "text-success"
                : complianceScore >= 50
                ? "text-warning"
                : "text-destructive"
            )}
          >
            {complianceScore}%
          </span>
        </div>
        <Progress
          value={complianceScore}
          className={cn(
            "h-2",
            complianceScore >= 80
              ? "[&>div]:bg-success"
              : complianceScore >= 50
              ? "[&>div]:bg-warning"
              : "[&>div]:bg-destructive"
          )}
        />
      </div>
    </div>
  );
}
