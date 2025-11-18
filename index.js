import { app, PORT } from './src/app.js';

app.listen(PORT, () => {
  console.log(`Servidor QR escuchando en http://localhost:${PORT}`);
  console.log(`Servidor QR escuchando en http://localhost:${PORT}/docs para ver la documentación`);
});

