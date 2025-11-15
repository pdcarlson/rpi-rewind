// frontend/src/App.tsx
import { useEffect, useState } from "react";
// import our new "master" type
import { appwrite, type AppwriteEvent } from "./appwrite";
import { Timeline } from "./components/Timeline";
import { Query } from "appwrite";

// --- cleanup ---
// we no longer import any .css files here
// tailwind and index.css handle everything
// -----------------

// --- new component: minimap ---
// this will be our sticky "minimap"
function EpochMinimap() {
  // for now, it's just a styled placeholder
  // we'll add the logic in the next step
  return (
    <div className="sticky top-16 z-40 h-10 w-full bg-gray-800 shadow-md">
      <div className="mx-auto h-full max-w-7xl px-4">
        {/* placeholder text */}
        <p className="py-2 text-sm text-gray-400">
          [epoch minimap placeholder]
        </p>
      </div>
    </div>
  );
}
// -----------------------------

// --- new component: scroll to top ---
// this is our new "scroll to top" button
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // show the button when user scrolls down
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
    // cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-red-600 text-white shadow-lg transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}
        hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
    >
      {/* a simple "up arrow" icon */}
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
// ------------------------------------

function App() {
  // use our new type in the state
  const [events, setEvents] = useState<AppwriteEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching all documents...");
      let allDocuments: AppwriteEvent[] = [];
      let offset = 0;
      const limit = 100; // appwrite's max limit per request
      let total = 0;

      try {
        do {
          // use our master type as the generic for listdocuments
          const response =
            await appwrite.databases.listDocuments<AppwriteEvent>(
              appwrite.databaseId,
              appwrite.collectionId,
              [Query.limit(limit), Query.offset(offset)]
            );

          if (response.documents.length > 0) {
            allDocuments = [...allDocuments, ...response.documents];
          }

          total = response.total; // get the total count from the first response
          offset += limit; // increment our offset for the next page
        } while (allDocuments.length < total); // keep looping until we have them all

        console.log(
          `successfully fetched ${allDocuments.length} total events.`
        );

        // now this sort works perfectly, with no type errors
        const sortedEvents = allDocuments.sort((a, b) => a.year - b.year);

        setEvents(sortedEvents);
      } catch (e: any) {
        console.error("failed to fetch appwrite data", e);
        setError(e.message);
      }
    };

    fetchData();
  }, []); // the empty array [] means this effect runs only once

  // render an error message - now styled with tailwind
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

  // render a loading state - now styled with tailwind
  if (events === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <h1 className="animate-pulse text-3xl font-bold text-gray-400">
          loading timeline...
        </h1>
      </div>
    );
  }

  // --- success: render the timeline ---
  return (
    // this root div now handles all global styles, fixing the v4 bug
    <div
      className="min-h-screen 
                 font-sans text-gray-100 bg-gray-900
                 transition-all duration-700 ease-in-out
                 era-1980s:bg-black 
                 era-1980s:text-terminal-green
                 era-1980s:font-mono"
    >
      <header className="sticky top-0 z-50 w-full bg-gray-900 bg-opacity-80 shadow-lg backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-3xl font-bold">The Epoch Timeline</h1>
          <p className="text-lg text-gray-300">a time-shifting rpi archive</p>
        </div>
      </header>

      {/* here is our new minimap component */}
      <EpochMinimap />

      <main className="mx-auto max-w-7xl p-4">
        <Timeline events={events} />
      </main>

      {/* here is our new scroll-to-top button */}
      <ScrollToTopButton />
    </div>
  );
}

export default App;
