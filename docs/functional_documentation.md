# 📄 Documentación Funcional

## Bot de Automatización de Facturas + Panel Web

**Versión:** 2.0  
**Fecha:** 13 de Noviembre, 2025  
**Estado:** MVP (Producto Mínimo Viable)

---

# 1. Resumen Ejecutivo

El proyecto consiste en una herramienta que permite digitalizar y registrar gastos contables automáticamente utilizando:

- Telegram como canal de entrada,
- Inteligencia Artificial (GPT‑5) para extraer datos,
- Firebase como backend,
- Un panel web en React (Vite + Firebase) para visualizar facturas.

El flujo principal:

1. El usuario envía una imagen de la factura por Telegram.
2. El backend la procesa con IA.
3. Los datos se guardan en Firebase.
4. El usuario puede ver sus facturas en el panel web autenticándose con Firebase Auth.

Cambio clave:  
➡️ **Los datos ya no se almacenan en Google Sheets sino en Firebase.**

---

# 2. Objetivos del Proyecto

## 2.1 Objetivo General

Reducir en un 90% el tiempo dedicado a la carga manual de comprobantes, ofreciendo un panel web moderno para visualizar historial.

## 2.2 Objetivos Específicos

- Usar Telegram como canal intuitivo para enviar facturas.
- Extraer datos con IA de alta precisión.
- Guardar todo en Firebase en tiempo real.
- Proveer feedback inmediato por Telegram.
- Permitir visualización web mediante autenticación Firebase.

---

# 3. Actores del Sistema

| Actor                        | Descripción                                                |
| ---------------------------- | ---------------------------------------------------------- |
| **Usuario Final**            | Envía imágenes por Telegram y consulta facturas en la web. |
| **Bot del Sistema**          | Recibe imágenes, procesa extracción con IA y responde.     |
| **Aplicación Web**           | Panel React donde se listan facturas.                      |
| **Administrador (Opcional)** | Puede revisar múltiples usuarios.                          |
| **Firebase Backend**         | Maneja Auth + Base de datos.                               |

---

# 4. Requerimientos Funcionales

## 4.1 Recepción de Comprobantes (Telegram)

- **RF‑01:** Recibir imágenes JPG/PNG.
- **RF‑02:** Activar procesamiento automáticamente al recibir una imagen.

## 4.2 Procesamiento y Extracción (IA + OCR)

- **RF‑03:** Validar si la imagen es un comprobante.
- **RF‑04:** Extraer campos obligatorios:
  - Fecha
  - Proveedor
  - Número de factura
  - Total

## 4.3 Almacenamiento en Firebase

- **RF‑05:** Guardar datos extraídos en Firebase.
- **RF‑06:** Asociar cada factura al `userId`.
- **RF‑07:** Guardar monto como número.
- **RF‑08:** Guardar `createdAt`.

## 4.4 Interacción y Feedback (Telegram)

- **RF‑09:** Enviar mensaje “Procesando…” tras recibir imagen.
- **RF‑10:** Enviar confirmación con datos extraídos.
- **RF‑11:** Enviar mensaje de error cuando corresponda.

## 4.5 Frontend Web (React + Firebase)

- **RF‑12:** Login con Firebase Auth.
- **RF‑13:** Listado de facturas.
- **RF‑14:** Mostrar Fecha, Proveedor, N° Factura, Total.
- **RF‑15:** Cada usuario solo ve sus propias facturas.
- **RF‑16:** Filtros opcionales por fecha, proveedor, monto.

---

# 5. Flujo de Usuario

## 5.1 Registro y Panel Web

1. El usuario ingresa a la web.
2. Se registra o inicia sesión con Firebase Auth.
3. Ve listado de facturas cargadas previamente.
4. Nuevas facturas aparecen en tiempo casi real.

## 5.2 Envío de Factura por Telegram

1. El usuario abre el chat del bot.
2. Envía foto de una factura o ticket.
3. Backend procesa con OpenAI.
4. Bot responde:

```
✅ Factura Registrada
Fecha: 13/11/2025
Proveedor: Restaurante El Paso
Total: $15.500
```

5. La factura aparece en el panel web.

---

# 6. Diccionario de Datos (Firebase)

## 6.1 Colección: `invoices`

| Campo     | Tipo        | Ejemplo           | Descripción           |
| --------- | ----------- | ----------------- | --------------------- |
| id        | String      | abc123            | ID del documento      |
| userId    | String      | uid_123           | Dueño de la factura   |
| fecha     | String/Date | 13/11/2025        | Fecha de emisión      |
| proveedor | String      | Starbucks         | Nombre del comercio   |
| n_factura | String      | 0001‑00045231     | Número de factura     |
| total     | Number      | 4500.00           | Monto final           |
| moneda    | String      | ARS               | Moneda                |
| createdAt | Timestamp   | 2025‑11‑13T14:32Z | Fecha de registro     |
| source    | String      | telegram          | Origen                |
| rawData   | String/JSON | { ... }           | Respuesta cruda de IA |

---

## 6.2 Colección opcional: `users`

| Campo       | Tipo      | Ejemplo           |
| ----------- | --------- | ----------------- |
| uid         | String    | uid_123           |
| email       | String    | user@mail.com     |
| displayName | String    | Juan Pérez        |
| telegramId  | String    | 123456789         |
| createdAt   | Timestamp | 2025‑11‑10T18:00Z |

---

# 7. Requerimientos No Funcionales

### Conectividad

- Requiere internet para Telegram y panel web.

### Costos

- OpenAI tiene costo por procesamiento.
- Firebase puede permanecer gratuito en MVP.

### Latencia

- Tiempo de respuesta esperado: < 15 segundos.

### Seguridad

- Variables de entorno protegidas.
- Reglas de Firestore restringiendo acceso por userId.
- HTTPS obligatorio.

### Escalabilidad

- Preparado para filtros, exportaciones, estadísticas futuras.

---

# 8. Manejo de Errores

| Situación          | Comportamiento                             | Mensaje                                      |
| ------------------ | ------------------------------------------ | -------------------------------------------- |
| Imagen borrosa     | IA no extrae datos                         | “❌ No pude leer la imagen.”                 |
| No es factura      | Imagen no válida                           | “⚠️ La imagen no parece una factura válida.” |
| Error Firebase     | No se guarda                               | “❌ Error al guardar los datos.”             |
| Error OpenAI       | IA no responde                             | “❌ Error al procesar la imagen.”            |
| Usuario no mapeado | No se encuentra relación Telegram → userId | “⚠️ Problema para asociar tu cuenta.”        |

---
