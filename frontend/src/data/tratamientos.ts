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
] as const;

export const TRATAMIENTOS_ESTATICOS: TratamientoEstatico[] = [
  // Facial
  { nombre: 'Armonización Facial', categoria: 'Facial' },
  { nombre: 'Rinomodelación', categoria: 'Facial' },
  { nombre: 'Perfilamiento Mandibular', categoria: 'Facial' },
  { nombre: 'Relleno y perfilamiento de labios', categoria: 'Facial' },
  { nombre: 'Full Face', categoria: 'Facial' },
  { nombre: 'Tensamax', categoria: 'Facial' },

  // Rejuvenecimiento
  { nombre: 'Bioestimuladores de colágeno', categoria: 'Rejuvenecimiento' },
  { nombre: 'Plasma rico en plaquetas (PRP)', categoria: 'Rejuvenecimiento' },
  { nombre: 'Peeling químico', categoria: 'Rejuvenecimiento' },
  { nombre: 'Dermapen con nutrición avanzada', categoria: 'Rejuvenecimiento' },
  { nombre: 'Mesoterapia capilar con PRP y nutrición avanzada', categoria: 'Rejuvenecimiento' },

  // Corporal & Láser
  { nombre: 'Depilación Láser 4D Vellux — para todo fototipo de piel (I–VI)', categoria: 'Corporal & Láser' },
  { nombre: 'Jornada de depilación láser diodo', categoria: 'Corporal & Láser' },
  { nombre: 'Láser CO2 fraccionado — retiro de lesiones', categoria: 'Corporal & Láser' },
  { nombre: 'Endolaser / Endolifting Corporal', categoria: 'Corporal & Láser' },
  { nombre: 'Lipopapada con enzimas', categoria: 'Corporal & Láser' },
  { nombre: 'Escleroterapia', categoria: 'Corporal & Láser' },

  // Especialidad
  { nombre: 'Sueroterapia', categoria: 'Especialidad' },
  { nombre: 'Manejo del dolor articular con PRP (por ortopedista)', categoria: 'Especialidad' },
  { nombre: 'Asesoría Quirúrgica', categoria: 'Especialidad' },
];
