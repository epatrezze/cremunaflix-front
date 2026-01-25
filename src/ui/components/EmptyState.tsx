interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Empty state helper for lists and sections without data.
 */
const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => (
  <div className="empty-state">
    <h3 className="empty-state-title">{title}</h3>
    <p className="empty-state-description">{description}</p>
    {actionLabel && (
      <button className="button-ghost empty-state-action" onClick={onAction} type="button">
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
