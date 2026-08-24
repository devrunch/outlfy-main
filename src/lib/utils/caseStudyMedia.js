// Case study featured images / client logos are stored as base64 data URIs
// in Mongo (see MediaSchema in src/admin/models/CaseStudy.js). Embedding
// them directly in server-rendered HTML or JSON means every visitor
// downloads every image up front, and next/image can't optimize or
// lazy-load a data: URI — there's no real network request to defer.
//
// Swapping the data URI for a URL into our own media route turns each image
// back into an ordinary HTTP resource that next/image can actually
// optimize, lazy-load, and the browser can cache. Values that are already a
// real URL pass through unchanged.
export function toMediaUrl(id, field, value, updatedAt) {
  if (!value || typeof value !== 'string' || !value.startsWith('data:')) {
    return value || '';
  }

  const version = updatedAt ? new Date(updatedAt).getTime() : 0;
  return `/api/case-studies/${id}/media/${field}?v=${version}`;
}
