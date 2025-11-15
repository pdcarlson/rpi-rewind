import { useEffect, useRef } from "react";
// import our new master type
import type { AppwriteEvent, EventDocument } from "../appwrite";
import { TimelineEvent } from "./TimelineEvent";

// import our new component-specific styles
import "./Timeline.css";

interface TimelineProps {
  // we now expect an array of our master type
  events: AppwriteEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentEraRef = useRef<string | null>(null);

  // ... useEffect logic is unchanged ...
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
      // trigger when card is in the middle 40% of the screen
      rootMargin: "-30% 0px -30% 0px",
      threshold: 0.1, // needs at least 10% of the card to be visible
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
  }, [events]);

  return (
    <div className="timeline-container">
      {/* this line now has z-0 from the css */}
      <div className="timeline-line"></div>

      <div className="timeline-event-list">
        {events.map((event, index) => (
          <TimelineEvent
            key={event.$id}
            event={event as EventDocument} // 'event' is AppwriteEvent, we pass just the data
            // alternate left/right placement
            side={index % 2 === 0 ? "left" : "right"}
            // this is the fix: curly braces to make the return type 'void'
            ref={(el) => {
              eventRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}
