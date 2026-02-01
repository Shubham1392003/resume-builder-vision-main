import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import {
  Download,
  ArrowLeft,
} from "lucide-react";

const Preview = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("resumeId");

  if (!resumeId) {
    return (
      <Layout hideFooter>
        <div className="container py-20 text-center text-muted-foreground">
          Resume not found
        </div>
      </Layout>
    );
  }

  const pdfUrl = `http://localhost:5000/generate-pdf/${resumeId}`;

  return (
    <Layout hideFooter>
      <div className="container py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="shadow-lg">
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </Button>
          </a>
        </div>

        {/* Centered Resume Preview */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-elevated overflow-hidden border border-border/50">
            <iframe
              src={`${pdfUrl}?t=${Date.now()}`}
              title="Resume PDF"
              className="w-full h-[900px]"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Preview;
