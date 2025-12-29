import prisma from "../lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
    },
  });

  const post = await prisma.post.create({
    data: {
      title: "Hello Prisma",
      content: "這是我用 Prisma Client 寫進去的第一筆資料",
      authorId: user.id,
    },
  });

  console.log("User:", user);
  console.log("Post:", post);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
