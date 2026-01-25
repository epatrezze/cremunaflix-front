/**
 * Props for Badge component.
 */
interface BadgeProps {
  label: string;
}

/**
 * Small status label used across cards and lists.
 *
 * @param props - Badge props.
 * @returns Badge element.
 */
const Badge = ({ label }: BadgeProps) => <span className="badge">{label}</span>;

export default Badge;
