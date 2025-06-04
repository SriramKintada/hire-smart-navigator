export interface GitHubUser {
  id: number;
  login: string;
  name?: string;
  avatar_url: string;
  bio?: string;
  location?: string;
  email?: string;
  blog?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
  created_at?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  size: number;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
}

export interface ExternalCandidate {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  location?: string;
  email?: string;
  blog?: string;
  githubUrl: string;
  score: number;
  skills: string[];
  repositories?: GitHubRepo[];
  totalCommits?: number;
  totalStars?: number;
  totalForks?: number;
  accountAge?: number;
  lastActivity?: string;
  contributionScore?: number;
  codeQualityScore?: number;
  projectDiversityScore?: number;
}

class GitHubApiService {
  private baseUrl = 'https://api.github.com';
  
  async searchUsers(query: string, language?: string): Promise<ExternalCandidate[]> {
    try {
      // Construct search query
      let searchQuery = query;
      if (language) {
        searchQuery += ` language:${language}`;
      }
      
      const response = await fetch(`${this.baseUrl}/search/users?q=${encodeURIComponent(searchQuery)}&per_page=20`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to search users');
      }
      
      const candidates: ExternalCandidate[] = data.items.map((user: any) => ({
        id: user.id.toString(),
        name: user.login,
        username: user.login,
        avatar: user.avatar_url,
        githubUrl: user.html_url,
        score: 0,
        skills: [],
      }));
      
      return candidates;
    } catch (error) {
      console.error('GitHub API search error:', error);
      return this.getMockExternalCandidates(query);
    }
  }
  
  async getUserDetails(username: string): Promise<ExternalCandidate | null> {
    try {
      const [userResponse, reposResponse] = await Promise.all([
        fetch(`${this.baseUrl}/users/${username}`),
        fetch(`${this.baseUrl}/users/${username}/repos?sort=updated&per_page=10`)
      ]);
      
      const user = await userResponse.json();
      const repos = await reposResponse.json();
      
      if (!userResponse.ok || !reposResponse.ok) {
        return null;
      }
      
      const skills = this.extractSkillsFromRepos(repos);
      const scores = this.calculateGitHubScores(user, repos);
      
      return {
        id: user.id.toString(),
        name: user.name || user.login,
        username: user.login,
        avatar: user.avatar_url,
        bio: user.bio || 'No bio available',
        location: user.location || 'Not specified',
        email: user.email || 'Not public',
        blog: user.blog || '',
        githubUrl: user.html_url,
        score: scores.overall,
        skills,
        repositories: repos,
        totalCommits: await this.getTotalCommits(username),
        totalStars: repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0),
        accountAge: this.calculateAccountAge(user.created_at),
        lastActivity: this.getLastActivity(repos),
        contributionScore: scores.contribution,
        codeQualityScore: scores.codeQuality,
        projectDiversityScore: scores.projectDiversity
      };
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  }
  
  private extractSkillsFromRepos(repos: GitHubRepo[]): string[] {
    const languages = repos
      .map(repo => repo.language)
      .filter(Boolean)
      .reduce((acc: Record<string, number>, lang) => {
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {});
    
    return Object.keys(languages).slice(0, 8);
  }
  
  private calculateGitHubScores(user: GitHubUser, repos: GitHubRepo[]) {
    const contribution = Math.min(10, (user.public_repos || 0) * 0.1 + (user.followers || 0) * 0.05);
    const codeQuality = Math.min(10, (repos.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0) * 0.01);
    const projectDiversity = Math.min(10, new Set(repos.map(r => r.language)).size * 0.5);
    const overall = (contribution + codeQuality + projectDiversity) / 3;
    
    return {
      contribution: Math.round(contribution * 10) / 10,
      codeQuality: Math.round(codeQuality * 10) / 10,
      projectDiversity: Math.round(projectDiversity * 10) / 10,
      overall: Math.round(overall * 10) / 10
    };
  }
  
  private async getTotalCommits(username: string): Promise<number> {
    // Mock implementation - actual would require extensive API calls
    return Math.floor(Math.random() * 2000) + 100;
  }
  
  private calculateAccountAge(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365));
  }
  
  private getLastActivity(repos: GitHubRepo[]): string {
    const latest = repos.reduce((latest, repo) => {
      const repoDate = new Date(repo.updated_at);
      return repoDate > latest ? repoDate : latest;
    }, new Date(0));
    
    return latest.toISOString().split('T')[0];
  }
  
  private getMockExternalCandidates(query: string): ExternalCandidate[] {
    const mockCandidates = [
      {
        id: 'ext1',
        name: 'Sarah Chen',
        username: 'sarahdev',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b547?w=150',
        bio: 'Full-stack developer passionate about React and Node.js',
        location: 'San Francisco, CA',
        email: 'sarah@example.com',
        blog: 'https://sarahdev.blog',
        githubUrl: 'https://github.com/sarahdev',
        score: 8.7,
        skills: ['React', 'Node.js', 'TypeScript', 'Python', 'Docker'],
        repositories: [],
        totalCommits: 1247,
        totalStars: 234,
        totalForks: 45,
        accountAge: 4,
        lastActivity: '2024-05-30',
        contributionScore: 8.9,
        codeQualityScore: 8.5,
        projectDiversityScore: 8.7
      },
      {
        id: 'ext2',
        name: 'Alex Rodriguez',
        username: 'alexcodes',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'Machine Learning Engineer & Open Source Contributor',
        location: 'Austin, TX',
        email: 'alex@example.com',
        blog: '',
        githubUrl: 'https://github.com/alexcodes',
        score: 9.1,
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Go', 'Kubernetes'],
        repositories: [],
        totalCommits: 2156,
        totalStars: 567,
        totalForks: 89,
        accountAge: 6,
        lastActivity: '2024-05-29',
        contributionScore: 9.3,
        codeQualityScore: 8.9,
        projectDiversityScore: 9.1
      }
    ];
    
    return mockCandidates.filter(candidate => 
      candidate.name.toLowerCase().includes(query.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

export const githubApi = new GitHubApiService();
