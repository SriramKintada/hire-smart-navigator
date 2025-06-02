import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  BarChart,
  PieChart,
  Activity,
  Mail,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart 
} from 'recharts';
import { analytics } from '@/lib/analytics';

interface AnalyticsData {
  totalCandidates: number;
  qualifiedCandidates: number;
  averageScore: number;
  topSkills: Array<{ skill: string; count: number }>;
  conversionRate: number;
  candidatesBySource: Record<string, number>;
  scoreDistribution: Record<string, number>;
  dailyActivity: Array<{ date: string; candidates: number; contacted: number }>;
}

interface TalentAnalyticsDashboardProps {
  candidates: any[];
  mode: 'internal' | 'external';
}

export const TalentAnalyticsDashboard = ({ candidates, mode }: TalentAnalyticsDashboardProps) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalCandidates: 0,
    qualifiedCandidates: 0,
    averageScore: 0,
    topSkills: [],
    conversionRate: 0,
    candidatesBySource: {},
    scoreDistribution: {},
    dailyActivity: []
  });

  useEffect(() => {
    // Calculate analytics data from candidates
    if (candidates.length > 0) {
      const qualified = candidates.filter(c => c.score >= 7.5);
      const avgScore = candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length;
      
      // Calculate top skills
      const skillsMap: Record<string, number> = {};
      candidates.forEach(candidate => {
        candidate.skills?.forEach((skill: string) => {
          skillsMap[skill] = (skillsMap[skill] || 0) + 1;
        });
      });
      
      const topSkills = Object.entries(skillsMap)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count }));

      // Score distribution
      const scoreDistribution = {
        'High (8.5+)': candidates.filter(c => c.score >= 8.5).length,
        'Medium (7-8.4)': candidates.filter(c => c.score >= 7 && c.score < 8.5).length,
        'Low (<7)': candidates.filter(c => c.score < 7).length
      };

      // Mock daily activity data
      const dailyActivity = [
        { date: '2025-06-01', candidates: 12, contacted: 3 },
        { date: '2025-06-02', candidates: 8, contacted: 2 },
        { date: '2025-06-03', candidates: 15, contacted: 5 },
        { date: '2025-06-04', candidates: 10, contacted: 2 },
        { date: '2025-06-05', candidates: 18, contacted: 7 },
        { date: '2025-06-06', candidates: 14, contacted: 4 },
        { date: '2025-06-07', candidates: 20, contacted: 8 }
      ];

      setAnalyticsData({
        totalCandidates: candidates.length,
        qualifiedCandidates: qualified.length,
        averageScore: Number(avgScore.toFixed(1)),
        topSkills,
        conversionRate: candidates.length > 0 ? Number(((qualified.length / candidates.length) * 100).toFixed(1)) : 0,
        candidatesBySource: {
          'Resume Upload': mode === 'internal' ? candidates.length : 0,
          'GitHub Search': mode === 'external' ? candidates.length : 0,
          'LinkedIn': 0,
          'Internal Referral': 0
        },
        scoreDistribution,
        dailyActivity
      });
    }
  }, [candidates, mode]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Talent Pool Analytics</h2>
          <p className="text-gray-600">Real-time insights into your hiring pipeline</p>
        </div>
        <Badge variant="outline" className="text-blue-600">
          <Activity className="w-4 h-4 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalCandidates}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Qualified Candidates</p>
                <p className="text-2xl font-bold text-green-600">{analyticsData.qualifiedCandidates}</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-orange-600">{analyticsData.averageScore}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">{analyticsData.conversionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="activity">Daily Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={Object.entries(analyticsData.scoreDistribution).map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(analyticsData.scoreDistribution).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Candidate Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Candidate Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={Object.entries(analyticsData.candidatesBySource).map(([name, value]) => ({ name, value }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="w-5 h-5 mr-2" />
                Top Skills in Talent Pool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart data={analyticsData.topSkills} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="skill" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Hiring Funnel Conversion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="font-medium">Total Resumes Analyzed</span>
                  <span className="text-2xl font-bold text-blue-600">{analyticsData.totalCandidates}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">Qualified Candidates</span>
                  <span className="text-2xl font-bold text-green-600">{analyticsData.qualifiedCandidates}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <span className="font-medium">Contacted</span>
                  <span className="text-2xl font-bold text-orange-600">0</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <span className="font-medium">Interviewed</span>
                  <span className="text-2xl font-bold text-purple-600">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Daily Activity Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="candidates" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="contacted" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};