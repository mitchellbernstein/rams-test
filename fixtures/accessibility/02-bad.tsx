const posts = [
  { slug: "quiet-software", title: "Quiet software", summary: "Why we removed half the notifications in our app." },
  { slug: "pricing-in-public", title: "Pricing in public", summary: "What happened when we published every price we charge." },
];

export default function AboutPage() {
  return (
    <main className="bg-surface text-ink">
      <style>{`
        button, a, [role="button"] { touch-action: manipulation; }
        .glass { background: rgb(255 255 255 / 0.72); backdrop-filter: blur(16px); }
        @keyframes flash { 50% { opacity: 0; } }
        .hiring-badge { animation: flash 0.15s steps(1) 6; }
      `}</style>

      <section className="relative">
        <video src="/media/studio.mp4" autoPlay loop muted playsInline className="h-96 w-full object-cover">
          <track kind="captions" src="/media/studio.en.vtt" srcLang="en" label="English" default />
        </video>
        <div className="glass absolute inset-x-6 bottom-16 rounded-lg p-6">
          <span className="hiring-badge inline-block rounded-sm bg-brand px-2 py-1 text-sm font-medium text-brand-ink">Now hiring</span>
          <h1 className="relative mt-3 text-xl font-semibold">
            <span className="relative">We build tools for careful teams</span>
            <span className="absolute inset-0 -z-10 translate-x-0.5 translate-y-0.5 text-brand/20">We build tools for careful teams</span>
          </h1>
          <p className="mt-2 text-md">Acme is a twelve-person studio making planning software since 2019.</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-lg font-semibold">The team</h2>
        <img
          src="/team/offsite-2026.jpg"
          alt="offsite-2026.jpg"
          className="mt-6 w-full rounded-lg"
        />
        <p className="mt-4 text-md text-ink-muted">
          We meet in person twice a year. <a href="/blog/offsites" className="text-brand underline">Learn more</a>.
        </p>

        <h2 className="mt-16 text-lg font-semibold">Recent writing</h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <a href={`/blog/${post.slug}`} className="block rounded-lg border border-ink/10 p-6 hover:bg-surface-raised">
                <h3 className="text-md font-semibold">{post.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{post.summary}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
