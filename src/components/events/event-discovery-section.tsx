
import type { Event } from '@/types';
import { EventCard } from './event-card';
import { mockEvents } from '@/lib/mock-data'; // Import from new location

export function EventDiscoverySection() {
  return (
    <section className="py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
