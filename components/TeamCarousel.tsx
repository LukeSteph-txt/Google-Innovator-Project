'use client'

import { useCallback, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const teamMembers = [
  {
    name: "Yash Maheshwari",
    title: "Title",
    image: "/profiles/yashmaheshwari.jpeg",
    bio: "Yash is a passionate technologist with expertise in AI and machine learning. He has been working on educational technology solutions for over 5 years and is dedicated to making learning more accessible and engaging for students worldwide."
  },
  {
    name: "Luke Stephenson",
    title: "Title",
    image: "/profiles/luke_stephenson_squareforweb.png",
    bio: "Luke is a software developer with a background in web technologies. He specializes in creating intuitive user interfaces and has a keen interest in educational software that helps students learn more effectively."
  },
  {
    name: "Yash Maheshwari",
    title: "Title",
    image: "/profiles/yashmaheshwari.jpeg",
    bio: "Yash is a passionate technologist with expertise in AI and machine learning. He has been working on educational technology solutions for over 5 years and is dedicated to making learning more accessible and engaging for students worldwide."
  },
  {
    name: "Yash Maheshwari",
    title: "Title",
    image: "/profiles/yashmaheshwari.jpeg",
    bio: "Yash is a passionate technologist with expertise in AI and machine learning. He has been working on educational technology solutions for over 5 years and is dedicated to making learning more accessible and engaging for students worldwide."
  },
  {
    name: "Yash Maheshwari",
    title: "Title",
    image: "/profiles/yashmaheshwari.jpeg",
    bio: "Yash is a passionate technologist with expertise in AI and machine learning. He has been working on educational technology solutions for over 5 years and is dedicated to making learning more accessible and engaging for students worldwide."
  },
  {
    name: "Yash Maheshwari",
    title: "Title",
    image: "/profiles/yashmaheshwari.jpeg",
    bio: "Yash is a passionate technologist with expertise in AI and machine learning. He has been working on educational technology solutions for over 5 years and is dedicated to making learning more accessible and engaging for students worldwide."
  },
  {
    name: "Yash Maheshwari",
    title: "Title",
    image: "/profiles/yashmaheshwari.jpeg",
    bio: "Yash is a passionate technologist with expertise in AI and machine learning. He has been working on educational technology solutions for over 5 years and is dedicated to making learning more accessible and engaging for students worldwide."
  },
  {
    name: "Yash Maheshwari",
    title: "Title",
    image: "/profiles/yashmaheshwari.jpeg",
    bio: "Yash is a passionate technologist with expertise in AI and machine learning. He has been working on educational technology solutions for over 5 years and is dedicated to making learning more accessible and engaging for students worldwide."
  }
]

export default function TeamCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: true,
    skipSnaps: false,
  })
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const openMemberPopup = (member: typeof teamMembers[0]) => {
    setSelectedMember(member)
  }

  const closeMemberPopup = () => {
    setSelectedMember(null)
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
        
        <div className="relative py-8">
          {/* Left gradient overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          
          {/* Right gradient overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex-[0_0_300px] min-w-0 relative mx-4 my-4"
                >
                  <div 
                    className="bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                    onClick={() => openMemberPopup(member)}
                  >
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

      {/* Member Bio Popup */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full overflow-hidden animate-fade-in">
            <div className="relative">
              <button 
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow-lg hover:bg-background/90 transition-colors z-10"
                onClick={closeMemberPopup}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-video relative">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-1">{selectedMember.name}</h3>
                <p className="text-muted-foreground mb-4">{selectedMember.title}</p>
                <p className="text-foreground leading-relaxed">{selectedMember.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
} 