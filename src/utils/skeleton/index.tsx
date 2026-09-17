/**
 * Builds placeholder rows for a Skeleton-loading grid/list by cloning a
 * template entity with a unique `id`, replacing repeated
 * `Array.from({ length }, () => ({ ...TEMPLATE, id: Math.random() }))` blocks.
 */
export function createSkeletonPlaceholders<TElement extends { id: number | string }>(
    template: TElement,
    count: number
): TElement[] {
    return Array.from({ length: count }, () => ({ ...template, id: Math.random() }));
}
