'use client'

import { useCallback, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const teamMembers = [
  {
    name: "Luke Stephenson",
    title: "Class of 2025",
    image: "/profiles/luke_stephenson_squareforweb.png",
    bio: "Luke is a software developer with a background in web technologies. He specializes in creating intuitive user interfaces and has a keen interest in educational software that helps students learn more effectively."
  },
  {
    name: "Yash Maheshwari",
    title: "Class of 2027",
    image: "/profiles/yashmaheshwari.jpeg",
    bio: "Yash is a passionate technologist with expertise in AI and machine learning. He has been working on improving education for years and is dedicated to making learning more accessible and engaging for students."
  },
  {
    name: "Claire Schwarzhoff",
    title: "Class of 2026",
    image: "/profiles/claireschwarzhoff.jpeg",
    bio: "Claire Schwarzhoff is a distinguished leader in AI literacy and policy implementation, with a strong foundation in computer science and machine learning. She is dedicated to advancing AI awareness and education, with a focus on promoting accessibility and fostering informed engagement across educational communities."
  },
  {
    name: "Kip Glazer",
    title: "Principal",
    image: "/profiles/kipglazer.jpg",
    bio: "Dr. Glazer is a proud principal of Mountain View High School. She is a Google Innovator interested in supporting students to work on meaningful technology projects that focus on the effective and ethical use of GenAI and AI-enabled tools."
  },
  {
    name: "Myra Jain",
    title: "Class of 2028",
    image: "/profiles/myrajain.jpg",
    bio: "Myra is a passionate student leader and advocate for equitable access to technology education. She is dedicated to promoting digital literacy and empowering students to make informed decisions about the responsible use of AI."
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

  const handlePopupClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop (not the popup content)
    if (e.target === e.currentTarget) {
      closeMemberPopup()
    }
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
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handlePopupClick}
        >
          <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto animate-fade-in my-4">
            <div className="relative">
              <button 
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow-lg hover:bg-background/90 transition-colors z-10"
                onClick={closeMemberPopup}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex justify-center">
                <div className="w-full max-w-md aspect-square relative max-h-[60vh] overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent z-10"></div>
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                </div>
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