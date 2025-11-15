// frontend/src/components/Timeline.tsx
import { useEffect, useRef } from "react";
import type { AppwriteEvent, EventDocument } from "../appwrite";
import { TimelineEvent } from "./TimelineEvent";

// --- cleanup ---
// no more css import
// -----------------

interface TimelineProps {
  events: AppwriteEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentEraRef = useRef<string | null>(null);

  useEffect(() => {
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const era = target.dataset.era; // e.g., "era-1980s"

          if (era && era !== currentEraRef.current) {
            console.log(`--- timeshift active: ${era} ---`);

            // remove old era class
            if (currentEraRef.current) {
              document.body.classList.remove(currentEraRef.current);
            }

            // add the new one
            document.body.classList.add(era);
            currentEraRef.current = era;

            // --- todo: add audio logic here ---
            // if (era === 'era-1980s') playSound('boot.mp3');
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // triggers in the middle 20%
      threshold: 0,
    });

    eventRefs.current.forEach((ref) => {
      if (ref) {
        observerRef.current?.observe(ref);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [events]);

  return (
    // this is our main timeline container
    <div className="relative w-full">
      {/* the central timeline line */}
      <div className="absolute left-1/2 top-0 -ml-px h-full w-0.5 bg-gray-600" />

      {/* list of events */}
      <div className="relative flex flex-col gap-12">
        {events.map((event, index) => (
          <TimelineEvent
            key={event.$id}
            event={event as EventDocument}
            side={index % 2 === 0 ? "left" : "right"}
            ref={(el) => {
              eventRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}
