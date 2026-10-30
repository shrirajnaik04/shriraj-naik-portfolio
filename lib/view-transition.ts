/**
 * Shared-element names for the cross-document view transition between a home-page spread and its
 * case study. The same name on both pages pairs the elements; each name must be unique per page.
 */
export function morphName(part: 'title' | 'figure', slug: string): string {
  return `${part}-${slug}`
}
