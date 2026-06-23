type EventCategorySource = {
  category?: string | null;
  type?: string | null;
};

export function getEventCategory(event: EventCategorySource): string {
  if (event.category) return event.category;
  if (event.type && !["In-person", "Online"].includes(event.type)) {
    return event.type;
  }
  return "Event";
}
