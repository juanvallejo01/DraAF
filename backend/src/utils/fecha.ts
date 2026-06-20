const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export const formatearFecha = (fecha: Date): string => {
  const dia = fecha.getDate();
  const mes = MESES[fecha.getMonth()];
  const anio = fecha.getFullYear();
  return `${dia} de ${mes} de ${anio}`;
};

export const formatearHora = (hora: string): string => {
  const [horas, minutos] = hora.split(':').map(Number);
  const periodo = horas >= 12 ? 'p. m.' : 'a. m.';
  const horas12 = horas % 12 || 12;
  return `${horas12}:${String(minutos).padStart(2, '0')} ${periodo}`;
};
