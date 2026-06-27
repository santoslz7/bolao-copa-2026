import { MongoClient, Db } from 'mongodb'

const client = new MongoClient('mongodb://localhost:27017')
let db: Db

export async function connectMongo() {
  await client.connect()
  db = client.db('bolao_copa')
}

export function getMongo() {
  return db
}

export async function closeMongo() {
  await client.close()
}