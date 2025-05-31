
import { useState } from 'react';
import { Search, Lightbulb, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppMode } from '@/pages/Index';

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
  "Find candidates with gaps in employment history"
];

const EXTERNAL_EXAMPLES = [
  "React developers with TypeScript experience",
  "Machine learning engineers",
  "Full-stack developers with Node.js",
  "Python developers with data science background"
];

export const QueryInterface = ({ mode, query, onQueryChange, onSearch }: QueryInterfaceProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [language, setLanguage] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  
  const examples = mode === 'internal' ? INTERNAL_EXAMPLES : EXTERNAL_EXAMPLES;

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query, { language, location });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <Search className="h-5 w-5" />
          <h2 className="text-lg font-semibold">
            {mode === 'internal' ? 'Query Your Candidate Pool' : 'Search External Talent'}
          </h2>
        </div>
        
        <div className="relative">
          <Input
            placeholder={
              mode === 'internal'
                ? "Ask anything about your candidates..."
                : "Search for talent across GitHub..."
            }
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyPress={handleKeyPress}
            className="text-lg py-3 pr-12"
          />
          <Button
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* External Mode Filters */}
        {mode === 'external' && (
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Programming Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Languages</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        )}

        {showSuggestions && (
          <Card className="absolute z-10 w-full mt-1 p-3 bg-white border shadow-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Example queries:</span>
            </div>
            <div className="space-y-1">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => onQueryChange(example)}
                  className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </Card>
        )}
        
        <p className="text-sm text-gray-600">
          {mode === 'internal'
            ? "Upload your candidate data below, then use natural language to filter, rank, and analyze your applicant pool."
            : "Search across GitHub to find external talent. Use filters to narrow down by programming language and location."}
        </p>
      </div>
    </Card>
  );
};
