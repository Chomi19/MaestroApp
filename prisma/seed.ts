import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import * as dotenv from "dotenv"

dotenv.config()

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const pieces = [
    { title: "Für Elise", composer: "Beethoven", level: "intermediate", genre: "Classical" },
    { title: "Moonlight Sonata Op.27 No.2", composer: "Beethoven", level: "advanced", genre: "Classical" },
    { title: "Ode to Joy", composer: "Beethoven", level: "beginner", genre: "Classical" },
    { title: "Prelude in C Major", composer: "Bach", level: "intermediate", genre: "Baroque" },
    { title: "Minuet in G", composer: "Bach", level: "beginner", genre: "Baroque" },
    { title: "Invention No. 1", composer: "Bach", level: "intermediate", genre: "Baroque" },
    { title: "Clair de Lune", composer: "Debussy", level: "advanced", genre: "Impressionist" },
    { title: "Arabesque No. 1", composer: "Debussy", level: "intermediate", genre: "Impressionist" },
    { title: "Maple Leaf Rag", composer: "Joplin", level: "intermediate", genre: "Ragtime" },
    { title: "The Entertainer", composer: "Joplin", level: "intermediate", genre: "Ragtime" },
    { title: "Nocturne Op.9 No.2", composer: "Chopin", level: "advanced", genre: "Romantic" },
    { title: "Waltz Op.64 No.1", composer: "Chopin", level: "intermediate", genre: "Romantic" },
    { title: "Fantaisie Impromptu", composer: "Chopin", level: "advanced", genre: "Romantic" },
    { title: "Gymnopédie No. 1", composer: "Satie", level: "intermediate", genre: "Modern" },
    { title: "Mary Had a Little Lamb", composer: null, level: "beginner", genre: "Folk" },
    { title: "Twinkle Twinkle Little Star", composer: null, level: "beginner", genre: "Folk" },
    { title: "Happy Birthday", composer: null, level: "beginner", genre: "Folk" },
  ]

  const existing = await prisma.piece.count()
  if (existing > 0) {
    console.log(`Already seeded ${existing} pieces, skipping.`)
    return
  }

  await prisma.piece.createMany({ data: pieces })
  console.log(`Seeded ${pieces.length} pieces`)
}