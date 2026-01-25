import SkeletonCard from './SkeletonCard';

interface SkeletonGridProps {
  count?: number;
}

/**
 * Reusable skeleton grid for card layouts.
 */
const SkeletonGrid = ({ count = 8 }: SkeletonGridProps) => (
  <div className="grid">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={`skeleton-grid-${index}`} />
    ))}
  </div>
);

export default SkeletonGrid;
