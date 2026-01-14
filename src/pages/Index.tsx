import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { 
  FileText, 
  Target, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Zap,
  Shield,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Target,
      title: "Job-Targeted",
      description: "Automatically tailors your resume to match specific job descriptions and requirements."
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Leverages advanced AI to optimize keywords, formatting, and content for ATS systems."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate a professional, targeted resume in minutes, not hours."
    },
    {
      icon: Shield,
      title: "ATS Friendly",
      description: "Designed to pass Applicant Tracking Systems and reach human recruiters."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Fill Your Details",
      description: "Enter your experience, skills, and education in our intuitive form."
    },
    {
      number: "02",
      title: "Paste Job Description",
      description: "Copy and paste the job listing you're targeting."
    },
    {
      number: "03",
      title: "Get Your Resume",
      description: "Receive an AI-optimized resume tailored to that specific role."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-transparent pointer-events-none" />
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal animation="blur" delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 border border-border/50">
                <Sparkles className="h-4 w-4" />
                Resume Builder
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={150}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="text-gradient italic">Transform Your Career</span>
                <span className="block mt-2">Into Perfect Resumes</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={300}>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                The intelligent layer between you and your dream job. Compatible with all 
                major job boards and ATS systems.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="scale" delay={450}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/create-resume">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Build Your Resume
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={600}>
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Free to start
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  No credit card
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  ATS optimized
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <ScrollReveal animation="blur">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful Features
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to create the perfect resume for any job application
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal 
                key={feature.title} 
                animation={index % 2 === 0 ? "fade-left" : "fade-right"}
                delay={index * 150}
              >
                <div className="group p-6 rounded-2xl bg-card border border-border/50 hover-lift h-full">
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary group-hover:shadow-glow transition-all duration-500">
                    <feature.icon className="h-6 w-6 text-accent-foreground group-hover:text-primary-foreground transition-colors duration-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container">
          <ScrollReveal animation="rotate">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Three simple steps to create your perfect, job-targeted resume
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <ScrollReveal 
                key={step.number} 
                animation="fade-up" 
                delay={index * 200}
                duration={1000}
              >
                <div className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-4" />
                  )}
                  <div className="text-6xl font-bold text-primary/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <ScrollReveal animation="scale" duration={1200}>
            <div className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-accent to-primary/5 border border-primary/20">
              <ScrollReveal animation="blur" delay={200}>
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-primary shadow-glow flex items-center justify-center animate-float">
                    <FileText className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={400}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your Job Search?
                </h2>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={550}>
                <p className="text-muted-foreground text-lg mb-8">
                  Join thousands of job seekers who've landed interviews with AI-optimized resumes.
                </p>
              </ScrollReveal>
              <ScrollReveal animation="scale" delay={700}>
                <Link to="/create-resume">
                  <Button variant="hero" size="xl">
                    Start Building Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
