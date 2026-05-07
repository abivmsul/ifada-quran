import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
 await prisma.user.create({
  data: {
    fullName: "Admin",
    email: "admin@example.com",
    phone: "0000000000",
    role: "ADMIN",
    status: "ACTIVE",
    authUserId: "9c53ef16-7c4c-443e-b430-07b378069e5c"
  }
})
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });