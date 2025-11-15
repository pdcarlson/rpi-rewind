import { useEffect, useState } from "react";
// import our new "master" type
import { appwrite, type AppwriteEvent } from "./appwrite";
import { Timeline } from "./components/Timeline";
import { Query } from "appwrite";

// import our component css
import "./App.css";

// import our themes
import "./themes/1980s.css";

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

  // render an error message
  if (error) {
    return (
      <div className="app-error-container">
        <div className="app-error-content">
          <h1 className="app-error-title">Error</h1>
          <p className="app-error-message">{error}</p>
        </div>
      </div>
    );
  }

  // render a loading state
  if (events === null) {
    return (
      <div className="app-loading-container">
        <h1 className="app-loading-title">loading timeline...</h1>
      </div>
    );
  }

  // --- success: render the timeline ---
  return (
    <div className="app-container">
      {/* this header now has 'relative' and 'z-10' from the css
        which fixes the timeline bar bug.
      */}
      <header className="app-header">
        <h1 className="app-header-title">The Epoch Timeline</h1>
        <p className="app-header-subtitle">a time-shifting rpi archive</p>
      </header>
      <main>
        <Timeline events={events} />
      </main>
    </div>
  );
}

export default App;
