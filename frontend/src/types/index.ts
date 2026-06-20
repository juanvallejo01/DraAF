export type RolUsuario = 'ADMIN' | 'PACIENTE';

export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA' | 'NO_ASISTIO';

export interface Usuario {
  id: string;
  nombreCompleto: string;
  correoElectronico: string;
  numeroWhatsApp: string;
  rol: RolUsuario;
}

export interface Tratamiento {
  _id: string;
  nombre: string;
  descripcion: string;
  duracionMinutos: number;
  imagen?: string;
  activo: boolean;
}

export interface Cita {
  _id: string;
  paciente: Usuario & { documentoIdentidad: string };
  tratamiento: Tratamiento;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: EstadoCita;
  notasPaciente?: string;
  notasAdmin?: string;
  mensajeWhatsAppEnviado: boolean;
  creadoEn: string;
  historialEstados?: {
    estado: EstadoCita;
    fecha: string;
    notas?: string;
  }[];
}

export interface RespuestaAPI<T = unknown> {
  exito: boolean;
  mensaje: string;
  datos?: T;
  errores?: string[];
}

export interface RespuestaCitasPaginada {
  citas: Cita[];
  total: number;
  pagina: number;
  limite: number;
  paginas: number;
  hayMas: boolean;
}

export interface DisponibilidadResponse {
  fecha: string;
  tratamientoId: string;
  duracionMinutos: number;
  horariosDisponibles: string[];
  diasActivos?: number[];
  fechasBloqueadas?: string[];
}

export interface PoliticaCancelacion {
  horasMinimas: number;
}

export interface HorariosClinica {
  clinica_hora_apertura: string;
  clinica_hora_cierre: string;
  clinica_intervalo_slot: string;
  clinica_dias_activos: string;
}

export interface ResumenDia {
  total: number;
  pendientes: number;
  confirmadas: number;
  canceladas: number;
  completadas: number;
  noAsistio: number;
}

export type ResumenMes = Record<string, ResumenDia>;

export interface ActividadDia {
  dia: string;
  fecha: string;
  total: number;
  confirmadas: number;
}

export interface EstadisticasDashboard {
  totalPacientes: number;
  citasHoy: number;
  citasPendientes: number;
  citasConfirmadas: number;
  totalCitas: number;
  actividadSemanal: ActividadDia[];
}
