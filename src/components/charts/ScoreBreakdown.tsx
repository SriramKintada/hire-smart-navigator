
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

interface ScoreBreakdownProps {
  data: {
    grammar: number;
    technical: number;
    consistency: number;
    buzzwords: number;
    verifiability: number;
  };
}

export const ScoreBreakdown = ({ data }: ScoreBreakdownProps) => {
  const radarData = [
    { subject: 'Grammar', score: data.grammar, fullMark: 10 },
    { subject: 'Technical', score: data.technical, fullMark: 10 },
    { subject: 'Consistency', score: data.consistency, fullMark: 10 },
    { subject: 'Buzzwords', score: 10 - data.buzzwords, fullMark: 10 }, // Inverted since lower is better
    { subject: 'Verifiability', score: data.verifiability, fullMark: 10 },
  ];

  const barData = Object.entries(data).map(([key, value]) => ({
    category: key.charAt(0).toUpperCase() + key.slice(1),
    score: key === 'buzzwords' ? 10 - value : value, // Invert buzzwords
    color: getScoreColor(key === 'buzzwords' ? 10 - value : value)
  }));

  function getScoreColor(score: number) {
    if (score >= 8) return '#22c55e';
    if (score >= 6) return '#eab308';
    if (score >= 4) return '#f97316';
    return '#ef4444';
  }

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
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Grammar & Writing:</span>
            <span className="font-medium">{data.grammar}/10</span>
          </div>
          <div className="flex justify-between">
            <span>Technical Content:</span>
            <span className="font-medium">{data.technical}/10</span>
          </div>
          <div className="flex justify-between">
            <span>Date Consistency:</span>
            <span className="font-medium">{data.consistency}/10</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Buzzword Usage:</span>
            <span className="font-medium">{data.buzzwords}/10 (lower is better)</span>
          </div>
          <div className="flex justify-between">
            <span>Verifiability:</span>
            <span className="font-medium">{data.verifiability}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
};
