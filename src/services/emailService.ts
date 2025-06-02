import { ProcessedCandidate } from '@/hooks/useFileProcessing';
import { ExternalCandidate } from './githubApi';

export interface PersonalizedEmail {
  subject: string;
  body: string;
  recipient: string;
}

class EmailService {
  /**
   * Generate a personalized email for contacting a candidate
   */
  generatePersonalizedEmail(
    candidate: ProcessedCandidate | ExternalCandidate,
    mode: 'internal' | 'external',
    senderName: string = 'Hiring Team',
    companyName: string = 'Our Company'
  ): PersonalizedEmail {
    const isInternal = mode === 'internal';
    const internalCandidate = candidate as ProcessedCandidate;
    const externalCandidate = candidate as ExternalCandidate;
    
    // Extract candidate information
    const candidateName = candidate.name;
    const skills = candidate.skills.slice(0, 3).join(', '); // Top 3 skills
    const position = isInternal 
      ? internalCandidate.title 
      : `${externalCandidate.username} (GitHub Developer)`;
    
    const experience = isInternal
      ? internalCandidate.experience
      : `${externalCandidate.accountAge} years on GitHub with ${externalCandidate.totalStars} stars`;
      
    const summary = isInternal
      ? internalCandidate.summary
      : externalCandidate.bio;

    // Generate subject line
    const subject = `Exciting Opportunity for ${candidateName} - ${position} Role`;

    // Generate personalized email body
    const body = this.generateEmailBody({
      candidateName,
      position,
      skills,
      experience,
      summary,
      senderName,
      companyName,
      isInternal,
      score: candidate.score
    });

    return {
      subject,
      body,
      recipient: isInternal 
        ? candidateName.toLowerCase().replace(/\s+/g, '.') + '@email.com' 
        : externalCandidate.email !== 'Not public' 
          ? externalCandidate.email 
          : externalCandidate.username + '@github-email.com'
    };
  }

  private generateEmailBody({
    candidateName,
    position,
    skills,
    experience,
    summary,
    senderName,
    companyName,
    isInternal,
    score
  }: {
    candidateName: string;
    position: string;
    skills: string;
    experience: string;
    summary: string;
    senderName: string;
    companyName: string;
    isInternal: boolean;
    score: number;
  }): string {
    const greeting = `Dear ${candidateName},`;
    
    const opening = `I hope this email finds you well. I came across your ${isInternal ? 'resume' : 'GitHub profile'} and was impressed by your background in ${position}.`;
    
    const skillsAppreciation = `Your expertise in ${skills} particularly caught our attention, and your overall profile scored ${score}/10 in our evaluation system.`;
    
    const experienceNote = experience 
      ? `Your experience (${experience}) aligns perfectly with what we're looking for.` 
      : '';
    
    const summaryNote = summary && summary !== 'No bio available'
      ? `I was particularly drawn to your background: "${summary}"`
      : '';
    
    const opportunity = `We have an exciting opportunity at ${companyName} that I believe would be a great match for your skills and career goals.`;
    
    const nextSteps = `Would you be interested in a brief conversation to discuss this opportunity further? I'd love to learn more about your career aspirations and share details about our company culture and this role.`;
    
    const closing = `Please let me know if you'd be available for a 15-20 minute call this week or next. I'm happy to work around your schedule.`;
    
    const signature = `Best regards,\n${senderName}\n${companyName}`;

    return [
      greeting,
      '',
      opening,
      '',
      skillsAppreciation,
      experienceNote,
      summaryNote,
      '',
      opportunity,
      '',
      nextSteps,
      '',
      closing,
      '',
      signature
    ].filter(Boolean).join('\n');
  }

  /**
   * Open default mail client with pre-filled email
   */
  openMailClient(email: PersonalizedEmail): void {
    const { subject, body, recipient } = email;
    
    // Create mailto URL
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open in new window/tab
    window.open(mailtoUrl, '_blank');
  }

  /**
   * Generate and open email for a candidate
   */
  contactCandidate(
    candidate: ProcessedCandidate | ExternalCandidate,
    mode: 'internal' | 'external',
    senderName?: string,
    companyName?: string
  ): void {
    const email = this.generatePersonalizedEmail(candidate, mode, senderName, companyName);
    this.openMailClient(email);
  }
}

export const emailService = new EmailService();