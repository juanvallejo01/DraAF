const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const formatearFecha = (fecha: string | Date): string => {
  const d = new Date(fecha);
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
};

export const formatearFechaCorta = (fecha: string | Date): string => {
  const d = new Date(fecha);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

export const formatearHora = (hora: string): string => {
  const [horas, minutos] = hora.split(':').map(Number);
  const periodo = horas >= 12 ? 'p. m.' : 'a. m.';
  const horas12 = horas % 12 || 12;
  return `${horas12}:${String(minutos).padStart(2, '0')} ${periodo}`;
};

export const obtenerDiaSemana = (fecha: string | Date): string => {
  return DIAS[new Date(fecha).getDay()];
};

export const fechaHoyISO = (): string => {
  return new Date().toISOString().split('T')[0];
};
