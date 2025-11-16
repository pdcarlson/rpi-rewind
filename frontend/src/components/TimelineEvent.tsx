// frontend/src/components/TimelineEvent.tsx
import { forwardRef } from "react";
import type { EventDocument } from "../appwrite";

interface TimelineEventProps {
  event: EventDocument;
  side: "left" | "right";
}

export const TimelineEvent = forwardRef<HTMLDivElement, TimelineEventProps>(
  ({ event, side }, ref) => {
    const is1920s = event.era === "1920s";
    // ... add all other era flags as needed
    const is1980s = event.era === "1980s";
    const isRetro = event.era === "1960s" || event.era === "1970s";
    const isMidCentury =
      event.era === "1930s" || event.era === "1940s" || event.era === "1950s";
    const isBW =
      event.era === "1820s" ||
      event.era === "1850s" ||
      event.era === "1860s" ||
      event.era === "1870s" ||
      event.era === "1880s" ||
      event.era === "1890s" ||
      event.era === "1900s" ||
      event.era === "1910s";

    // helper to get the correct theme class for the *line*
    const getLineColor = () => {
      if (isBW) return "bg-bw-text";
      if (is1920s) return "bg-sepia-accent";
      if (isMidCentury) return "bg-mid-text";
      if (isRetro) return "bg-retro-text";
      if (is1980s) return "bg-terminal-green";
      return "bg-gray-600"; // default
    };

    const Card = () => (
      <div
        className={`event-card-themed w-full overflow-hidden rounded-lg bg-gray-800 
                   shadow-xl transition-all duration-300 
                   hover:shadow-2xl hover:scale-105`}
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
        {/* the dot on the timeline */}
        <div
          className={`event-dot-themed absolute left-1/2 top-1/2 z-10 h-4 w-4 
                     -translate-x-1/2 -translate-y-1/2 rounded-full 
                     bg-red-500 transition-colors duration-700`}
        />

        {/* --- new connecting line --- */}
        <div
          className={`absolute top-1/2 z-0 h-0.5 -translate-y-1/2
                     transition-colors duration-700
                     ${getLineColor()}
                     ${
                       side === "left"
                         ? "right-1/2 w-[calc(50%-8rem)]" // from center to card
                         : "left-1/2 w-[calc(50%-8rem)]" // from center to card
                     }`}
        />
        {/* ------------------------- */}

        <div
          className={`flex items-center ${
            side === "left" ? "flex-row" : "flex-row-reverse"
          }`}
        >
          {/* card is now 41.6% width */}
          <div className="w-5/12">
            <Card />
          </div>
          {/* spacer is now 58.3% width */}
          <div className="w-7/12">{/* empty spacer */}</div>
        </div>
      </div>
    );
  }
);
