import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Shield,
  FileSearch,
  MessageSquare,
  Settings,
  PanelLeftClose,
  PanelLeft,
  User,
  CheckSquare,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDocumentContext } from "@/context/DocumentContext";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { title: "Document Audit", icon: FileSearch, href: "/" },
  { title: "Live Assistant", icon: MessageSquare, href: "/assistant" },
];

const COMPLIANCE_FRAMEWORKS = [
  "GDPR",
  "CCPA",
  "HIPAA",
  "SOC 2",
  "ISO 27001",
  "PCI DSS",
  "NIST",
  "FERPA",
  "GLBA",
  "SOX",
  "FISMA",
  "FedRAMP",
  "CMMC",
  "CIS Controls",
  "COBIT",
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { selectedFrameworks, setSelectedFrameworks } = useDocumentContext();

  const handleFrameworkToggle = (framework: string) => {
    if (selectedFrameworks.includes(framework)) {
      // Don't allow unchecking if it's the last one
      if (selectedFrameworks.length > 1) {
        setSelectedFrameworks(selectedFrameworks.filter(f => f !== framework));
      }
    } else {
      setSelectedFrameworks([...selectedFrameworks, framework]);
    }
  };

  const handleSelectAll = () => {
    setSelectedFrameworks([...COMPLIANCE_FRAMEWORKS]);
  };

  const handleUnselectAll = () => {
    // Keep only the first framework selected
    setSelectedFrameworks([COMPLIANCE_FRAMEWORKS[0]]);
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out h-screen sticky top-0 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary flex-shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span
            className={cn(
              "font-semibold text-foreground whitespace-nowrap transition-all duration-300",
              collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}
          >
            PolicyProof
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="py-4 px-2 space-y-1 flex-shrink-0">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const NavButton = (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md text-sm font-medium transition-all duration-150",
                "hover:bg-sidebar-accent",
                "px-3 py-2.5",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
              {!collapsed && (
                <span className="truncate animate-fade-in">{item.title}</span>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
                <TooltipContent side="right" align="center" className="font-medium">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return NavButton;
        })}
      </nav>

      {/* Spacer when collapsed */}
      {collapsed && <div className="flex-1" />}

      {/* Compliance Frameworks Section */}
      {!collapsed && (
        <div className="flex-1 flex flex-col px-3 pb-4 overflow-hidden min-w-0">
          <div className="mb-3 min-w-[208px]">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 whitespace-nowrap">
              Policy Frameworks
            </h3>
            <p className="text-xs text-muted-foreground mb-2 whitespace-nowrap">
              At least 1 framework must be selected
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="h-8 text-xs flex-1 text-primary hover:text-primary hover:bg-sidebar-accent"
                disabled={selectedFrameworks.length === COMPLIANCE_FRAMEWORKS.length}
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUnselectAll}
                className="h-8 text-xs flex-1 text-destructive hover:text-destructive hover:bg-sidebar-accent"
                disabled={selectedFrameworks.length === 1}
              >
                Clear
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1 -mx-1 px-1 border-2 rounded-md border-border/80 bg-sidebar/50">
            <div className="space-y-1 p-2">
              {COMPLIANCE_FRAMEWORKS.map((framework) => {
                const isChecked = selectedFrameworks.includes(framework);
                const isLastSelected = isChecked && selectedFrameworks.length === 1;
                
                return (
                  <div
                    key={framework}
                    onClick={() => !isLastSelected && handleFrameworkToggle(framework)}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer",
                      isLastSelected && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      disabled={isLastSelected}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary pointer-events-none"
                    />
                    <span
                      className={cn(
                        "text-sm font-medium leading-none select-none flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
                      )}
                    >
                      {framework}
                    </span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="pb-2 flex-shrink-0" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="w-full text-muted-foreground hover:text-foreground hover:bg-sidebar-accent justify-start items-center"
              style={{ paddingLeft: '0.75rem', height: '2rem', minHeight: '2rem' }}
            >
              <PanelLeft className="w-4 h-4 flex-shrink-0" style={{ marginRight: collapsed ? 0 : '0.5rem' }} />
              {!collapsed && <span className="text-xs whitespace-nowrap">Collapse</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="font-medium">
              Expand sidebar
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-border flex-shrink-0" style={{ padding: '0.75rem', minHeight: '4rem' }}>
        <div className="flex items-center gap-3" style={{ height: '2rem' }}>
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Compliance Admin
              </p>
              <p className="text-xs text-muted-foreground truncate">
                admin@company.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
