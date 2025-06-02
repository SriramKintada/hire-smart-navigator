
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building, GraduationCap } from 'lucide-react';

interface TimelineEntry {
  type: 'work' | 'education';
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ResumeTimelineProps {
  timeline: TimelineEntry[];
}

export const ResumeTimeline = ({ timeline }: ResumeTimelineProps) => {
  const sortedTimeline = [...timeline].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Career Timeline</h4>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {sortedTimeline.map((entry, index) => (
            <div key={index} className="relative flex items-start space-x-6">
              {/* Timeline dot */}
              <div className="flex-shrink-0 w-16 h-16 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center">
                {entry.type === 'work' ? (
                  <Building className="h-6 w-6 text-blue-600" />
                ) : (
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                )}
              </div>
              
              {/* Content */}
              <Card className="flex-1">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-semibold text-lg">{entry.title}</h5>
                      <p className="text-gray-600">{entry.company}</p>
                    </div>
                    <Badge variant={entry.type === 'work' ? 'default' : 'secondary'}>
                      {entry.type === 'work' ? 'Work' : 'Education'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{entry.startDate} - {entry.endDate}</span>
                  </div>
                  
                  <p className="text-gray-700">{entry.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
