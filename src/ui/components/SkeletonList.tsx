interface SkeletonListProps {
  count?: number;
  containerClassName?: string;
  itemClassName?: string;
}

/**
 * Reusable skeleton list for stacked layouts.
 */
const SkeletonList = ({
  count = 4,
  containerClassName = 'list-group',
  itemClassName = 'session-card'
}: SkeletonListProps) => (
  <div className={containerClassName}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={`skeleton-list-${index}`} className={`${itemClassName} skeleton`}>
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </div>
    ))}
  </div>
);

export default SkeletonList;
