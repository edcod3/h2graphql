const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
    await prisma.link.create({
        data: {
          desc: 'Check out my github page!',
          url: 'https://github.com/edcod3',
        },
      })
    const allLinks = await prisma.link.findMany()
    console.log(allLinks)
}

main()
    .catch(e => {throw e})
    .finally(async () => {
        await prisma.$disconnect()
    })