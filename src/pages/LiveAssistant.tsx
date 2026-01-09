import { PolicyChat } from "@/components/assistant/PolicyChat";
import { PolicyContext } from "@/components/assistant/PolicyContext";

export default function LiveAssistant() {
  return (
    <div className="h-screen flex flex-col">
      {/* Main Content - 2 Column Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0 overflow-hidden">
        {/* Left Column: Chat Interface (70%) */}
        <div className="overflow-hidden">
          <PolicyChat />
        </div>

        {/* Right Column: Policy Context (30%) */}
        <div className="border-l border-border overflow-hidden hidden lg:block">
          <PolicyContext />
        </div>
      </div>
    </div>
  );
}
