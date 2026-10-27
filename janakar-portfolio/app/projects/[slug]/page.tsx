import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProjectIndex from '@/app/components/ProjectIndex'
import Footer from '@/app/components/Footer'
import { getProject, projects } from '@/app/data/projects'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Project' }
  return {
    title: `${project.title} | Janakar`,
    description: project.summary,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return (
    <div className="w-full min-h-screen flex flex-col relative">
      <main className="w-full h-max z-10">
        {/* benji.org article spec: 36.375rem column, Inter 14/20 @ 460 */}
        <div className="max-w-[36.375rem] mx-auto pt-20 px-4 pb-10 font-inter text-primary max-[768px]:pt-8 max-[768px]:px-6">
          <ProjectIndex project={project} />

          <article className="max-w-[70ch] text-[14px] font-[460] leading-5 tracking-[-0.09px]">
            <header className="flex flex-col gap-1 pb-2">
              <h1 className="m-0 text-[14px] font-medium leading-5 tracking-[-0.09px]">{project.title}</h1>
              <time className="text-[var(--muted-color)]">{project.date}</time>
            </header>

            <p className="m-0 pt-4">{project.summary}</p>

            {project.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-20">
                <h2 className="m-0 pt-4 text-[15px] font-crimson font-normal leading-normal tracking-[-0.13px] text-balance">
                  {section.title}
                </h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="m-0 pt-4">
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <footer className="flex flex-col gap-4 pt-12 text-[12px] leading-[1.2] tracking-[0.01px] text-[var(--muted-color)]">
              <p className="m-0 italic">
                x = (R + v cos(u/2)) cos u,&nbsp; y = (R + v cos(u/2)) sin u,&nbsp; z = v sin(u/2)
              </p>
              <p className="m-0">One surface, one edge — the Möbius strip behind this page.</p>
              <p className="m-0">
                <Link href="/#projects" className="text-[var(--muted-soft-color)] hover:text-[var(--body-color)] transition-colors">
                  ← All projects
                </Link>
              </p>
            </footer>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
