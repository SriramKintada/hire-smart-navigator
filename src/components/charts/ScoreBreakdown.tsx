import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

interface ScoreBreakdownProps {
  data: {
    category_scores?: Record<string, number>;
    category_explanations?: Record<string, string>;
    radar_chart_data?: Array<{ category: string; score: number }>;
    bar_chart_data?: Array<{ category: string; score: number }>;
    // Legacy fields for backward compatibility
    grammar?: number;
    technical?: number;
    consistency?: number;
    buzzwords?: number;
    verifiability?: number;
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  grammar: "Grammar & Writing",
  technical: "Technical Content",
  consistency: "Date Consistency",
  buzzwords: "Buzzword Usage",
  verifiability: "Verifiability",
  realism: "Realism",
  detailing: "Detailing",
  education: "Education",
  employers: "Employers",
  external_presence: "External Presence",
  professionalism: "Professionalism",
  ai_generated: "AI-Generated",
};

function getScoreColor(score: number) {
  if (score >= 8) return "#22c55e";
  if (score >= 6) return "#eab308";
  if (score >= 4) return "#f97316";
  return "#ef4444";
}

export const ScoreBreakdown = ({ data }: ScoreBreakdownProps) => {
  // Prefer new fields, fallback to legacy
  const categoryScores = data.category_scores || {
    grammar: data.grammar ?? 0,
    technical: data.technical ?? 0,
    consistency: data.consistency ?? 0,
    buzzwords: data.buzzwords ?? 0,
    verifiability: data.verifiability ?? 0,
  };
  const categoryExplanations = data.category_explanations || {};

  // Radar chart data
  const radarData = data.radar_chart_data
    ? data.radar_chart_data.map((d) => ({
        subject: CATEGORY_LABELS[d.category] || d.category,
        score: d.score,
        fullMark: 10,
      }))
    : Object.entries(categoryScores).map(([key, value]) => ({
        subject: CATEGORY_LABELS[key] || key,
        score: key === "buzzwords" ? 10 - value : value, // Invert buzzwords
        fullMark: 10,
      }));

  // Bar chart data
  const barData = data.bar_chart_data
    ? data.bar_chart_data.map((d) => ({
        category: CATEGORY_LABELS[d.category] || d.category,
        score: d.category === "buzzwords" ? 10 - d.score : d.score,
        color: getScoreColor(
          d.category === "buzzwords" ? 10 - d.score : d.score
        ),
      }))
    : Object.entries(categoryScores).map(([key, value]) => ({
        category: CATEGORY_LABELS[key] || key,
        score: key === "buzzwords" ? 10 - value : value,
        color: getScoreColor(key === "buzzwords" ? 10 - value : value),
      }));

  // For explanations, show all available
  const explanationKeys = Object.keys(categoryScores);

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium">Credibility Score Breakdown</h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="h-80">
          <h5 className="text-md font-medium mb-2">Overall Profile</h5>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" fontSize={12} />
              <PolarRadiusAxis angle={90} domain={[0, 10]} fontSize={10} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        {/* Bar Chart */}
        <div className="h-80">
          <h5 className="text-md font-medium mb-2">Category Scores</h5>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Score Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {explanationKeys.map((key) => (
          <div key={key} className="flex flex-col mb-2">
            <div className="flex justify-between">
              <span>{CATEGORY_LABELS[key] || key}:</span>
              <span className="font-medium">
                {categoryScores[key]}/10
                {key === "buzzwords" && " (lower is better)"}
              </span>
            </div>
            {categoryExplanations[key] && (
              <span className="text-gray-400 ml-2">
                {categoryExplanations[key]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
