interface BadgeProps {
  label: string;
}

const Badge = ({ label }: BadgeProps) => <span className="badge">{label}</span>;

export default Badge;
