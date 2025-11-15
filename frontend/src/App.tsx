// frontend/src/App.tsx
import { useEffect, useState } from "react";
import { appwrite, type AppwriteEvent } from "./appwrite";
import { Timeline } from "./components/Timeline";
import { Query } from "appwrite";

// (EpochMinimap and ScrollToTopButton components are unchanged)
// ...

// --- new component: hero section ---
function HeroSection() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      {/* this div provides a "backdrop" for the retro themes,
          like a 1920s sepia filter, to apply to
      */}
      <div className="relative rounded-lg bg-gray-800 bg-opacity-50 p-12 shadow-2xl">
        <h1 className="text-6xl font-bold">The Epoch Timeline</h1>
        <p className="mt-4 text-2xl text-gray-300">
          a time-shifting rpi archive
        </p>
        <p className="mt-8 max-w-2xl text-lg">
          scroll down to begin your journey through 200 years of history. as you
          move through time, the site itself will transform to match the era you
          are viewing.
        </p>
      </div>

      {/* scroll down indicator */}
      <div className="absolute bottom-10 animate-bounce text-gray-400">
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
}
// ------------------------------------

function App() {
  const [events, setEvents] = useState<AppwriteEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // (useEffect data fetching is unchanged)
  // ...
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

  // (error and loading states are unchanged)
  // ...
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
      className="min-h-screen 
                 font-sans text-gray-100 bg-gray-900
                 transition-all duration-700 ease-in-out"
    >
      <header className="sticky top-0 z-50 w-full bg-gray-900 bg-opacity-80 shadow-lg backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-3xl font-bold">The Epoch Timeline</h1>
          <p className="text-lg text-gray-300">a time-shifting rpi archive</p>
        </div>
      </header>

      <EpochMinimap />

      {/* here is our new hero section! */}
      <HeroSection />

      <main className="mx-auto max-w-7xl p-4">
        <Timeline events={events} />
      </main>

      <ScrollToTopButton />
    </div>
  );
}

// (EpochMinimap and ScrollToTopButton components are unchanged)
// ...
function EpochMinimap() {
  return (
    <div className="sticky top-16 z-40 h-10 w-full bg-gray-800 shadow-md">
      <div className="mx-auto h-full max-w-7xl px-4">
        <p className="py-2 text-sm text-gray-400">
          [epoch minimap placeholder]
        </p>
      </div>
    </div>
  );
}
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
      className={`fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-red-600 text-white shadow-lg transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}
        hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
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
