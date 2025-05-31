
import { ProcessedCandidate } from '@/hooks/useFileProcessing';
import { ExternalCandidate } from '@/services/githubApi';

class ExportService {
  exportToPDF(candidates: (ProcessedCandidate | ExternalCandidate)[], title: string = 'Candidate Report') {
    // Mock PDF export - in production, use a library like jsPDF or html2pdf
    const reportData = this.generateReportData(candidates, title);
    
    // Create a downloadable HTML report for now
    const htmlContent = this.generateHTMLReport(reportData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  exportToExcel(candidates: (ProcessedCandidate | ExternalCandidate)[]) {
    const csvContent = this.generateCSV(candidates);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `candidates-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private generateReportData(candidates: (ProcessedCandidate | ExternalCandidate)[], title: string) {
    const totalCandidates = candidates.length;
    const avgScore = candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length;
    const topCandidates = candidates.filter(c => c.score >= 8).length;
    
    return {
      title,
      generatedDate: new Date().toLocaleDateString(),
      summary: {
        totalCandidates,
        averageScore: avgScore.toFixed(1),
        topTierCandidates: topCandidates
      },
      candidates: candidates.sort((a, b) => b.score - a.score)
    };
  }

  private generateHTMLReport(data: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${data.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .candidate { border: 1px solid #ddd; margin-bottom: 20px; padding: 20px; border-radius: 8px; }
        .score { font-size: 24px; font-weight: bold; color: #2563eb; }
        .skills { margin-top: 10px; }
        .skill { background: #e5e7eb; padding: 4px 8px; border-radius: 4px; margin-right: 8px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.title}</h1>
        <p>Generated on: ${data.generatedDate}</p>
    </div>
    
    <div class="summary">
        <h2>Executive Summary</h2>
        <p><strong>Total Candidates:</strong> ${data.summary.totalCandidates}</p>
        <p><strong>Average Score:</strong> ${data.summary.averageScore}</p>
        <p><strong>Top Tier Candidates:</strong> ${data.summary.topTierCandidates}</p>
    </div>
    
    <h2>Candidate Details</h2>
    ${data.candidates.map((candidate: any) => `
        <div class="candidate">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>${candidate.name}</h3>
                <div class="score">${candidate.score}</div>
            </div>
            <p><strong>Title:</strong> ${candidate.title || candidate.username || 'N/A'}</p>
            <p><strong>Summary:</strong> ${candidate.summary || candidate.bio || 'No summary available'}</p>
            <div class="skills">
                <strong>Skills:</strong>
                ${candidate.skills.map((skill: string) => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </div>
    `).join('')}
</body>
</html>`;
  }

  private generateCSV(candidates: (ProcessedCandidate | ExternalCandidate)[]): string {
    const headers = ['Name', 'Score', 'Title/Username', 'Skills', 'Summary/Bio'];
    const rows = candidates.map(candidate => [
      candidate.name,
      candidate.score.toString(),
      'title' in candidate ? candidate.title : candidate.username,
      candidate.skills.join('; '),
      'summary' in candidate ? candidate.summary : candidate.bio
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return csvContent;
  }
}

export const exportService = new ExportService();
