import { PageLayoutProps } from "quartz/layouts/types"

export default function Page({ page, children }: PageLayoutProps) {
  const isHome = page.path === "/index" || page.path === "/"
  return (
    <>
      {/* only render title if not homepage */}
      {!isHome && <h1>{page.title}</h1>}
      {children}
    </>
  )
}
