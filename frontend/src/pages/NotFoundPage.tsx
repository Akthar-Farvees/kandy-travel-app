import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-24">
      <div className="max-w-xl rounded-[32px] border border-white/50 bg-white/80 p-10 text-center shadow-hover backdrop-blur-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass size={28} />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-primary">404</p>
        <h1 className="mt-3 text-4xl font-display font-bold text-secondary">
          This trail doesn&apos;t lead anywhere.
        </h1>
        <p className="mt-4 text-base text-text-muted">
          The page you&apos;re looking for isn&apos;t part of the Kandy travel experience. Let&apos;s head back to the curated route.
        </p>
        <Link to="/" className="inline-flex">
          <Button className="mt-8">Back to Home</Button>
        </Link>
      </div>
    </section>
  );
}
