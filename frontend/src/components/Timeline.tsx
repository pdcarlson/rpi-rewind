// frontend/src/components/Timeline.tsx
import { useEffect, useRef } from "react";
import type { AppwriteEvent, EventDocument } from "../appwrite";
import { TimelineEvent } from "./TimelineEvent";

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
          const era = target.dataset.era;

          if (era && era !== currentEraRef.current) {
            console.log(`--- timeshift active: ${era} ---`);
            if (currentEraRef.current) {
              document.body.classList.remove(currentEraRef.current);
            }
            document.body.classList.add(era);
            currentEraRef.current = era;
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      // --- this is the "choppiness" fix ---
      // triggers at a 1px line exactly in the middle of the screen
      rootMargin: "-50% 0px -50% 0px",
      // ------------------------------------
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
    <div className="relative w-full">
      {/* the central timeline line */}
      {/* we add z-0 here so the "dots" can be z-10 and sit on top */}
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
