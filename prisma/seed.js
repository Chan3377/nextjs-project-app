const { PrismaClient } = require("@prisma/client");
const data = require("./mock-data-01.json");
const prisma = new PrismaClient();

async function main() {
  const clerkId = "user_2jGc2w97xBNE4Jzaxbr8hYSzdCY";
  const projects = data.map((project) => {
    return {
      ...project,
      clerkId,
    };
  });
  for (const project of projects) {
    await prisma.project.create({
      data: project,
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
