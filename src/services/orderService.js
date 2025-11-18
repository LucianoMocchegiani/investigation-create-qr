import { randomUUID } from 'crypto';

const orders = new Map();

export function listOrders() {
  return Array.from(orders.entries()).map(([id, data]) => ({
    id,
    ...data,
  }));
}

export function createOrder({ descripcion, baseUrl }) {
  const id = randomUUID();
  const order = {
    descripcion,
    estado: 'pendiente',
    creadoEn: new Date().toISOString(),
    confirmUrl: `${baseUrl}/api/orders/${id}/confirm`,
  };

  orders.set(id, order);
  return { id, ...order };
}

export function deleteOrder(id) {
  orders.delete(id);
}

export function getOrderById(id) {
  const order = orders.get(id);
  return order ? { id, ...order } : null;
}

export function markOrderConfirmed(id) {
  const order = orders.get(id);
  if (!order) return null;

  const alreadyConfirmed = order.estado === 'confirmado';
  if (!alreadyConfirmed) {
    order.estado = 'confirmado';
    order.confirmadoEn = new Date().toISOString();
    orders.set(id, order);
  }

  return { id, ...order, alreadyConfirmed };
}

