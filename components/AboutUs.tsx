'use client';

// Removing framer-motion import
// import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4">
        <div
          className="max-w-4xl mx-auto text-center mb-16 animate-fade-in"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            About Us
          </h2>
          <p className="text-lg text-muted-foreground">
            A Google Innovator Project empowering educational institutions to embrace Gen AI responsibly and effectively
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className="space-y-6 animate-slide-in-left"
          >
            <h3 className="text-2xl font-semibold">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              We are dedicated to helping educational institutions navigate the complex landscape of artificial intelligence in education. Our platform provides an editable sample policy that is designed to support school leaders and educators when navigating today's GenAI-enabled educational landscape.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Through our AI Policy Generator, we intend to empower schools and districts to establish clear guidelines for AI usage, protect student privacy, and maximize the educational benefits of AI while minimizing potential risks.
            </p>
          </div>

          <div
            className="relative animate-slide-in-right"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8">
              <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10">
                <div className="p-6 space-y-4">
                  <h4 className="text-xl font-semibold">Our Approach</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500">✦</span>
                      <span className="text-muted-foreground">Customized policy generation for your institution's needs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500">✦</span>
                      <span className="text-muted-foreground">Comprehensive coverage of research-based AI policy guidelines</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500">✦</span>
                      <span className="text-muted-foreground">Focus on privacy, security, and ethical AI use</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500">✦</span>
                      <span className="text-muted-foreground">Expand AI literacy among educators and students</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 