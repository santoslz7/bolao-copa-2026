import { PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({
    data: [
      { name: 'Carlos', email: 'carlos@email.com' },
      { name: 'Ana', email: 'ana@email.com' },
    ]
  })

  await prisma.jogo.create({
    data: {
      timeCasa: 'Brasil',
      timeVisita: 'Croácia',
      horario: new Date('2026-07-10T15:00:00Z'),
    }
  })

  console.log('[Seed] Dados iniciais inseridos com sucesso.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())