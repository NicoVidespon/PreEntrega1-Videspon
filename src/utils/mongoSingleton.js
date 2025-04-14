import mongoose from 'mongoose';

class MongoSingleton {
  static #instance;

  constructor() {}

  static async getInstance(uri) {
    if (this.#instance) {
      console.log('🟡 Base de datos ya conectada');
      return this.#instance;
    }

    try {
      await mongoose.connect(uri, {
        dbName: process.env.MONGO_DB_NAME || 'test', 
      });

      this.#instance = new MongoSingleton();
      console.log(`🟢 Base de datos conectada exitosamente a "${process.env.MONGO_DB_NAME || 'test'}"`);

      return this.#instance;
    } catch (error) {
      console.error('❌ Error al conectar a MongoDB:', error.message);
      process.exit(1);
    }
  }
}

export { MongoSingleton };
