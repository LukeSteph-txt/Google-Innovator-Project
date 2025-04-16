import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Linkedin } from "lucide-react"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative flex h-14 items-center px-4 md:px-6 lg:px-8">
        <div className="absolute left-4 md:left-6 lg:left-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">AI Policy Pathway</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center justify-center space-x-6 text-sm font-medium mx-auto">
          <Link href="/#solutions" className="transition-colors hover:text-primary">
            Solutions
          </Link>
          <Link href="/#team" className="transition-colors hover:text-primary">
            Meet the Team
          </Link>
          <Link href="/#about-us" className="transition-colors hover:text-primary">
            About Us
          </Link>
        </nav>
        
        <div className="absolute right-4 md:right-6 lg:right-8 flex items-center space-x-4">
          <Link href="https://www.linkedin.com/company/mvhs-principal-s-tech-internship" target="_blank" rel="noreferrer">
            <Button variant="ghost" size="icon">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm">Contact</Button>
          <Link href="/policy-generator"><Button size="sm">Generate Now</Button></Link>
        </div>
      </div>
    </header>
  )
}
