import { connectMongo, closeMongo } from './database/mongoClient'
import { prisma } from './database/prismaClient'
import { redis } from './database/redisClient'
import {
  criarUsuario, criarJogo, inicializarUsuarioRanking,
  registrarPalpite, fecharJogo, exibirPainel
} from './services/bolaoService'

async function main() {
  console.log('Iniciando simulação do bolão da copa 2026...\n')

  await connectMongo()

  // 1. Criar usuários e jogo no MySQL
  const carlos = await criarUsuario('Carlos', 'carlos@email.com')
  const ana = await criarUsuario('Ana', 'ana@email.com')

  // Jogo no passado para liberar palpite na simulação
  const horarioPassado = new Date(Date.now() - 1000 * 60 * 60 * 3)
  const jogo = await criarJogo('Brasil', 'Croácia', horarioPassado)

  console.log('[ORM] Usuários e jogos inseridos com sucesso.')

  // Inicializar ranking no Redis
  await inicializarUsuarioRanking(carlos.name)
  await inicializarUsuarioRanking(ana.name)

  // 2. Registrar palpites (forçando horário passado — apenas para simulação)
  await registrarPalpite(carlos.id, carlos.name, jogo.id, 'Brasil x Croácia', 1, 0)
  await registrarPalpite(ana.id, ana.name, jogo.id, 'Brasil x Croácia', 2, 0)

  // 3. Encerrar jogo com resultado oficial
  await fecharJogo(jogo.id, 'Brasil x Croácia', 2, 0)

  // 4. Exibir painel
  await exibirPainel()

  console.log('\nSimulação concluída com sucesso. Conexões encerradas.')

  await prisma.$disconnect()
  await redis.quit()
  await closeMongo()
}

main().catch(console.error)