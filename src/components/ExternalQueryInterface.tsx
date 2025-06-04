import { useState } from "react";
import { Search, Filter } from "lucide-react";
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

interface ExternalQueryInterfaceProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string, filters?: any) => void;
}

const EXTERNAL_EXAMPLES = [
  "React developers with TypeScript experience",
  "Machine learning engineers",
  "Full-stack developers with Node.js",
  "Python developers with data science background",
];

export const ExternalQueryInterface = ({
  query,
  onQueryChange,
  onSearch,
}: ExternalQueryInterfaceProps) => {
  const [language, setLanguage] = useState<string>("all");
  const [location, setLocation] = useState<string>("");

  const handleSearch = () => {
    if (query.trim()) {
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
          Search External Talent (GitHub)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 rounded-lg px-4 py-3 bg-[#181926] text-white border border-[#2a2b3d] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 outline-none placeholder-gray-400 text-base shadow-sm transition"
          placeholder="Search for developers on GitHub (e.g., 'React developers in London')..."
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

      {/* Optional: Add filters specific to external search if needed */}
      {/* <div className="mt-4 flex items-center gap-4">
        <Select onValueChange={setLanguage} value={language}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Language</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-[180px]"
        />
      </div> */}

      <p className="mt-2 text-gray-400 text-sm">
        Search and discover external talent based on their GitHub profiles.
      </p>
    </div>
  );
}; 