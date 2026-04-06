import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const TEACHER_EMAIL = process.env.TEACHER_EMAIL!
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD!

// Hash once at startup
const passwordHash = bcrypt.hashSync(TEACHER_PASSWORD, 10)

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        if (credentials.email !== TEACHER_EMAIL) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          passwordHash
        )
        if (!valid) return null

        return { id: "1", email: TEACHER_EMAIL, name: "Teacher" }
      },
    }),
  ],
})