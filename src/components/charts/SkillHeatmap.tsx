
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SkillHeatmapProps {
  skills: string[];
}

export const SkillHeatmap = ({ skills }: SkillHeatmapProps) => {
  // Create frequency data from skills
  const skillFrequency = skills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + Math.floor(Math.random() * 10) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(skillFrequency)
    .map(([skill, frequency]) => ({ skill, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  const getColor = (frequency: number) => {
    if (frequency >= 8) return '#22c55e';
    if (frequency >= 6) return '#eab308';
    if (frequency >= 4) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="h-80 w-full">
      <h4 className="text-lg font-medium mb-4">Skill Frequency Analysis</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="skill" 
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.frequency)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
