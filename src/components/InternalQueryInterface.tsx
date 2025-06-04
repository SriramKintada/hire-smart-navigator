import { useState } from "react";
import { Search, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InternalQueryInterfaceProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
}

const INTERNAL_EXAMPLES = [
  "Find senior React developers with 5+ years experience",
  "Show candidates with strong Python and machine learning skills",
  "Rank all candidates by overall credibility score",
  "Find candidates with gaps in employment history",
];

export const InternalQueryInterface = ({
  query,
  onQueryChange,
  onSearch,
}: InternalQueryInterfaceProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
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
          Query Your Candidate Pool (Internal Data)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 rounded-lg px-4 py-3 bg-[#181926] text-white border border-[#2a2b3d] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 outline-none placeholder-gray-400 text-base shadow-sm transition"
          placeholder="Filter and search within your uploaded candidates..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-bold shadow transition"
          onClick={handleSearch}
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-2 text-gray-400 text-sm">
        Search and filter the candidates you have uploaded.
      </p>
    </div>
  );
}; 