import { useState } from "react";
import { Search, Lightbulb, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppMode } from "@/pages/Index";

interface QueryInterfaceProps {
  mode: AppMode;
  query: string;
  onQueryChange: (query: string) => void;
  onSearch?: (query: string, filters?: any) => void;
}

const INTERNAL_EXAMPLES = [
  "Find senior React developers with 5+ years experience",
  "Show candidates with strong Python and machine learning skills",
  "Rank all candidates by overall credibility score",
  "Find candidates with gaps in employment history",
];

const EXTERNAL_EXAMPLES = [
  "React developers with TypeScript experience",
  "Machine learning engineers",
  "Full-stack developers with Node.js",
  "Python developers with data science background",
];

export const QueryInterface = ({
  mode,
  query,
  onQueryChange,
  onSearch,
}: QueryInterfaceProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [language, setLanguage] = useState<string>("all");
  const [location, setLocation] = useState<string>("");

  const examples = mode === "internal" ? INTERNAL_EXAMPLES : EXTERNAL_EXAMPLES;

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      const filters = {
        language: language === "all" ? undefined : language,
        location: location.trim() || undefined,
      };
      onSearch(query, filters);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="rounded-xl bg-[#222336] border border-[#2a2b3d] shadow-md p-6 mb-6">
      <div className="mb-2 flex items-center gap-2">
        <Search className="h-5 w-5 text-blue-400" />
        <span className="font-semibold text-lg text-white">
          Query Your Candidate Pool
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 rounded-lg px-4 py-3 bg-[#181926] text-white border border-[#2a2b3d] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 outline-none placeholder-gray-400 text-base shadow-sm transition"
          placeholder="Ask anything about your candidates..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-bold shadow transition"
          onClick={() => onSearch && onSearch(query)}
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-2 text-gray-400 text-sm">
        Upload your candidate data below, then use natural language to filter,
        rank, and analyze your applicant pool.
      </p>
    </div>
  );
};
