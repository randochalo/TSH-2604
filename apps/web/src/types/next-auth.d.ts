> **⚠️ IMPORTANT:** This is a reference type declaration file for NextAuth.
> It extends the default NextAuth types with custom user properties.

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string | null
      role: string
      permissions: string[]
      branchId: string
      branchName: string
      firstName: string
      lastName: string
    }
  }

  interface User {
    id: string
    role: string
    permissions: string[]
    branchId: string
    branchName: string
    firstName: string
    lastName: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    permissions: string[]
    branchId: string
    branchName: string
    firstName: string
    lastName: string
  }
}
