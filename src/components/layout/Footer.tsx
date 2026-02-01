import { Link } from "react-router-dom";
import { FileText, Globe, Github, Instagram } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <ScrollReveal animation="fade-right" className="md:col-span-2">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-soft">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Resume<span className="text-gradient">Builder</span>
                </span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                Build job-targeted resumes with AI. Stand out from the crowd and land your dream job.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/create-resume" className="hover:text-foreground transition-colors">Create Resume</Link></li>
                <li><Link to="/job-description" className="hover:text-foreground transition-colors">Job Match</Link></li>
                <li><Link to="/preview" className="hover:text-foreground transition-colors">Preview</Link></li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={200}>
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a 
                    href="https://sk-coral.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    My Portfolio
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/Shubham1392003/resume-builder-vision-main" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Repo
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.instagram.com/shubham.x003/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal animation="blur" delay={300}>
          <div className="mt-12 pt-8 border-t border-border/40 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} ResumeBuilder. All rights reserved.
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default Footer;
