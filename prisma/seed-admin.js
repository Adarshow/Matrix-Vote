const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("Starting admin seed...")

  // Create default admin user
  const adminEmail = "admin@matrixvote.com"
  const adminPassword = "admin123" // Change this in production!

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log("Admin user already exists!")
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    },
  })

  console.log("Admin user created successfully!")
  console.log("Email:", adminEmail)
  console.log("Password:", adminPassword)
  console.log("IMPORTANT: Please change the password after first login!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
