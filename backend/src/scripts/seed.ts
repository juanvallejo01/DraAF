import { conectarBaseDatos } from '../config/database';
import { Usuario } from '../models/Usuario';
import { Tratamiento } from '../models/Tratamiento';
import { Configuracion } from '../models/Configuracion';

const PLANTILLA_WHATSAPP = `Hola, {{nombrePaciente}} 🌟

Tu cita ha sido *confirmada*. Estos son tus detalles:

🏥 *Tratamiento:* {{nombreTratamiento}}
📅 *Fecha:* {{fecha}}
🕐 *Hora:* {{hora}}

Te esperamos *15 minutos antes* para el proceso de ingreso.

📍 *Ubicación:*
{{direccion}}
{{enlaceGoogleMaps}}

Ante cualquier duda, responde este mensaje.
¡Hasta pronto!`;

const TRATAMIENTOS = [
  {
    nombre: 'Ácido Hialurónico',
    descripcion: 'Relleno facial con ácido hialurónico para restaurar el volumen perdido, suavizar líneas de expresión y dar hidratación profunda con resultados naturales y duraderos hasta 12-18 meses.',
    duracionMinutos: 45,
  },
  {
    nombre: 'Toxina Botulínica',
    descripcion: 'Aplicación de toxina botulínica para la reducción efectiva de arrugas dinámicas en frente, entrecejo y patas de gallo. Resultados elegantes y naturales visibles desde los 3-5 días.',
    duracionMinutos: 30,
  },
  {
    nombre: 'Bioestimulación con PRP',
    descripcion: 'Plasma Rico en Plaquetas extraído de tu propia sangre para estimular la producción de colágeno. Mejora la textura, firmeza y luminosidad de la piel de forma completamente natural.',
    duracionMinutos: 60,
  },
  {
    nombre: 'Mesoterapia Facial',
    descripcion: 'Microinyecciones de un cóctel de vitaminas, minerales y ácido hialurónico para un rejuvenecimiento profundo. Ideal para recuperar la luminosidad y combatir el envejecimiento cutáneo.',
    duracionMinutos: 60,
  },
  {
    nombre: 'Peeling Químico',
    descripcion: 'Renovación celular intensiva con ácidos de alta pureza para tratar manchas, cicatrices de acné, textura irregular y pérdida de luminosidad. Disponible en diferentes profundidades según la necesidad.',
    duracionMinutos: 45,
  },
  {
    nombre: 'Hilos Tensores',
    descripcion: 'Lifting no quirúrgico con hilos de polidioxanona (PDO) para reposicionar y tensar los tejidos faciales. Efecto lifting inmediato con estimulación de colágeno a largo plazo.',
    duracionMinutos: 90,
  },
  {
    nombre: 'Sculptra – Bioestimulador',
    descripcion: 'Tratamiento con ácido poli-L-láctico que estimula la producción natural de colágeno de forma progresiva. Ideal para recuperar los volúmenes faciales perdidos con el paso del tiempo.',
    duracionMinutos: 60,
  },
  {
    nombre: 'Diseño y Armonización Facial',
    descripcion: 'Evaluación y planificación integral del rostro combinando diferentes técnicas (ácido hialurónico, toxina, bioestimulación) para lograr una armonía facial personalizada y resultados equilibrados.',
    duracionMinutos: 120,
  },
];

const seed = async () => {
  await conectarBaseDatos();

  // Admin
  const adminExiste = await Usuario.findOne({ correoElectronico: 'admin@draaf.com' });
  if (!adminExiste) {
    await Usuario.create({
      nombreCompleto: 'Administrador DraAF',
      documentoIdentidad: '000000001',
      correoElectronico: 'admin@draaf.com',
      numeroWhatsApp: '+573000000000',
      contrasena: 'Admin123!',
      rol: 'ADMIN',
    });
    console.log('✅ Admin creado: admin@draaf.com / Admin123!');
  } else {
    console.log('ℹ️  Admin ya existe');
  }

  // Tratamientos
  let creados = 0;
  for (const t of TRATAMIENTOS) {
    const existe = await Tratamiento.findOne({ nombre: t.nombre });
    if (!existe) {
      await Tratamiento.create({ ...t, activo: true });
      creados++;
    }
  }
  console.log(`✅ Tratamientos: ${creados} creados, ${TRATAMIENTOS.length - creados} ya existían`);

  // Configuraciones
  const configs = [
    {
      clave: 'clinica_hora_apertura',
      valor: '08:00',
      descripcion: 'Hora de apertura de la clínica (formato HH:MM)',
    },
    {
      clave: 'clinica_hora_cierre',
      valor: '18:00',
      descripcion: 'Hora de cierre de la clínica (formato HH:MM)',
    },
    {
      clave: 'clinica_intervalo_slot',
      valor: '30',
      descripcion: 'Intervalo entre slots de citas en minutos (15, 30 o 60)',
    },
    {
      clave: 'clinica_dias_activos',
      valor: '1,2,3,4,5',
      descripcion: 'Días laborales (0=Dom, 1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie, 6=Sab)',
    },
    {
      clave: 'whatsapp_plantilla_mensaje',
      valor: PLANTILLA_WHATSAPP,
      descripcion: 'Plantilla del mensaje de confirmación de WhatsApp',
    },
    {
      clave: 'clinica_direccion',
      valor: 'Calle 10 #5-20, Cali, Colombia',
      descripcion: 'Dirección física de la clínica',
    },
    {
      clave: 'clinica_enlace_maps',
      valor: 'https://maps.google.com/',
      descripcion: 'Enlace de Google Maps de la clínica',
    },
    {
      clave: 'clinica_whatsapp_admin',
      valor: '',
      descripcion: 'Número WhatsApp del admin para recibir notificaciones de nuevas citas (+57...)',
    },
    {
      clave: 'clinica_horas_cancelacion',
      valor: '24',
      descripcion: 'Horas mínimas de antelación para cancelar una cita (0 = sin restricción)',
    },
    {
      clave: 'clinica_fechas_bloqueadas',
      valor: '[]',
      descripcion: 'Fechas bloqueadas para reservas en formato JSON ["YYYY-MM-DD"]',
    },
    {
      clave: 'clinica_horas_recordatorio',
      valor: '24',
      descripcion: 'Horas antes de la cita para enviar recordatorio por WhatsApp (0 = sin recordatorio)',
    },
  ];

  for (const config of configs) {
    await Configuracion.findOneAndUpdate(
      { clave: config.clave },
      config,
      { upsert: true, new: true }
    );
  }
  console.log('✅ Configuraciones listas');

  process.exit(0);
};

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
