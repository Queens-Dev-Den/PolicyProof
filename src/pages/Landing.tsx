import { ArrowRight, Shield, MessageSquare, FileText } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Logo in top left */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 z-20 flex items-center gap-2.5"
      >
        <img src="/PolicyProofLogo.png" alt="PolicyProof" className="w-8 h-8" />
        <span className="text-base font-semibold text-foreground">PolicyProof</span>
      </motion.div>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6">
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto pt-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Shield className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <span className="text-sm text-muted-foreground">Compliance made simple</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-semibold text-foreground mb-6 leading-tight tracking-tight">
              Policy compliance,{" "}
              <span className="text-primary">powered by AI</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Audit documents against 15+ regulatory frameworks instantly. 
              Get actionable insights with our intelligent assistant.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate("/authentication")}
                className="group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-20 pb-8 flex flex-wrap items-center justify-center gap-4"
          >
            <FeaturePill icon={FileText} text="Document Analysis" />
            <FeaturePill icon={Shield} text="15+ Frameworks" />
            <FeaturePill icon={MessageSquare} text="Live Assistant" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function FeaturePill({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border enterprise-shadow">
      <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
