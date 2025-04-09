'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const teamMembers = [
  {
    name: "Team Member 1",
    title: "Role 1",
    image: "/team/member1.jpg"
  },
  {
    name: "Team Member 2",
    title: "Role 2",
    image: "/team/member2.jpg"
  },
  {
    name: "Team Member 3",
    title: "Role 3",
    image: "/team/member3.jpg"
  },
  {
    name: "Team Member 4",
    title: "Role 4",
    image: "/team/member4.jpg"
  },
  {
    name: "Team Member 5",
    title: "Role 5",
    image: "/team/member5.jpg"
  },
  {
    name: "Team Member 6",
    title: "Role 6",
    image: "/team/member6.jpg"
  },
  {
    name: "Team Member 7",
    title: "Role 7",
    image: "/team/member7.jpg"
  },
  {
    name: "Team Member 8",
    title: "Role 8",
    image: "/team/member8.jpg"
  }
]

export default function TeamCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: true,
    skipSnaps: false,
    dragFree: true,
    containScroll: 'trimSnaps',
  })

  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    
    // Start in the middle
    const middleIndex = Math.floor(teamMembers.length / 2)
    emblaApi.scrollTo(middleIndex)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onWheel = useCallback((event: WheelEvent) => {
    if (!emblaApi) return
    event.preventDefault()
    emblaApi.scrollTo(emblaApi.scrollProgress() + event.deltaY * 0.001)
  }, [emblaApi])

  useEffect(() => {
    const element = emblaRef.current
    if (!element) return

    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [emblaRef, onWheel])

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Background blur effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10" />
          
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex">
              {teamMembers.map((member, index) => {
                const distance = Math.abs(index - selectedIndex)
                const scale = distance <= 1 ? 1 : 1 - ((distance - 1) * 0.15)
                const opacity = distance <= 1 ? 1 : 1 - ((distance - 1) * 0.3)
                const blur = distance <= 1 ? 0 : (distance - 1) * 2
                const zIndex = distance <= 1 ? 20 : 10 - distance

                return (
                  <div
                    key={index}
                    className="flex-[0_0_320px] min-w-0 relative mx-4 transition-all duration-300"
                    style={{
                      transform: `scale(${scale})`,
                      opacity: opacity,
                      filter: `blur(${blur}px)`,
                      zIndex: zIndex,
                    }}
                  >
                    <div className="bg-card rounded-lg overflow-hidden shadow-xl transform transition-transform duration-300 hover:scale-105">
                      <div className="aspect-[4/3] relative">
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
                )
              })}
            </div>
          </div>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-background/90 transition-colors"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-background/90 transition-colors"
            onClick={scrollNext}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
} 