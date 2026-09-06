// Testimonial photos/audio are stored as base64 data URIs in Mongo. Embedding
// them directly in server-rendered HTML means every visitor downloads every
// testimonial's image up front, and the browser has no real network resource
// to lazy-load or cache — a data: URI is already "downloaded" as part of the
// page itself.
//
// Swapping the data URI for a URL into our own media route turns each image
// back into an ordinary HTTP resource: the browser can defer it with
// `loading="lazy"`, cache it across page loads, and the page's own HTML no
// longer carries the raw bytes. Values that are already a real URL (http(s),
// e.g. a YouTube embed or a hosted recording) pass through unchanged.
export function toMediaUrl(id, field, value, updatedAt) {
  if (!value || typeof value !== 'string' || !value.startsWith('data:')) {
    return value || '';
  }

  // Appending the testimonial's updatedAt as a version busts the long-lived
  // Cache-Control on the media route whenever an admin re-uploads the image.
  const version = updatedAt ? new Date(updatedAt).getTime() : 0;
  return `/api/testimonials/${id}/media/${field}?v=${version}`;
}
