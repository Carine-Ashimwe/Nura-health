import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const email = "demo.chw@nura.rw";

const location = {
  province: "Kigali",
  district: "Gasabo",
  sector: "Kimironko",
  cell: "Bibare",
  village: "Inyange",
  reportingFacility: "Kimironko Health Centre",
};

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  await prisma.user.update({ where: { email }, data: location });
  console.log("Demo user updated with location:", email);
} else {
  await prisma.user.create({
    data: {
      fullName: "Demo Community Health Worker",
      email,
      ...location,
      passwordHash: await bcrypt.hash("Demo@12345", 10),
    },
  });
  console.log("Seeded demo user:", email, "/ Demo@12345");
}

await prisma.$disconnect();
