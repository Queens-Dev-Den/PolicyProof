import { SignUp, SignIn } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  const [showSignUp, setShowSignUp] = useState(true);

  // Intercept footer action clicks and switch components locally
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Check if the clicked element or its parent is a link in the footer
      const link = target.closest('a');
      if (link && link.textContent) {
        const text = link.textContent.toLowerCase();
        if (text.includes('sign in') || text.includes('sign up')) {
          e.preventDefault();
          e.stopPropagation();
          if (text.includes('sign in')) {
            setShowSignUp(false);
          } else if (text.includes('sign up')) {
            setShowSignUp(true);
          }
        }
      }
    };

    // Use capture phase to intercept before Clerk handles it
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative flex items-center justify-center px-4">
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

      {/* Logo in top left - hidden on small screens to prevent overlap */}
      <Link to="/">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-6 left-6 z-20 hidden md:flex items-center gap-2.5"
        >
          <img src="/PolicyProofLogo.png" alt="PolicyProof" className="w-8 h-8" />
          <span className="text-base font-semibold text-foreground">PolicyProof</span>
        </motion.div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full max-w-md relative z-10 py-8"
      >
        {/* Auth Component */}
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
      </motion.div>
    </div>
  );
}
