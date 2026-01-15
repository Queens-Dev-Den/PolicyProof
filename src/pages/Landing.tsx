import { FileSearch, Sparkles, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";

export default function Landing() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();

  // Redirect to dashboard if user is signed in
  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show nothing while loading to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/PolicyProofLogo.png" alt="PolicyProof" className="w-14 h-14" />
          <h1 className="text-4xl font-bold text-foreground">PolicyProof</h1>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            AI-Powered Policy Compliance Analysis
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8">
            Upload your policy documents and get instant compliance analysis against
            15+ regulatory frameworks including GDPR, HIPAA, SOC 2, and more.
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/authentication")}
            className="text-lg px-8"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-foreground mb-12">
            Why Choose PolicyProof?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4">
                <FileSearch className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2 text-lg">Document Analysis</h4>
              <p className="text-muted-foreground">
                Upload PDF documents and receive detailed compliance findings with exact
                page references and policy violations.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2 text-lg">AI-Powered Insights</h4>
              <p className="text-muted-foreground">
                Leveraging AWS Bedrock Claude AI to identify violations and compliant
                sections with detailed explanations.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2 text-lg">Multi-Framework Support</h4>
              <p className="text-muted-foreground">
                Select from 15 compliance frameworks including GDPR, CCPA, HIPAA, ISO 27001,
                PCI DSS, NIST, and more.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Instant Analysis:</span> Get compliance reports in minutes, not hours
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Page-Level Precision:</span> Exact quotes and page numbers for every finding
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Re-analyze Anytime:</span> Change frameworks and re-run analysis instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
