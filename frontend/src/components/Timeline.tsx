// frontend/src/components/Timeline.tsx
import { useEffect, useMemo, useRef } from "react";
import type { AppwriteEvent, EventDocument } from "../appwrite";
import { TimelineEvent } from "./TimelineEvent";

interface TimelineProps {
  events: AppwriteEvent[];
  // we just accept the setter function
  onEraChange: (era: string | null) => void;
}

type GroupedEvents = {
  [era: string]: AppwriteEvent[];
};

export function Timeline({ events, onEraChange }: TimelineProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const eraRefs = useRef<(HTMLDivElement | null)[]>([]);
  // --- all state and 'currentEraRef' are removed ---

  const { eventsByEra, eras } = useMemo(() => {
    // (grouping logic is correct and unchanged)
    const grouped: GroupedEvents = events.reduce((acc, event) => {
      const era = event.era || "unknown";
      if (!acc[era]) {
        acc[era] = [];
      }
      acc[era].push(event);
      return acc;
    }, {} as GroupedEvents);
    const orderedEras = Object.keys(grouped);
    return { eventsByEra: grouped, eras: orderedEras };
  }, [events]);

  useEffect(() => {
    // --- this is now the *only* observer logic ---
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        // when an era block is on screen
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const era = target.dataset.era; // e.g., "era-1920s"
          console.log(`--- observer sees: ${era} ---`);
          // just report it. don't do anything else. The 'era' will be 'undefined' if data-era is not set, so we convert it to 'null'.
          onEraChange(era || null);
        }
      });
    };
    // --------------------------------------------

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // 1px trigger line
      threshold: 0,
    });

    eraRefs.current.forEach((ref) => {
      if (ref) {
        observerRef.current?.observe(ref);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [eras, onEraChange]); // dependencies are clean

  // --- the 'reset' useEffect is gone ---

  let globalEventIndex = 0;

  return (
    <div className="relative w-full">
      <div className="absolute left-1/2 top-0 -ml-px h-full w-0.5 bg-gray-600" />
      <div className="relative flex flex-col">
        {eras.map((era, eraIndex) => (
          // (render logic is correct and unchanged)
          <div
            key={era}
            ref={(el) => {
              eraRefs.current[eraIndex] = el;
            }}
            data-era={`era-${era}`}
            className="flex flex-col gap-12 py-12"
          >
            {eventsByEra[era].map((event) => {
              const currentIndex = globalEventIndex++;
              return (
                <TimelineEvent
                  key={event.$id}
                  event={event as EventDocument}
                  side={currentIndex % 2 === 0 ? "left" : "right"}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
