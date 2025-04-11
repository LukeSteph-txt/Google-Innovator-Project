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
            Building the future of education, one innovation at a time
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className="space-y-6 animate-slide-in-left"
          >
            <h3 className="text-2xl font-semibold">Our Journey</h3>
            <p className="text-muted-foreground leading-relaxed">
              Born from a passion for transforming education, our journey began with a simple yet powerful vision: to make learning more accessible, engaging, and effective for everyone. What started as a small team of innovators has grown into a community of educators, technologists, and dreamers.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Through countless hours of research, development, and collaboration with educators worldwide, we've created solutions that are reshaping how students learn and teachers teach.
            </p>
          </div>

          <div
            className="relative animate-slide-in-right"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8">
              <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10">
                <div className="p-6 space-y-4">
                  <h4 className="text-xl font-semibold">Our Mission</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500">✦</span>
                      <span className="text-muted-foreground">Empowering educators with innovative tools</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500">✦</span>
                      <span className="text-muted-foreground">Creating engaging learning experiences</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500">✦</span>
                      <span className="text-muted-foreground">Breaking down barriers to education</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500">✦</span>
                      <span className="text-muted-foreground">Fostering a community of lifelong learners</span>
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