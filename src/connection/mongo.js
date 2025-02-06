import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || 'Users'; 

if (!url) {
    console.error('MONGO_URI no está definida en las variables de entorno');
    process.exit(1);  
}

const connectionMongo = async () => {
    try {
        await mongoose.connect(url, { dbName });
        console.log('Base de datos conectada');
    } catch (e) {
        console.log('Error al conectarse a la base de datos:', e.message);
        process.exit(1);  
    }
};

export default connectionMongo;
