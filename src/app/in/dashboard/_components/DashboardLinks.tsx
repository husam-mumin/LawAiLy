export function DashboardLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded transition-colors duration-200 text-sm font-medium"
    >
      {label}
    </a>
  );
}
