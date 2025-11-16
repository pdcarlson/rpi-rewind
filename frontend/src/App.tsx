// frontend/src/App.tsx
import { useEffect, useState, useRef, forwardRef } from "react";
import { appwrite, type AppwriteEvent } from "./appwrite";
import { Timeline } from "./components/Timeline";
import { Query } from "appwrite";

// --- theme imports ---
import "./themes/1820s.css";
import "./themes/1920s.css";
import "./themes/mid-century.css";
import "./themes/retro-groovy.css";
import "./themes/1980s.css";
// ---------------------

// (HeroSection is correct and unchanged)
const HeroSection = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      className="flex h-screen flex-col items-center justify-center text-center"
    >
      <div
        className="hero-card-themed relative rounded-lg bg-gray-800 bg-opacity-50 
                   p-12 shadow-2xl transition-colors duration-700"
      >
        <h1 className="hero-text-themed text-6xl font-bold">
          The Epoch Timeline
        </h1>
        <p className="hero-text-themed mt-4 text-2xl text-gray-300">
          a time-shifting rpi archive
        </p>
        <p className="hero-text-themed mt-8 max-w-2xl text-lg">
          scroll down to begin your journey...
        </p>
      </div>
      <div className="scroll-arrow-themed absolute bottom-10 animate-bounce text-gray-400">
        <svg
          className="h-10 w-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7v-18"
          />
        </svg>
      </div>
    </div>
  );
});

// --- new epochminimap component ---
function EpochMinimap({ scrollPercent }: { scrollPercent: number }) {
  // calculate the left position, but cap it at 98%
  // so the puck doesn't fly off the end of the bar
  const puckPosition = Math.min(scrollPercent, 98.5);

  return (
    <div
      className="minimap-themed sticky top-16 z-40 w-full bg-gray-800 
                 py-3 shadow-md transition-colors duration-700"
    >
      {/* main container for bar and labels */}
      <div className="relative mx-auto max-w-7xl px-4">
        {/* labels */}
        <div className="minimap-themed flex w-full justify-between pb-1 font-sans text-xs font-bold text-gray-400">
          <span>1824</span>
          <span>2024</span>
        </div>

        {/* the "heat map" track */}
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          {/* these colors are from our tailwind.config.js */}
          <div className="flex-1 bg-bw-accent" />
          <div className="flex-1 bg-sepia-accent" />
          <div className="flex-1 bg-mid-accent-1" />
          <div className="flex-1 bg-retro-accent1" />
          <div className="flex-1 bg-terminal-green" />
          <div className="flex-1 bg-red-600" />
        </div>

        {/* the "you are here" puck */}
        <div
          className="absolute top-6 -mt-0.5 h-5 w-1.5 -translate-x-1/2 
                     rounded-full bg-white ring-2 ring-red-600
                     transition-all duration-100 ease-linear"
          // we use inline style to set the 'left' percentage
          style={{ left: `${puckPosition}%` }}
        >
          {/* this is the caret on top of the puck */}
          <div
            className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 
                       border-x-4 border-x-transparent border-b-4 border-b-white"
          />
        </div>
      </div>
    </div>
  );
}
// ------------------------------------

function App() {
  const [events, setEvents] = useState<AppwriteEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentEra, setCurrentEra] = useState<string | null>(null);
  const lastEraRef = useRef<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // --- new state for scroll percentage ---
  const [scrollPercent, setScrollPercent] = useState(0);
  // ---------------------------------------

  // (data fetching logic is correct and unchanged)
  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching all documents...");
      let allDocuments: AppwriteEvent[] = [];
      let offset = 0;
      const limit = 100;
      let total = 0;
      try {
        do {
          const response =
            await appwrite.databases.listDocuments<AppwriteEvent>(
              appwrite.databaseId,
              appwrite.collectionId,
              [Query.limit(limit), Query.offset(offset)]
            );
          if (response.documents.length > 0) {
            allDocuments = [...allDocuments, ...response.documents];
          }
          total = response.total;
          offset += limit;
        } while (allDocuments.length < total);
        console.log(
          `successfully fetched ${allDocuments.length} total events.`
        );
        const sortedEvents = allDocuments.sort((a, b) => a.year - b.year);
        setEvents(sortedEvents);
      } catch (e: any) {
        console.error("failed to fetch appwrite data", e);
        setError(e.message);
      }
    };
    fetchData();
  }, []);

  // --- new effect for scroll calculation ---
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;

      // prevent division by zero
      if (scrollHeight - clientHeight === 0) {
        setScrollPercent(0);
        return;
      }

      const percent = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollPercent(percent);
    };

    // add listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    // remove on cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // -----------------------------------------

  // (hero observer logic is correct and unchanged)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setCurrentEra(null);
        }
      },
      { root: null, threshold: 0.5 }
    );
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // (theme application logic is correct and unchanged)
  useEffect(() => {
    if (lastEraRef.current) {
      document.body.classList.remove(lastEraRef.current);
    }
    if (currentEra) {
      console.log(`--- applying theme: ${currentEra} ---`);
      document.body.classList.add(currentEra);
    } else {
      console.log(`--- resetting theme ---`);
    }
    lastEraRef.current = currentEra;
  }, [currentEra]);

  // (error/loading states are correct and unchanged)
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-100">
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-red-800">Error</h1>
          <p className="mt-2 text-gray-700">{error}</p>
        </div>
      </div>
    );
  }
  if (events === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <h1 className="animate-pulse text-3xl font-bold text-gray-400">
          loading timeline...
        </h1>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-sans text-gray-100 bg-gray-900
                 transition-all duration-700 ease-in-out"
    >
      <header
        className="header-themed sticky top-0 z-50 w-full bg-gray-900 
                   bg-opacity-80 shadow-lg backdrop-blur-md 
                   transition-colors duration-700"
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="header-text-themed text-3xl font-bold">
            The Epoch Timeline
          </h1>
          <p className="header-text-themed text-lg text-gray-300">
            a time-shifting rpi archive
          </p>
        </div>
      </header>

      {/* pass the new state as a prop */}
      <EpochMinimap scrollPercent={scrollPercent} />

      <HeroSection ref={heroRef} />

      <main className="mx-auto max-w-7xl p-4">
        <Timeline events={events} onEraChange={setCurrentEra} />
      </main>

      <ScrollToTopButton />
    </div>
  );
}

// (ScrollToTopButton is correct and unchanged)
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-button-themed fixed bottom-6 right-6 z-50 h-12 w-12 
                  rounded-full bg-red-600 text-white shadow-lg 
                  transition-all duration-300
                  ${isVisible ? "opacity-100" : "opacity-0"}
                  hover:bg-red-700 focus:outline-none focus:ring-2 
                  focus:ring-red-500`}
    >
      <svg
        className="mx-auto h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
}

export default App;
