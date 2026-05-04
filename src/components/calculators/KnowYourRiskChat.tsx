import { useEffect, useRef, useState } from "react";

// Declare global types for Tripetto
declare global {
  interface Window {
    TripettoStudio: {
      form: (config: {
        runner: unknown;
        token: string;
        element: string;
      }) => void;
    };
    TripettoChat: unknown;
  }
}

const KnowYourRiskChat = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptsLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent loading scripts multiple times
    if (scriptsLoadedRef.current) return;
    scriptsLoadedRef.current = true;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    const initTripetto = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load scripts in sequence
        await loadScript("https://cdn.jsdelivr.net/npm/@tripetto/runner");
        await loadScript("https://cdn.jsdelivr.net/npm/@tripetto/runner-chat");
        await loadScript("https://cdn.jsdelivr.net/npm/@tripetto/studio");

        // Small delay to ensure scripts are fully initialized
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Initialize Tripetto form
        const tripettoToken = import.meta.env.VITE_TRIPETTO_TOKEN;

        if (!tripettoToken) {
          throw new Error("Tripetto token not configured");
        }

        if (window.TripettoStudio && window.TripettoChat) {
          window.TripettoStudio.form({
            runner: window.TripettoChat,
            token: tripettoToken,
            element: "tripetto-risk-assessment",
          });
          setIsLoading(false);
        } else {
          throw new Error("Tripetto failed to initialize");
        }
      } catch (err) {
        setError("Failed to load the risk assessment chat. Please refresh the page.");
        setIsLoading(false);
      }
    };

    initTripetto();

    // Cleanup function
    return () => {
      // Tripetto doesn't require cleanup, but we reset the ref
      scriptsLoadedRef.current = false;
    };
  }, []);

  return (
    <div className="w-full">
      {/* Chat Container */}
      <div
        className="bg-transparent"
        style={{ minHeight: "500px" }}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-[500px] gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading Risk Assessment...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center h-[500px] gap-4 p-4">
            <p className="text-sm text-destructive text-center">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-primary hover:underline"
            >
              Refresh Page
            </button>
          </div>
        )}

        {/* Inner Transparent Container */}
        <div className={`bg-transparent rounded-lg p-4 md:p-6 ${isLoading || error ? "hidden" : ""}`}>
          {/* Tripetto Container */}
          <div
            id="tripetto-risk-assessment"
            ref={containerRef}
            style={{ minHeight: "500px", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default KnowYourRiskChat;
