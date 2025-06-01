import {
  BarChart,
  PieChart,
  TrendingUp,
  Users,
  Award,
  AlertTriangle,
  Brain,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { AppMode } from "@/pages/Index";
import { ProcessedCandidate } from "@/hooks/useFileProcessing";
import CountUp from "react-countup";
import type { CountUpProps } from "react-countup";

interface AnalyticsDashboardProps {
  mode: AppMode;
  candidates: ProcessedCandidate[];
}

export const AnalyticsDashboard = ({
  mode,
  candidates,
}: AnalyticsDashboardProps) => {
  // Calculate metrics
  const totalCandidates = candidates.length;
  const avgScore =
    totalCandidates > 0
      ? candidates.reduce((sum, c) => sum + c.score, 0) / totalCandidates
      : 0;
  const redFlagsCount = candidates.reduce(
    (sum, c) =>
      sum + (Array.isArray(c.redFlags) ? c.redFlags.length : c.redFlags || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {/* Total Candidates */}
        <div className="bg-white rounded-md shadow p-5 flex items-center space-x-4 border border-gray-100">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <div className="text-2xl font-bold text-gray-800">
              <CountUp end={totalCandidates} duration={1.2} />
            </div>
            <div className="text-sm text-gray-500">Total Candidates</div>
          </div>
        </div>
        {/* Average Score */}
        <div className="bg-white rounded-md shadow p-5 flex items-center space-x-4 border border-gray-100">
          <Brain className="h-8 w-8 text-green-500" />
          <div>
            <div className="text-2xl font-bold text-gray-800">
              <CountUp
                end={Number(avgScore.toFixed(1))}
                duration={1.2}
                decimals={1}
              />
            </div>
            <div className="text-sm text-gray-500">Avg Resume Score</div>
          </div>
        </div>
        {/* Total Red Flags */}
        <div className="bg-white rounded-md shadow p-5 flex items-center space-x-4 border border-gray-100">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <div>
            <div className="text-2xl font-bold text-gray-800">
              <CountUp end={redFlagsCount} duration={1.2} />
            </div>
            <div className="text-sm text-gray-500">Total Red Flags</div>
          </div>
        </div>
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

      {mode === "internal" && (
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

      {mode === "external" && (
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
