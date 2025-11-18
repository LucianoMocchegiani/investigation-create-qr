import { Router } from 'express';
import {
  createOrder,
  listOrders,
  markOrderConfirmed,
  deleteOrder,
} from '../services/orderService.js';
import { generateQrBase64 } from '../services/qrService.js';

export function createOrdersRouter({ baseUrl }) {
  const router = Router();

  router.use((req, _res, next) => {
    console.info(`[orders] ${req.method} ${req.originalUrl}`);
    next();
  });

  router.get('/orders', (_req, res) => {
    const data = listOrders();
    res.json({ total: data.length, data });
  });

  router.post('/orders', async (req, res) => {
    const { descripcion } = req.body ?? {};

    if (!descripcion || typeof descripcion !== 'string') {
      return res
        .status(400)
        .json({ mensaje: 'Debe enviar el campo descripcion como string' });
    }

    let order;

    try {
      order = createOrder({ descripcion, baseUrl });
      const base64 = await generateQrBase64(order.confirmUrl);
      console.info(`[orders] orden ${order.id} creada (estado ${order.estado})`);

      res.status(201).json({
        orden: order,
        qr: {
          contenido: order.confirmUrl,
          base64,
          mimeType: 'image/png',
        },
      });
    } catch (error) {
      if (order?.id) {
        deleteOrder(order.id);
      }
      console.error('[orders] error generando código para orden', error);
      res.status(500).json({ mensaje: 'No se pudo generar el código QR' });
    }
  });

  router.all('/orders/:id/confirm', (req, res) => {
    const result = markOrderConfirmed(req.params.id);
    if (!result) {
      return res.status(404).send('Orden inexistente');
    }

    if (result.alreadyConfirmed) {
      console.info(`[orders] orden ${result.id} ya estaba confirmada`);
      return res.send(
        `<h1>Orden ya confirmada</h1><p>ID: ${result.id}</p><p>${result.descripcion}</p>`
      );
    }

    console.info(`[orders] orden ${result.id} confirmada`);
    res.send(
      `<h1>Orden confirmada</h1><p>ID: ${result.id}</p><p>${result.descripcion}</p><p>Estado: ${result.estado}</p>`
    );
  });

  return router;
}

