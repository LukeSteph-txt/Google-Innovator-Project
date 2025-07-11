import Link from "next/link"
import { Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12">
        <div className="flex-1 space-y-4">
          <h2 className="font-bold">AI Policy Pathway</h2>
          <p className="text-sm text-muted-foreground">Empowering educators with AI tools and policies for the modern classroom.</p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-12 sm:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Solutions</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/policy-generator" className="text-muted-foreground transition-colors hover:text-primary">
                  AI Policy Generator
                </Link>
              </li>
              <li>
                <Link href="#solutions" className="text-muted-foreground transition-colors hover:text-primary">
                  Solutions
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#team" className="text-muted-foreground transition-colors hover:text-primary">
                  Meet the Team
                </Link>
              </li>
              <li>
                <Link href="#about-us" className="text-muted-foreground transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://www.linkedin.com/company/mvhs-principal-s-tech-internship/"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://www.instagram.com/mvhs.tech/"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container border-t py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Policy Pathway, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
