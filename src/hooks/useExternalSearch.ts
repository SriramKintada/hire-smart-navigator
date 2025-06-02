
import { useState } from 'react';
import { githubApi, ExternalCandidate } from '@/services/githubApi';
import { analytics } from '@/lib/analytics';

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
      
      // Track analytics for external search
      analytics.trackTalentSearch(query, results.length);
      
      // Track each external candidate analyzed
      results.forEach((candidate) => {
        analytics.trackCandidateAnalyzed({
          score: candidate.score,
          skills: candidate.skills || [],
          mode: 'external',
          redFlags: 0 // External candidates don't have red flags analysis
        });
      });
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
