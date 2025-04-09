import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="border-t">
      <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          Ready to implement AI in your educational institution?
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Join leading schools and districts who trust EducAIt to create responsible AI policies and enhance learning experiences.
        </p>
        <Button size="lg" className="mt-4" asChild>
          <Link href="/policy-generator">
            Create Your AI Policy
          </Link>
        </Button>
      </div>
    </section>
  )
}
