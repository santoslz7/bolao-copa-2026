import { redis } from '../database/redisClient'

const RANKING_KEY = 'ranking:global'

export async function adicionarPontos(userName: string, pontos: number) {
  await redis.zincrby(RANKING_KEY, pontos, userName)
  console.log(`[Redis] Atualizando pontuações no ranking...`)
}

export async function inicializarUsuarioRanking(userName: string) {
  await redis.zadd(RANKING_KEY, 'NX', 0, userName)
}

export async function getTopRanking(top = 10) {
  return redis.zrevrange(RANKING_KEY, 0, top - 1, 'WITHSCORES')
}