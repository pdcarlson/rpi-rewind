// frontend/src/components/TimelineEvent.tsx
import { forwardRef } from "react";
import type { EventDocument } from "../appwrite";

interface TimelineEventProps {
  event: EventDocument;
  side: "left" | "right";
}

export const TimelineEvent = forwardRef<HTMLDivElement, TimelineEventProps>(
  ({ event, side }, ref) => {
    // --- this is our new "card" component ---
    const Card = () => (
      <div
        className="w-full overflow-hidden rounded-lg bg-gray-800 shadow-xl 
                   transition-all duration-300 hover:shadow-2xl hover:scale-105"
      >
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
    );

    // --- new "dot-and-line" layout ---
    return (
      // this ref div is now the container for the dot and card
      <div ref={ref} data-era={`era-${event.era}`} className="relative">
        {/* the dot on the timeline */}
        <div
          className="absolute left-1/2 top-1/2 z-10 h-4 w-4 -translate-x-1/2 
                     -translate-y-1/2 rounded-full bg-red-500"
        />

        {/* card container: positioned left or right */}
        <div
          className={`relative w-5/12 ${
            side === "left"
              ? "float-left mr-[calc(50%+2rem)]" // pushes to the left
              : "float-right ml-[calc(50%+2rem)]" // pushes to the right
          }`}
        >
          <Card />
        </div>
      </div>
    );
  }
);
