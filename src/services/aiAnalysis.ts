
export interface AIInsight {
  type: 'strength' | 'weakness' | 'recommendation' | 'red_flag';
  title: string;
  description: string;
  confidence: number;
}

export interface ComparisonResult {
  winner: string;
  category: string;
  reason: string;
  score1: number;
  score2: number;
}

export interface AIAnalysisResult {
  insights: AIInsight[];
  summary: string;
  recommendations: string[];
  riskFactors: string[];
  overallAssessment: 'excellent' | 'good' | 'average' | 'poor';
}

class AIAnalysisService {
  async analyzeCandidate(candidate: any): Promise<AIAnalysisResult> {
    // Mock AI analysis - in production, this would call an actual AI service
    return new Promise((resolve) => {
      setTimeout(() => {
        const insights = this.generateInsights(candidate);
        const summary = this.generateSummary(candidate);
        const recommendations = this.generateRecommendations(candidate);
        const riskFactors = this.generateRiskFactors(candidate);
        const overallAssessment = this.getOverallAssessment(candidate.score);

        resolve({
          insights,
          summary,
          recommendations,
          riskFactors,
          overallAssessment
        });
      }, 1500);
    });
  }

  async compareCandidates(candidate1: any, candidate2: any): Promise<ComparisonResult[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comparisons = [
          {
            winner: candidate1.score > candidate2.score ? candidate1.name : candidate2.name,
            category: 'Overall Score',
            reason: candidate1.score > candidate2.score 
              ? 'Higher credibility and technical assessment'
              : 'Better overall evaluation metrics',
            score1: candidate1.score,
            score2: candidate2.score
          },
          {
            winner: candidate1.skills.length > candidate2.skills.length ? candidate1.name : candidate2.name,
            category: 'Technical Breadth',
            reason: candidate1.skills.length > candidate2.skills.length
              ? 'Demonstrates proficiency in more technologies'
              : 'Shows expertise across diverse technical areas',
            score1: candidate1.skills.length,
            score2: candidate2.skills.length
          },
          {
            winner: this.getExperienceYears(candidate1.experience) > this.getExperienceYears(candidate2.experience) 
              ? candidate1.name : candidate2.name,
            category: 'Experience Level',
            reason: this.getExperienceYears(candidate1.experience) > this.getExperienceYears(candidate2.experience)
              ? 'More years of professional experience'
              : 'Greater industry experience and exposure',
            score1: this.getExperienceYears(candidate1.experience),
            score2: this.getExperienceYears(candidate2.experience)
          }
        ];
        resolve(comparisons);
      }, 1000);
    });
  }

  private generateInsights(candidate: any): AIInsight[] {
    const insights: AIInsight[] = [];

    if (candidate.score >= 8.5) {
      insights.push({
        type: 'strength',
        title: 'Exceptional Candidate',
        description: 'This candidate demonstrates outstanding qualifications and would be an excellent addition to any team.',
        confidence: 0.95
      });
    }

    if (candidate.skills.includes('React') && candidate.skills.includes('TypeScript')) {
      insights.push({
        type: 'strength',
        title: 'Modern Frontend Expertise',
        description: 'Strong proficiency in current industry-standard frontend technologies.',
        confidence: 0.88
      });
    }

    if (candidate.redFlags > 0) {
      insights.push({
        type: 'red_flag',
        title: 'Potential Concerns Detected',
        description: 'Some inconsistencies or gaps identified that may require further investigation.',
        confidence: 0.75
      });
    }

    insights.push({
      type: 'recommendation',
      title: 'Interview Recommendation',
      description: candidate.score >= 7.5 
        ? 'Highly recommended for technical interview'
        : 'Consider for initial screening call',
      confidence: 0.82
    });

    return insights;
  }

  private generateSummary(candidate: any): string {
    const scoreTier = candidate.score >= 8.5 ? 'exceptional' : candidate.score >= 7 ? 'strong' : 'moderate';
    const experienceLevel = this.getExperienceYears(candidate.experience) >= 5 ? 'senior' : 'mid-level';
    
    return `${candidate.name} is a ${scoreTier} candidate with ${experienceLevel} experience. They demonstrate proficiency in ${candidate.skills.slice(0, 3).join(', ')} and show ${candidate.redFlags === 0 ? 'no significant red flags' : 'some areas of concern'} in their background.`;
  }

  private generateRecommendations(candidate: any): string[] {
    const recommendations = [];

    if (candidate.score >= 8) {
      recommendations.push('Fast-track for senior role consideration');
      recommendations.push('Schedule technical deep-dive interview');
    } else if (candidate.score >= 7) {
      recommendations.push('Proceed with standard interview process');
      recommendations.push('Assess technical skills through coding challenge');
    } else {
      recommendations.push('Consider for junior or mid-level positions');
      recommendations.push('Provide additional training and mentorship');
    }

    if (candidate.skills.includes('Leadership') || candidate.experience.includes('Lead')) {
      recommendations.push('Evaluate for team lead or management track');
    }

    return recommendations;
  }

  private generateRiskFactors(candidate: any): string[] {
    const risks = [];

    if (candidate.redFlags > 1) {
      risks.push('Multiple inconsistencies in background information');
    }

    if (candidate.experience.includes('gap')) {
      risks.push('Employment gaps may indicate career instability');
    }

    if (candidate.score < 6) {
      risks.push('Below-average assessment scores may indicate skill gaps');
    }

    if (risks.length === 0) {
      risks.push('No significant risk factors identified');
    }

    return risks;
  }

  private getOverallAssessment(score: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (score >= 8.5) return 'excellent';
    if (score >= 7) return 'good';
    if (score >= 5.5) return 'average';
    return 'poor';
  }

  private getExperienceYears(experience: string): number {
    const match = experience.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
}

export const aiAnalysisService = new AIAnalysisService();
