export default function HealthBadge({ severity }) {
  let label = 'Healthy';

  if (severity >= 4) label = 'Critical';
  else if (severity >= 2) label = 'At Risk';

  return (
    <span>
      Health: {label}
    </span>
  );
}
