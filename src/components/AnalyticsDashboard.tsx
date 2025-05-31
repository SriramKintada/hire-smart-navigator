
import { BarChart, PieChart, TrendingUp, Users, Award, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AppMode } from '@/pages/Index';
import { ProcessedCandidate } from '@/hooks/useFileProcessing';

interface AnalyticsDashboardProps {
  mode: AppMode;
  candidates: ProcessedCandidate[];
}

export const AnalyticsDashboard = ({ mode, candidates }: AnalyticsDashboardProps) => {
  // Calculate real stats from candidates data
  const totalCandidates = candidates.length;
  const avgScore = candidates.length > 0 
    ? (candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length).toFixed(1)
    : '0';
  const topTierCount = candidates.filter(c => c.score >= 8).length;
  const redFlagsCount = candidates.reduce((sum, c) => sum + c.redFlags, 0);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Total Candidates</p>
              <p className="text-lg font-semibold">{totalCandidates}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Avg Score</p>
              <p className="text-lg font-semibold">{avgScore}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-xs text-gray-500">Top Tier</p>
              <p className="text-lg font-semibold">{topTierCount}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-xs text-gray-500">Red Flags</p>
              <p className="text-lg font-semibold">{redFlagsCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart Placeholders */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium">Score Distribution</h3>
        </div>
        <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Score Histogram Chart</p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <PieChart className="h-5 w-5 text-green-600" />
          <h3 className="font-medium">Top Skills</h3>
        </div>
        <div className="h-32 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Skills Heatmap</p>
        </div>
      </Card>

      {mode === 'internal' && (
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h3 className="font-medium">Credibility Factors</h3>
          </div>
          <div className="h-32 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Credibility Radar Chart</p>
          </div>
        </Card>
      )}

      {mode === 'external' && (
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart className="h-5 w-5 text-orange-600" />
            <h3 className="font-medium">Activity Timeline</h3>
          </div>
          <div className="h-32 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Contribution Timeline</p>
          </div>
        </Card>
      )}
    </div>
  );
};
