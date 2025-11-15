// frontend/src/components/TimelineEvent.tsx
import { forwardRef } from "react";
import type { EventDocument } from "../appwrite";

// --- cleanup ---
// no more css import
// -----------------

interface TimelineEventProps {
  event: EventDocument;
  side: "left" | "right";
}

export const TimelineEvent = forwardRef<HTMLDivElement, TimelineEventProps>(
  ({ event, side }, ref) => {
    // define the container classes based on 'side'
    const containerClasses = [
      "relative flex w-full",
      side === "left" ? "justify-start" : "justify-end",
    ].join(" ");

    // define the card's position and arrow
    const cardPositionClasses = side === "left" ? "pr-8" : "pl-8";

    const arrowPositionClasses = side === "left" ? "right-0" : "left-0";

    return (
      // this outer div handles left/right placement
      <div ref={ref} data-era={`era-${event.era}`} className={containerClasses}>
        {/* this div is the card itself */}
        <div
          className={`relative w-1/2 rounded-lg bg-gray-800 shadow-xl 
                      transition-all duration-300 hover:shadow-2xl hover:scale-105
                      ${cardPositionClasses}`}
        >
          {/* the little arrow pointing to the timeline */}
          <div
            className={`absolute top-1/2 -mt-2 h-4 w-4 -translate-y-1/2 
                        rotate-45 transform bg-gray-800 
                        ${arrowPositionClasses}`}
          />

          {/* main content */}
          <div className="overflow-hidden rounded-lg">
            <img
              src={event.image_url}
              alt={event.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <span className="text-sm font-semibold text-red-400">
                {event.year}
              </span>
              <h2 className="text-xl font-bold text-white">{event.title}</h2>
              <p className="mt-1 text-gray-300">{event.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
