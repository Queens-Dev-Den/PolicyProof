import { SignIn, SignUp, SignedIn } from "@clerk/clerk-react";
import { Shield, FileSearch, Sparkles, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
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

          <SignedIn>
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="text-lg px-8"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </SignedIn>
        </div>

        {/* Auth Section */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-card border border-border rounded-lg shadow-lg p-6">
            <div className="flex gap-2 mb-6">
              <button
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  !showSignUp
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                onClick={() => setShowSignUp(false)}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  showSignUp
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                onClick={() => setShowSignUp(true)}
              >
                Sign Up
              </button>
            </div>

            <div className="flex items-center justify-center">
              {showSignUp ? (
                <SignUp
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none bg-transparent",
                      headerTitle: "text-foreground",
                      headerSubtitle: "text-muted-foreground",
                      socialButtonsBlockButton: "border-border hover:bg-accent",
                      formButtonPrimary: "bg-primary hover:bg-primary/90",
                      formFieldLabel: "text-foreground",
                      formFieldInput: "border-border bg-background text-foreground",
                      footerActionLink: "text-primary hover:text-primary/90",
                    },
                  }}
                  fallbackRedirectUrl="/dashboard"
                  forceRedirectUrl="/dashboard"
                />
              ) : (
                <SignIn
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none bg-transparent",
                      headerTitle: "text-foreground",
                      headerSubtitle: "text-muted-foreground",
                      socialButtonsBlockButton: "border-border hover:bg-accent",
                      formButtonPrimary: "bg-primary hover:bg-primary/90",
                      formFieldLabel: "text-foreground",
                      formFieldInput: "border-border bg-background text-foreground",
                      footerActionLink: "text-primary hover:text-primary/90",
                    },
                  }}
                  fallbackRedirectUrl="/dashboard"
                  forceRedirectUrl="/dashboard"
                />
              )}
            </div>
          </div>
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
