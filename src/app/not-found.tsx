import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="section" tabIndex={-1}>
      <div className="narrow-shell empty-state">
        <span className="kicker">404</span>
        <h1>That profile is not in the catalog</h1>
        <p>The project may have moved or the URL may be incomplete.</p>
        <Link className="primary-button" href="/catalog/"><ArrowLeft size={16} /> Return to catalog</Link>
      </div>
    </main>
  );
}
