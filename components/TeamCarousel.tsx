'use client'

import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const teamMembers = [
  {
    name: "Yash Maheshwari",
    title: "Humble IT Guy",
    image: "/profiles/yashmaheshwari.jpeg"
  },
  {
    name: "Luke Stephenson",
    title: "Sheep",
    image: "/profiles/lukestephenson.png"
  },
  {
    name: "Yash Maheshwari",
    title: "GOAT",
    image: "/profiles/yashmaheshwari.jpeg"
  },
  {
    name: "Yash Maheshwari",
    title: "GOAT",
    image: "/profiles/yashmaheshwari.jpeg"
  },
  {
    name: "Yash Maheshwari",
    title: "GOAT",
    image: "/profiles/yashmaheshwari.jpeg"
  },
  {
    name: "Yash Maheshwari",
    title: "GOAT",
    image: "/profiles/yashmaheshwari.jpeg"
  },
  {
    name: "Yash Maheshwari",
    title: "GOAT",
    image: "/profiles/yashmaheshwari.jpeg"
  },
  {
    name: "Yash Maheshwari",
    title: "GOAT",
    image: "/profiles/yashmaheshwari.jpeg"
  },
  {
    name: "Yash Maheshwari",
    title: "GOAT",
    image: "/profiles/yashmaheshwari.jpeg"
  },
  {
    name: "Yash Maheshwari",
    title: "GOAT",
    image: "/profiles/yashmaheshwari.jpeg"
  }
]

export default function TeamCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: true,
    skipSnaps: false,
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
        
        <div className="relative">
          {/* Left gradient overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          
          {/* Right gradient overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex-[0_0_300px] min-w-0 relative mx-4"
                >
                  <div className="bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="aspect-square relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-xl font-semibold">{member.name}</h3>
                      <p className="text-muted-foreground">{member.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="absolute left-8 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-background/90 transition-colors z-20"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            className="absolute right-8 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-background/90 transition-colors z-20"
            onClick={scrollNext}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
} 