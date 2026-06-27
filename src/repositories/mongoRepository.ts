import { getMongo } from '../database/mongoClient'

export async function registrarEvento(tipo: string, descricao: string, extra?: object) {
  const col = getMongo().collection('feed')
  await col.insertOne({
    tipo,
    descricao,
    timestamp: new Date(),
    ...extra
  })
  console.log(`[MongoDB] Evento registrado: "${descricao}"`)
}

export async function getUltimosEventos(limite = 5) {
  const col = getMongo().collection('feed')
  return col.find({}).sort({ timestamp: -1 }).limit(limite).toArray()
}