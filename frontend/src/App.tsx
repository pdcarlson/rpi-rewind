// src/App.tsx
import { useEffect, useState } from "react";
import { appwrite } from "./appwrite";
import { Timeline } from "./components/Timeline";
import type { Models } from "appwrite";

function App() {
  const [events, setEvents] = useState<Models.Document[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await appwrite.databases.listDocuments(
          appwrite.databaseId,
          appwrite.collectionId
        );

        // sort the events by year, oldest to newest
        const sortedEvents = response.documents.sort(
          (a, b) => (a.year as number) - (b.year as number)
        );

        setEvents(sortedEvents);
      } catch (e: any) {
        console.error("failed to fetch appwrite data", e);
        setError(e.message);
      }
    };

    fetchData();
  }, []);

  // render an error message
  if (error) {
    return (
      <div className="bg-red-900 text-white min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="font-mono bg-red-700 p-4 rounded">{error}</p>
        </div>
      </div>
    );
  }

  // render a loading state
  if (events === null) {
    return (
      <div className="bg-gray-900 text-cyan-400 min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold animate-pulse">
          loading timeline...
        </h1>
      </div>
    );
  }

  // --- success: render the timeline ---
  return (
    <div className="bg-gray-900 min-h-screen">
      <Timeline events={events} />
    </div>
  );
}

export default App;
