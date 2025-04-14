import { config } from 'dotenv'
import program from '../utils/process.js'
import { MongoSingleton } from '../utils/mongoSingleton.js'
import path from 'path'
import fs from 'fs'

const { mode } = program.opts()
console.log(`🔧 Modo: ${mode}`)

const envPath = path.resolve(process.cwd(), mode === 'production' ? '.env.production' : '.env.developer')

if (!fs.existsSync(envPath)) {
  console.warn(`⚠️ No se encontró el archivo .env para el modo "${mode}". Usando variables del entorno por defecto.`)
} else {
  console.log(`✅ Usando variables de entorno desde: ${envPath}`)
}

config({ path: envPath })

const configObject = {
  port: process.env.PORT || 8080,
  privateKey: process.env.PRIVATE_KEY,
  mongo_url: process.env.MONGO_URL,
  adminCode: process.env.ADMIN_SECRET,
  persistence: process.env.PERSISTENCE,
}

if (!configObject.mongo_url) {
  console.error('❌ MONGO_URL no está definido en el archivo .env')
  process.exit(1)
}

const connectDB = () => {
  return MongoSingleton.getInstance(configObject.mongo_url)
}

export { connectDB, configObject }
