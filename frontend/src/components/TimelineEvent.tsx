// src/components/TimelineEvent.tsx
import { forwardRef } from "react";
import type { EventDocument } from "../appwrite";

interface TimelineEventProps {
  event: EventDocument;
}

// forwardref allows this component to receive a ref from its parent
// which we need for the intersectionobserver to 'see' it
export const TimelineEvent = forwardRef<HTMLDivElement, TimelineEventProps>(
  ({ event }, ref) => {
    return (
      <div
        ref={ref}
        data-era={`era-${event.era}`} // this is the key for our "time-shift"
        className="timeline-event p-8 mb-8 bg-gray-800 border-l-4 border-cyan-400 rounded-lg min-h-[300px]"
      >
        {/* main content */}
        <div className="flex gap-8">
          {/* image */}
          <img
            src={event.image_url}
            alt={event.title}
            className="w-48 h-48 object-cover rounded-md shadow-lg"
          />
          {/* event details */}
          <div>
            <span className="text-sm font-bold text-cyan-400">
              {event.year}
            </span>
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <p className="text-gray-300">{event.description}</p>
          </div>
        </div>
      </div>
    );
  }
);
