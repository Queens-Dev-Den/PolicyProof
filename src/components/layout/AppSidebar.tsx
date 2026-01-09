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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { title: "Document Audit", icon: FileSearch, href: "/" },
  { title: "Live Assistant", icon: MessageSquare, href: "/assistant" },
  { title: "Governance Settings", icon: Settings, href: "/settings" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out h-screen sticky top-0",
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
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const NavButton = (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150",
                "hover:bg-sidebar-accent",
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
                <TooltipContent side="right" className="font-medium">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return NavButton;
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-2 pb-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "w-full text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              {collapsed ? (
                <PanelLeft className="w-4 h-4" />
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 mr-2" />
                  <span className="text-xs">Collapse</span>
                </>
              )}
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
      <div className="border-t border-border p-3">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
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
