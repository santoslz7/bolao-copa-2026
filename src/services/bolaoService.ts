import { criarUsuario, criarJogo, criarPalpite, encerrarJogo } from '../repositories/userRepository'
import { adicionarPontos, inicializarUsuarioRanking, getTopRanking } from '../repositories/redisRepository'
import { registrarEvento, getUltimosEventos } from '../repositories/mongoRepository'

export async function registrarPalpite(
  userId: number, userName: string,
  jogoId: number, jogoDesc: string,
  golsCasa: number, golsVisita: number
) {
  await criarPalpite(userId, jogoId, golsCasa, golsVisita, true) // true = simulação
  await registrarEvento('palpite', `${userName} fez um palpite no jogo ${jogoDesc} (Placar: ${golsCasa}x${golsVisita})`, {
    userId, jogoId, placar: `${golsCasa}x${golsVisita}`
  })
}

export async function fecharJogo(
  jogoId: number, jogoDesc: string,
  golsCasaOficial: number, golsVisitaOficial: number
) {
  console.log(`\n[Sistema] Jogo encerrado! Resultado oficial: ${jogoDesc} ${golsCasaOficial} x ${golsVisitaOficial}.`)

  const palpites = await encerrarJogo(jogoId, golsCasaOficial, golsVisitaOficial)

  for (const p of palpites) {
    const acertouPlacar = p.golsCasa === golsCasaOficial && p.golsVisita === golsVisitaOficial
    const pontos = acertouPlacar ? 50 : 0
    const user = await import('../database/prismaClient').then(m =>
      m.prisma.user.findUnique({ where: { id: p.userId } })
    )
    if (!user) continue

    await adicionarPontos(user.name, pontos)

    if (acertouPlacar) {
      await registrarEvento('conquista', `${user.name} acertou o placar em cheio e ganhou 50 pontos!`, {
        userId: user.id, pontos: 50
      })
    }
  }
}

export async function exibirPainel() {
  const rawRanking = await getTopRanking()
  console.log('\n[REDIS] --- TOP RANKING GLOBAL ---')
  for (let i = 0; i < rawRanking.length; i += 2) {
    const nome = rawRanking[i]
    const pts = rawRanking[i + 1]
    console.log(`${(i / 2) + 1}º Lugar: ${nome} - ${pts} pontos`)
  }

  const eventos = await getUltimosEventos(5)
  console.log('\n[MONGO] --- ULTIMAS ATIVIDADES DO FEED ---')
  for (const ev of eventos) {
    const hora = new Date(ev.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    console.log(`- [${hora}] ${ev.descricao}`)
  }
}

export { criarUsuario, criarJogo, inicializarUsuarioRanking }