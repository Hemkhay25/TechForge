"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="not-found" role="alert"><span className="section-kicker">Something went wrong</span><h1>We couldn’t load<br /><em>this page.</em></h1><p>Please try again. If this continues, the content service may need to be configured or restored.</p><button className="button" type="button" onClick={reset}>Try again <span aria-hidden="true">↻</span></button></section>;
}
