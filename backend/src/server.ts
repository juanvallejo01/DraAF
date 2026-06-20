import { env } from './config/env';
import { conectarBaseDatos } from './config/database';
import { iniciarWorkerWhatsApp } from './workers/whatsapp.worker';
import app from './app';

const iniciarServidor = async (): Promise<void> => {
  await conectarBaseDatos();

  iniciarWorkerWhatsApp();

  const servidor = app.listen(env.puerto, () => {
    console.log(`🚀 Servidor DraAF escuchando en el puerto ${env.puerto}`);
    console.log(`📡 Entorno: ${env.entorno}`);
    console.log(`🌐 URL Frontend: ${env.frontendUrl}`);
  });

  const cerrarServidor = async (señal: string): Promise<void> => {
    console.log(`\n⚠️  Señal ${señal} recibida. Cerrando servidor...`);
    servidor.close(() => {
      console.log('✅ Servidor cerrado correctamente');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => cerrarServidor('SIGTERM'));
  process.on('SIGINT', () => cerrarServidor('SIGINT'));

  process.on('unhandledRejection', (razon: Error) => {
    console.error('❌ Promesa rechazada sin manejo:', razon);
    servidor.close(() => process.exit(1));
  });
};

iniciarServidor().catch((error) => {
  console.error('❌ Error al iniciar el servidor:', error);
  process.exit(1);
});
