import { connectMongo, closeMongo, getMongo } from './database/mongoClient'
import { prisma } from './database/prismaClient'
import { redis } from './database/redisClient'
import {
  criarJogo, inicializarUsuarioRanking,
  registrarPalpite, fecharJogo, exibirPainel
} from './services/bolaoService'

async function main() {
  console.log('Iniciando simulação do bolão da copa 2026...\n')

  await connectMongo()

  await redis.flushall()
  await getMongo().collection('feed').deleteMany({})

  const carlos = await prisma.user.findUniqueOrThrow({ where: { email: 'carlos@email.com' } })
  const ana = await prisma.user.findUniqueOrThrow({ where: { email: 'ana@email.com' } })

  const horarioPassado = new Date(Date.now() - 1000 * 60 * 60 * 3)
  const jogo = await criarJogo('Brasil', 'Croácia', horarioPassado)

  console.log('[ORM] Usuários e jogos inseridos com sucesso.')

  await inicializarUsuarioRanking(carlos.name)
  await inicializarUsuarioRanking(ana.name)

  await registrarPalpite(carlos.id, carlos.name, jogo.id, 'Brasil x Croácia', 1, 0)
  await registrarPalpite(ana.id, ana.name, jogo.id, 'Brasil x Croácia', 2, 0)

  await fecharJogo(jogo.id, 'Brasil x Croácia', 2, 0)

  await exibirPainel()

  console.log('\nSimulação concluída com sucesso. Conexões encerradas.')

  await prisma.$disconnect()
  await redis.quit()
  await closeMongo()
}

main().catch(console.error)