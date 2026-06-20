import { Link } from "react-router-dom";

/** Stride AI logo lockup, top-left on every screen. Links to the app home. */
export function Logo({ className = "h-40" }: { className?: string }) {
  return (
    <Link to="/leads" className="flex items-center">
      <img src="/assets/logo.jpg" alt="Stride AI" className={`${className} w-auto object-cover object-top`} />
    </Link>
  );
}
