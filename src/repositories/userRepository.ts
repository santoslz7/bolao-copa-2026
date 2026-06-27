import { prisma } from '../database/prismaClient'

export async function criarUsuario(name: string, email: string) {
  return prisma.user.create({ data: { name, email } })
}

export async function criarJogo(timeCasa: string, timeVisita: string, horario: Date) {
  return prisma.jogo.create({ data: { timeCasa, timeVisita, horario } })
}

export async function criarPalpite(
  userId: number, jogoId: number,
  golsCasa: number, golsVisita: number,
  ignorarHorario = false
) {
  if (!ignorarHorario) {
    const jogo = await prisma.jogo.findUnique({ where: { id: jogoId } })
    if (!jogo) throw new Error('Jogo não encontrado')
    if (new Date() >= jogo.horario) throw new Error('Prazo para palpite encerrado')
  }
  return prisma.palpite.create({ data: { userId, jogoId, golsCasa, golsVisita } })
}

export async function encerrarJogo(jogoId: number, golsCasa: number, golsVisita: number) {
  await prisma.jogo.update({
    where: { id: jogoId },
    data: { golsCasa, golsVisita }
  })
  return prisma.palpite.findMany({ where: { jogoId } })
}