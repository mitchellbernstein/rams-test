type Project = { id: string; name: string; href: string; coverUrl: string; coverAlt: string; updatedLabel: string };
type Stat = { id: string; label: string; value: string };
type Activity = { id: string; message: string; timeLabel: string };

const projects: Project[] = [
  { id: "1", name: "Acme Inc", href: "/projects/1", coverUrl: "/covers/1.png", coverAlt: "Acme Inc home page", updatedLabel: "Edited by John Doe" },
  { id: "2", name: "Globex", href: "/projects/2", coverUrl: "/covers/2.png", coverAlt: "Globex dashboard", updatedLabel: "Edited by Jane Smith" },
];

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/projects", label: "Projects" },
  { href: "/settings", label: "Settings" },
];

interface DashboardProps {
  stats: Stat[];
  activity: Activity[];
  buildMinutesLabel: string;
}

export default function Dashboard({ stats, activity, buildMinutesLabel }: DashboardProps) {
  return (
    <div className="flex min-h-screen bg-surface text-ink">
      <aside className="w-[347px] shrink-0 border-r border-ink/10 bg-surface-raised p-6">
        <p className="text-md font-semibold">Relay</p>
        <nav className="mt-8">
          <ul className="space-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <section className="mt-10 rounded-lg bg-surface/60 p-4 backdrop-blur-xl">
          <h2 className="text-sm font-semibold">Build minutes</h2>
          <p className="mt-1 text-sm text-ink-muted">{buildMinutesLabel}</p>
        </section>
      </aside>

      <main className="flex-1 p-8">
        <div className="divide-y divide-ink/10">
          <header>
            <h1 className="text-xl font-semibold">Overview</h1>
          </header>

          <ul className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <li key={stat.id} className="rounded-lg bg-surface-raised p-4 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-sm text-ink-muted">{stat.label}</p>
                <p className="mt-1 text-lg font-semibold">{stat.value}</p>
              </li>
            ))}
          </ul>

          <section>
            <h2 className="text-lg font-semibold">Projects</h2>
            {projects.length === 0 ? (
              <p className="mt-4 text-sm text-ink-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            ) : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {projects.map((project) => (
                  <li key={project.id} className="rounded-lg border border-ink/10 shadow-2xl">
                    <a href={project.href} className="block p-4">
                      <img src={project.coverUrl} alt={project.coverAlt} className="aspect-video w-full rounded-md object-cover" />
                      <h3 className="mt-3 text-md font-semibold">{project.name}</h3>
                      <p className="text-sm text-ink-muted">{project.updatedLabel}</p>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <div className="mt-4 rounded-lg border border-ink/10 p-4">
              <div className="rounded-lg border border-ink/10 bg-surface-raised p-4">
              <div className="rounded-md border border-ink/10 bg-surface p-4">
              <ul className="space-y-3">
                {activity.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 text-sm">
                    <img src="https://i.pravatar.cc/64" alt="" className="size-8 rounded-full" />
                    <span className="flex-1">{item.message}</span>
                    <span className="text-ink-muted">{item.timeLabel}</span>
                  </li>
                ))}
              </ul>
              </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
