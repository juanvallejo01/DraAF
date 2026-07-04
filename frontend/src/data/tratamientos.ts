export interface TratamientoEstatico {
  nombre: string;
  categoria: string;
}

export const CATEGORIAS = [
  'Todos',
  'Facial',
  'Rejuvenecimiento',
  'Corporal & Láser',
  'Especialidad',
  'Capilar',
  'Glúteos',
  'Vaginal',
  'Faloplastia',
] as const;

export const TRATAMIENTOS_ESTATICOS: TratamientoEstatico[] = [
  // Facial
  { nombre: 'Armonización Facial', categoria: 'Facial' },
  { nombre: 'Rinomodelación', categoria: 'Facial' },
  { nombre: 'Perfilamiento Mandibular', categoria: 'Facial' },
  { nombre: 'Relleno y perfilamiento de labios', categoria: 'Facial' },
  { nombre: 'Full Face', categoria: 'Facial' },
  { nombre: 'Tensamax', categoria: 'Facial' },
  { nombre: 'Botox (toxina botulínica) facial, bruxismo, hiperhidrosis axilar y migraña', categoria: 'Facial' },
  { nombre: 'Exosomas y PDRN de salmón', categoria: 'Facial' },
  { nombre: 'Skinbooster', categoria: 'Facial' },
  { nombre: 'Hilos tensores y de colágeno PDO', categoria: 'Facial' },

  // Rejuvenecimiento
  { nombre: 'Bioestimuladores de colágeno', categoria: 'Rejuvenecimiento' },
  { nombre: 'Plasma rico en plaquetas (PRP)', categoria: 'Rejuvenecimiento' },
  { nombre: 'Peeling químico', categoria: 'Rejuvenecimiento' },
  { nombre: 'Dermapen con nutrición avanzada', categoria: 'Rejuvenecimiento' },
  { nombre: 'Mesoterapia capilar con PRP y nutrición avanzada', categoria: 'Rejuvenecimiento' },

  // Corporal & Láser
  { nombre: 'Depilación Láser 4D Vellux — para todo fototipo de piel (I–VI)', categoria: 'Corporal & Láser' },
  { nombre: 'Láser CO2 fraccionado — retiro de lesiones', categoria: 'Corporal & Láser' },
  { nombre: 'Endolaser / Endolifting Corporal', categoria: 'Corporal & Láser' },
  { nombre: 'Lipopapada con enzimas', categoria: 'Corporal & Láser' },
  { nombre: 'Escleroterapia', categoria: 'Corporal & Láser' },
  { nombre: 'Tensamax', categoria: 'Corporal & Láser' },
  { nombre: 'Enzimas recombinantes liporeductoras', categoria: 'Corporal & Láser' },
  { nombre: 'Manejo de estrías y cicatrices', categoria: 'Corporal & Láser' },
  { nombre: 'Hilos tensores y de colágeno PDO', categoria: 'Corporal & Láser' },

  // Especialidad
  { nombre: 'Sueroterapia', categoria: 'Especialidad' },
  { nombre: 'Manejo del dolor articular con PRP (por ortopedista)', categoria: 'Especialidad' },
  { nombre: 'Asesoría Quirúrgica', categoria: 'Especialidad' },

  // Capilar
  { nombre: 'Mesoterapia capilar con plasma rico en plaquetas', categoria: 'Capilar' },
  { nombre: 'Exosomas capilares', categoria: 'Capilar' },

  // Glúteos
  { nombre: 'Aumento de glúteos con ácido hialurónico', categoria: 'Glúteos' },
  { nombre: 'Rejuvenecimiento con bioestimuladores de colágeno', categoria: 'Glúteos' },
  { nombre: 'Hilos de colágeno', categoria: 'Glúteos' },
  { nombre: 'Peptonas', categoria: 'Glúteos' },
  { nombre: 'Vitamina C', categoria: 'Glúteos' },
  { nombre: 'Músculo estriado', categoria: 'Glúteos' },

  // Vaginal
  { nombre: 'Rejuvenecimiento con láser CO2', categoria: 'Vaginal' },
  { nombre: 'Manejo incontinencia urinaria leve a moderada con láser CO2', categoria: 'Vaginal' },
  { nombre: 'Síntomas menopáusicos con láser CO2', categoria: 'Vaginal' },
  { nombre: 'Resequedad vaginal y disminución de la libido con láser CO2', categoria: 'Vaginal' },

  // Faloplastia
  { nombre: 'Engrosamiento de pene con ácido hialurónico', categoria: 'Faloplastia' },
];
