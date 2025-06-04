import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, FileText, Shield, BarChart, Mail, CheckCircle, TrendingUp, Github, Twitter } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      name: "AI NLP Based Candidate Search",
      description:
        'Use natural language processing to search candidates with plain-English queries like "Find senior Gen-AI engineers in Europe with 5+ years experience" and get instant, ranked matches from internal and external talent sources.',
      icon: Search,
    },
    {
      name: "Automated Resume Parsing",
      description:
        "Upload resumes or spreadsheets and let HireAI automatically extract skills, experience, education, and certifications with high accuracy using advanced AI parsing technology.",
      icon: FileText,
    },
    {
      name: "Credibility Check",
      description:
        "Validate candidate information by checking timelines for consistency, verifying certifications, and cross-referencing experience claims to ensure authentic profiles.",
      icon: CheckCircle,
    },
    {
      name: "Compatibility Sorting & Ranking",
      description:
        "Get intelligent candidate rankings based on job requirements, skills match, experience level, and cultural fit scores to focus on the most suitable candidates first.",
      icon: TrendingUp,
    },
    {
      name: "Bias Mitigation & Explainability",
      description:
        "Ensure fair, transparent screening with live bias metrics and feature-level score explanations. Know exactly why each candidate was recommended or flagged with full transparency.",
      icon: Shield,
    },
    {
      name: "Talent Analytics Dashboard",
      description:
        "Monitor your recruitment pipeline in real time: track drop-off points, skill distributions, diversity metrics, time-to-hire, and candidate quality scores with rich visualizations.",
      icon: BarChart,
    },
    {
      name: "Automated Email Outreach",
      description:
        "Generate personalized, compelling outreach emails in one click based on candidate profiles and job requirements. Increase response rates with AI-crafted messaging.",
      icon: Mail,
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">HireAI</span>
            </a>
            <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
              <a href="/features" className="transition-colors hover:text-primary">
                Features
              </a>
              <a href="/solutions" className="transition-colors hover:text-primary">
                Solutions
              </a>
              <a href="/about-us" className="transition-colors hover:text-primary">
                About Us
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <a href="https://github.com/hireai" target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </a>
              <Button variant="ghost" size="sm">
                Contact
              </Button>
              <Button size="sm">Get a Demo</Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
          <div className="space-y-4">
            <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
              Revolutionize Hiring
              <br />
              with HireAI
            </h1>
            <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              AI-powered copilot that finds, screens, and engages top AI talent in seconds. From natural-language candidate
              search to bias-mitigated scoring and personalized outreach, HireAI accelerates your recruitment process from
              weeks to days.
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/app')}
            >
              Explore Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Schedule a Demo
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container space-y-16 py-24 md:py-32">
          <div className="mx-auto max-w-[58rem] text-center">
            <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Core Features</h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Discover how HireAI can transform your recruitment process with our innovative technologies.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative overflow-hidden rounded-lg border bg-background p-8">
                <div className="flex items-center gap-4">
                  <feature.icon className="h-8 w-8" />
                  <h3 className="font-bold">{feature.name}</h3>
                </div>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t">
          <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
            <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Ready to Hire Top Talent?</h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Join leading companies who rely on HireAI to streamline their recruiting and build diverse, high-performing
              teams.
            </p>
            <Button 
              size="lg" 
              className="mt-4"
              onClick={() => navigate('/app')}
            >
              Get Started Today
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t">
          <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12">
            <div className="flex-1 space-y-4">
              <h2 className="font-bold">HireAI</h2>
              <p className="text-sm text-muted-foreground">
                Pioneering AI-driven recruitment solutions for the digital age.
              </p>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-12 sm:grid-cols-3">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Features</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="/ai-candidate-search"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      AI Candidate Search
                    </a>
                  </li>
                  <li>
                    <a href="/resume-parsing" className="text-muted-foreground transition-colors hover:text-primary">
                      Resume Parsing
                    </a>
                  </li>
                  <li>
                    <a
                      href="/bias-explainability"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      Bias & Explainability
                    </a>
                  </li>
                  <li>
                    <a
                      href="/analytics-dashboard"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      Analytics Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="/outreach-scheduling"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      Outreach & Scheduling
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Company</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="/about" className="text-muted-foreground transition-colors hover:text-primary">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/careers" className="text-muted-foreground transition-colors hover:text-primary">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Connect</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/hireai"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                  <a
                    href="https://twitter.com/hireai"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="container border-t py-6">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} HireAI, Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 