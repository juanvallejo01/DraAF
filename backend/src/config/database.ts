import mongoose from 'mongoose';
import { env } from './env';

export const conectarBaseDatos = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('✅ Conexión a MongoDB establecida correctamente');

    mongoose.connection.on('error', (error) => {
      console.error('❌ Error en la conexión a MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};
