export default function BuildTimesArticle() {
  return (
    <article className="mx-auto w-full px-6 py-16 text-ink">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">Engineering</p>
      <h1 className="mt-2 text-xl font-semibold leading-relaxed tracking-tight text-balance">
        How we cut preview build times in half
      </h1>
      <p className="mt-4 text-md text-pretty text-ink-muted">A look at the caching changes behind this month’s faster previews.</p>

      <h2 className="mt-12 text-lg font-semibold leading-snug text-balance">Where the time<br />was going</h2>
      <p className="mt-4 text-center text-pretty">
        Most builds spent their first minute reinstalling dependencies that hadn’t changed since the last commit. We started by timing each step on a sample of real projects, from small marketing sites to large monorepos.
      </p>
      <p className="mt-4">The install step was the largest share by far, so that’s where we began.</p>

      <h2 className="mt-12 text-lg font-semibold leading-snug">What we changed</h2>
      <p className="mt-4 text-justify text-pretty">
        We now restore the dependency cache before the install step runs, and only invalidate it when the lockfile changes. Everything else in the pipeline stays the same, so existing build settings keep working.
      </p>
      <p className="mt-4 text-pretty">
        Builds that used to take <span className="font-serif">four minutes</span> now finish in about two.
      </p>
      <blockquote className="mt-8 border-l-2 border-brand pl-4 text-pretty">
        "We noticed the difference on the first day," one early tester told us.
      </blockquote>
      <p className="mt-4 uppercase text-pretty">The new cache is on for every project, and there’s nothing to configure on your side.</p>
    </article>
  );
}
