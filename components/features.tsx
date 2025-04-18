import { Brain, Shield } from "lucide-react"

const features = [
  {
    name: "AI Policy Pathway",
    description: "Create comprehensive, customized AI policies for your school or district that cover implementation guidelines, privacy protection, and ethical usage standards.",
    icon: Brain,
  },
  {
    name: "Safe AI Implementation",
    description: "Get guidance on implementing AI tools safely in your educational institution, ensuring student privacy and data security while maximizing learning benefits.",
    icon: Shield,
  },
]

export default function Features() {
  return (
    <section className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Educational AI Solutions</h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Discover how AI Policy Pathway can transform your educational institution with our innovative AI tools and policies.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.name} className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
