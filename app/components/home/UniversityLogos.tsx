import Image from 'next/image'

const universities = [
  { name: 'UCL School of Pharmacy', src: '/universities/ucl.png' },
  { name: 'University of Manchester', src: '/universities/manchester.png' },
  { name: 'University of Nottingham', src: '/universities/nottingham.png' },
  { name: 'King\'s College London', src: '/universities/kcl.png' },
  { name: 'University of Bath', src: '/universities/bath.png' },
  { name: 'Cardiff University', src: '/universities/cardiff.png' },
  { name: 'University of Brighton', src: '/universities/brighton.png' },
  { name: 'Queen\'s University Belfast', src: '/universities/belfast.png' },
  { name: 'Keele University', src: '/universities/keele.png' },
]

export default function UniversityLogos() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 sm:gap-x-12 sm:gap-y-8">
      {universities.map((uni) => (
        <Image
          key={uni.name}
          src={uni.src}
          alt={uni.name}
          width={100}
          height={40}
          className="h-6 sm:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
        />
      ))}
    </div>
  )
}
