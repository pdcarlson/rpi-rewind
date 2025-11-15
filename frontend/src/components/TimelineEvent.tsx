import { forwardRef } from "react";
import type { EventDocument } from "../appwrite";

// import our new component-specific styles
import "./TimelineEvent.css";

interface TimelineEventProps {
  event: EventDocument;
  side: "left" | "right";
}

export const TimelineEvent = forwardRef<HTMLDivElement, TimelineEventProps>(
  ({ event, side }, ref) => {
    // logic to dynamically set the correct classes
    const cardClasses = [
      "timeline-event-card",
      side === "left"
        ? "timeline-event-card-left"
        : "timeline-event-card-right",
    ].join(" ");

    const arrowClasses = [
      "timeline-event-arrow",
      side === "left"
        ? "timeline-event-arrow-left"
        : "timeline-event-arrow-right",
    ].join(" ");

    return (
      <div ref={ref} data-era={`era-${event.era}`} className={cardClasses}>
        {/* the arrow */}
        <div className={arrowClasses}></div>

        {/* main content */}
        <div className="timeline-event-content">
          <img
            src={event.image_url}
            alt={event.title}
            className="timeline-event-image"
          />
          <div>
            <span className="timeline-event-year">{event.year}</span>
            <h2 className="timeline-event-title">{event.title}</h2>
            <p className="timeline-event-description">{event.description}</p>
          </div>
        </div>
      </div>
    );
  }
);
