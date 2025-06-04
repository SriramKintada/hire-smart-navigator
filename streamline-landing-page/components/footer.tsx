import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export default function Footer() {
  return (
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
                <Link
                  href="/ai-candidate-search"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  AI Candidate Search
                </Link>
              </li>
              <li>
                <Link href="/resume-parsing" className="text-muted-foreground transition-colors hover:text-primary">
                  Resume Parsing
                </Link>
              </li>
              <li>
                <Link
                  href="/bias-explainability"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Bias & Explainability
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics-dashboard"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/outreach-scheduling"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Outreach & Scheduling
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground transition-colors hover:text-primary">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/hireai"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://twitter.com/hireai"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
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
  )
}
