import { Search, FileText, Shield, BarChart, Mail, CheckCircle, TrendingUp } from "lucide-react"

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
]

export default function Features() {
  return (
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
  )
}
