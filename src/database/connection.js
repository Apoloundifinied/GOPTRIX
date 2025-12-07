import mongoose from 'mongoose';

export async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/goptrix');
        console.log('✅ Database conectado com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar no database:', error);
        return false;
    }
}

export async function disconnectDatabase() {
    try {
        await mongoose.disconnect();
        console.log('✅ Database desconectado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao desconectar database:', error);
    }
}
