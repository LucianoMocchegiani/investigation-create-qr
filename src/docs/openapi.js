const openApiDocument = {
  openapi: '3.0.1',
  info: {
    title: 'Demo QR API',
    version: '1.0.0',
    description:
      'API de ejemplo que genera códigos QR y confirma órdenes mediante escaneo.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local de desarrollo',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Verifica la disponibilidad del servicio',
        tags: ['Sistema'],
        responses: {
          200: {
            description: 'Estado actual del servicio',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/qr': {
      post: {
        summary: 'Genera un código QR en Base64 a partir de un texto',
        tags: ['QR'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/QrRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'QR generado correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/QrResponse' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/orders': {
      get: {
        summary: 'Lista las órdenes creadas en memoria',
        tags: ['Órdenes'],
        responses: {
          200: {
            description: 'Listado de órdenes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderListResponse' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Crea una orden y devuelve el QR para confirmarla',
        tags: ['Órdenes'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Orden creada con su QR de confirmación',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderResponse' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/orders/{id}/confirm': {
      get: {
        summary: 'Confirma una orden mediante la URL embebida en el QR',
        tags: ['Órdenes'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: {
            description: 'Página HTML informando el estado',
            content: { 'text/html': { schema: { type: 'string' } } },
          },
          404: {
            description: 'Orden inexistente',
            content: { 'text/plain': { schema: { type: 'string' } } },
          },
        },
      },
    },
  },
  components: {
    responses: {
      BadRequest: {
        description: 'Request inválido',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                mensaje: { type: 'string', example: 'Debe enviar el campo texto como string' },
              },
            },
          },
        },
      },
      ServerError: {
        description: 'Error interno al generar el QR',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                mensaje: { type: 'string', example: 'No se pudo generar el código QR' },
              },
            },
          },
        },
      },
    },
    schemas: {
      QrRequest: {
        type: 'object',
        required: ['texto'],
        properties: {
          texto: {
            type: 'string',
            description: 'Contenido que se codificará en el QR',
            example: 'GCABA-12345',
          },
        },
      },
      QrResponse: {
        type: 'object',
        properties: {
          base64: { type: 'string', description: 'Imagen PNG codificada en Base64' },
          mimeType: { type: 'string', example: 'image/png' },
          length: { type: 'integer', example: 1024 },
        },
      },
      OrderRequest: {
        type: 'object',
        required: ['descripcion'],
        properties: {
          descripcion: {
            type: 'string',
            description: 'Detalle de la orden o trámite a confirmar',
            example: 'Entrega de credencial en sede comunal',
          },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          descripcion: { type: 'string' },
          estado: { type: 'string', enum: ['pendiente', 'confirmado'] },
          creadoEn: { type: 'string', format: 'date-time' },
          confirmadoEn: { type: 'string', format: 'date-time', nullable: true },
          confirmUrl: { type: 'string', format: 'uri' },
        },
      },
      OrderResponse: {
        type: 'object',
        properties: {
          orden: { $ref: '#/components/schemas/Order' },
          qr: {
            type: 'object',
            properties: {
              contenido: { type: 'string', format: 'uri' },
              base64: { type: 'string' },
              mimeType: { type: 'string', example: 'image/png' },
            },
          },
        },
      },
      OrderListResponse: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Order' },
          },
        },
      },
    },
  },
};

export { openApiDocument };

