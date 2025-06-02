
import { useState } from 'react';
import { githubApi, ExternalCandidate } from '@/services/githubApi';

export const useExternalSearch = () => {
  const [candidates, setCandidates] = useState<ExternalCandidate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTalent = async (query: string, filters?: { language?: string; location?: string }) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const results = await githubApi.searchUsers(query, filters?.language);
      setCandidates(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      console.error('External search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearResults = () => {
    setCandidates([]);
    setError(null);
  };

  return {
    candidates,
    isSearching,
    error,
    searchTalent,
    clearResults
  };
};
