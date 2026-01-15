import { SignUp, SignIn } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <img src="/PolicyProofLogo.png" alt="PolicyProof" className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-foreground">PolicyProof</h1>
        </Link>

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
      </div>
    </div>
  );
}
