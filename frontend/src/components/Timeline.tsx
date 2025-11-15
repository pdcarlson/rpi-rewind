// src/components/Timeline.tsx
import { useEffect, useRef } from "react";
import type { Models } from "appwrite";
import type { EventDocument } from "../appwrite";
import { TimelineEvent } from "./TimelineEvent";

interface TimelineProps {
  events: Models.Document[];
}

export function Timeline({ events }: TimelineProps) {
  // this ref will hold a reference to our intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null);

  // this ref will hold references to every single event card dom element
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  // this state will track the currently visible era
  const currentEraRef = useRef<string | null>(null);

  // this is the core "time-shift" logic
  useEffect(() => {
    // what to do when an event card is 'intersected'
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // an event card is on screen
          const target = entry.target as HTMLElement;
          const era = target.dataset.era; // read the 'data-era' attribute

          if (era && era !== currentEraRef.current) {
            // this is a *new* era, so update the body
            console.log(`--- timeshift active: ${era} ---`);

            // remove old era class if it exists
            if (currentEraRef.current) {
              document.body.classList.remove(currentEraRef.current);
            }

            // add the new one and update our ref
            document.body.classList.add(era);
            currentEraRef.current = era;
          }
        }
      });
    };

    // create one observer
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // fire when 50% of the card is visible
    });

    // attach the observer to every event card that has a ref
    eventRefs.current.forEach((ref) => {
      if (ref) {
        observerRef.current?.observe(ref);
      }
    });

    // cleanup function: disconnect the observer when the component unmounts
    return () => {
      observerRef.current?.disconnect();
    };
  }, [events]); // re-run if the events list changes

  return (
    <div className="container mx-auto max-w-3xl py-12">
      {events.map((event, index) => (
        <TimelineEvent
          key={event.$id}
          event={event as unknown as EventDocument}
          // add the dom element to our array of refs
          ref={(el) => {
            eventRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
}
