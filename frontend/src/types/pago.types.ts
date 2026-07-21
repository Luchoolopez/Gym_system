export type MetodoPago = 'CASH' | 'TRANSFER' | 'CARD' | 'MERCADOPAGO';

export const METODOS_PAGO: { value: MetodoPago; label: string }[] = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'CARD', label: 'Tarjeta' },
  { value: 'MERCADOPAGO', label: 'MercadoPago' },
];

export interface PagoDto {
  id: number;
  suscripcionId: number;
  usuario?: { id: number; nombre: string; apellido: string; dni?: string };
  plan?: { id: number; nombre: string };
  monto: number;
  metodo: MetodoPago;
  fecha: string;
  notas?: string;
  fechaCreacion?: string;
}

export interface CreatePagoDto {
  suscripcionId: number;
  monto: number;
  metodo: MetodoPago;
  fecha?: string;
  notas?: string;
}

export interface PagoFilterDto {
  page?: number;
  limit?: number;
  usuarioId?: number;
  desde?: string;
  hasta?: string;
}
