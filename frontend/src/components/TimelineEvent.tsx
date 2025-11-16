// frontend/src/components/TimelineEvent.tsx
import { forwardRef } from "react";
import type { EventDocument } from "../appwrite";

interface TimelineEventProps {
  event: EventDocument;
  side: "left" | "right";
}

export const TimelineEvent = forwardRef<HTMLDivElement, TimelineEventProps>(
  ({ event, side }, ref) => {
    const Card = () => (
      <div
        className="event-card-themed w-full overflow-hidden rounded-lg bg-gray-800 
                   shadow-xl transition-all duration-300 
                   hover:shadow-2xl hover:scale-105"
      >
        <img
          src={event.image_url}
          alt={event.title}
          className="h-48 w-full object-cover"
        />
        <div className="p-4">
          <span className="event-year-themed text-sm font-semibold text-red-400">
            {event.year}
          </span>
          <h2 className="event-text-themed text-xl font-bold text-white">
            {event.title}
          </h2>
          <p className="event-text-themed mt-1 text-gray-300">
            {event.description}
          </p>
        </div>
      </div>
    );

    return (
      <div ref={ref} data-era={`era-${event.era}`} className="relative">
        <div
          className="event-dot-themed absolute left-1/2 top-1/2 z-10 h-4 w-4 
                     -translate-x-1/2 -translate-y-1/2 rounded-full 
                     bg-red-500 transition-colors duration-700"
        />
        <div
          className={`flex items-center ${
            side === "left" ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <div className="w-5/12">
            <Card />
          </div>
          <div className="w-7/12 px-8">{/* empty spacer */}</div>
        </div>
      </div>
    );
  }
);
