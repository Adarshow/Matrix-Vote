const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing candidates
  await prisma.candidate.deleteMany()

  // Create two candidates
  const candidate1 = await prisma.candidate.create({
    data: {
      name: 'Adarsh P',
      image: 'https://unsplash.com/photos/a-man-in-a-suit-and-tie-posing-for-a-picture-aChQUTPMhkI',
      bio: 'A dedicated sophomore Computer Science student with a strong interest in software engineering and problem-solving. Adharsh is committed to leveraging technology to build impactful solutions for the student community.',
      linkedinUrl: 'https://linkedin.com/in/adarshpanakkattu',
    },
  })

  const candidate2 = await prisma.candidate.create({
    data: {
      name: 'Christo Joseph E',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'An enthusiastic first-year Computer Science student with a fresh perspective on digital innovation. Christo is passionate about web development and is eager to represent the voices of early-career engineers.',
      linkedinUrl: 'https://www.linkedin.com/in/christo-joseph-e-40abb3326/',
    },
  })

  console.log('Seeding completed successfully!')
  console.log('Created candidates:')
  console.log('- ', candidate1.name)
  console.log('- ', candidate2.name)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
