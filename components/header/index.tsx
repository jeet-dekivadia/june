import { NavbarLink, NavbarLinkBackground } from "./link"
import clsx from "clsx"

export function Header() {
  const navbarItems = [
    { href: "/", title: "Apply" },
    { href: "/manifesto", title: "Manifesto" },
  ]

  return (
    <div className="flex flex-col items-center justify-center">
      <nav className="bg-black/20 rounded-full border border-white/20">
        <div
          className={clsx(
            "bg-black/10 rounded-full p-1 flex relative items-center",
            "shadow-lg backdrop-blur-sm"
          )}
        >
          {/* Animated background */}
          <NavbarLinkBackground links={navbarItems.map((item) => item.href)} />

          {/* Navigation items */}
          {navbarItems.map(({ href, title }) => (
            <NavbarLink key={href} href={href}>
              {title}
            </NavbarLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
