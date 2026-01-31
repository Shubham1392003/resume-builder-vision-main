import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import {
  Download,
  Edit,
  Share2,
  CheckCircle2,
  Target,
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
  const matchScore = 92;

  return (
    <Layout hideFooter>
      <div className="container py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Target className="h-4 w-4 inline mr-1" />
              {matchScore}% Job Match
            </div>

            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* PDF */}
          <div className="lg:col-span-2 h-[900px] bg-white rounded-xl shadow">
            <iframe
              src={`${pdfUrl}?t=${Date.now()}`} // cache-buster
              title="Resume PDF"
              className="w-full h-full"
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 border rounded-xl">
              <h3 className="font-semibold mb-4">Job Match Analysis</h3>

              <div className="text-center text-3xl font-bold mb-4">
                {matchScore}%
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Skills aligned
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Experience level matched
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  ATS optimized
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Preview;
