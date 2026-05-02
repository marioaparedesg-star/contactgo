# ContactGo — Guía de instalación y deploy
## Tiempo estimado: 30 minutos

---

## PASO 1 — Configurar Supabase (10 min)

### 1.1 Crear proyecto
1. Ve a [supabase.com](https://supabase.com) → New Project
2. Nombre: `contactgo`
3. Password: (guárdalo)
4. Región: US East (más cercano a RD)

### 1.2 Ejecutar el SQL
1. Supabase → **SQL Editor** → New Query
2. Pega el contenido de `sql/schema.sql`
3. Clic **Run** (puede tardar 10-15 segundos)
4. Verifica que diga "Success"

### 1.3 Asignar rol admin
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'info@contactgo.net';
```
⚠️ Primero debes registrarte en la app con ese email, luego ejecutar este SQL.

### 1.4 Configurar Storage
1. Supabase → **Storage** → New bucket
2. Nombre: `products` (público)
3. Repetir para: `receipts` (privado), `prescriptions` (privado)

### 1.5 Obtener credenciales
1. Supabase → **Settings** → **API**
2. Copia:
   - `URL del proyecto`
   - `anon public key`
   - `service_role key`

---

## PASO 2 — Configurar el proyecto (5 min)

### 2.1 Clonar y configurar
```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
```

### 2.2 Llenar `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AXiNeupBo4xZ3IOVw4ELm_FylGe0o2nSh0Kn2uPZP49y8jexaFWwB3YESkSlsCUCpAe_X-XygIVv42b6
NEXT_PUBLIC_SITE_URL=https://contactgo.net
NEXT_PUBLIC_WHATSAPP=18294089097
```

### 2.3 Probar localmente
```bash
npm run dev
# Abre http://localhost:3000
```

---

## PASO 3 — Deploy en Vercel (10 min)

### 3.1 Subir a GitHub
```bash
git init
git add .
git commit -m "ContactGo v1.0 — Initial commit"
git branch -M main
git remote add origin https://github.com/marioaparedesg-star/contactgo
git push -u origin main
```

### 3.2 Conectar Vercel
1. [vercel.com](https://vercel.com) → Add New Project
2. Importar: `marioaparedesg-star/contactgo`
3. Framework: **Next.js** (detecta automático)
4. **Environment Variables** → Agregar todas las del `.env.local`
5. Clic **Deploy**

### 3.3 Conectar dominio
1. Vercel → proyecto → **Settings → Domains**
2. Agregar: `contactgo.net`
3. GoDaddy → DNS → Actualizar registro A: `76.76.21.21`

### 3.4 Actualizar Supabase con dominio real
1. Supabase → **Authentication → URL Configuration**
2. Site URL: `https://contactgo.net`
3. Redirect URLs: `https://contactgo.net/**`

---

## PASO 4 — Configurar admin (5 min)

1. Ve a `contactgo.net/admin/login`
2. **NO puedes entrar aún** — primero necesitas crear la cuenta:
3. Ve a `contactgo.net/cuenta` → Registrarse con `info@contactgo.net`
4. Verifica el email (Supabase envía un link)
5. Ejecuta en Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'info@contactgo.net';
```
6. Ahora entra a `/admin/login` con tus credenciales

---

## ESTRUCTURA DEL PROYECTO

```
contactgo/
├── sql/
│   └── schema.sql          ← Schema completo de Supabase
├── src/
│   ├── app/
│   │   ├── page.tsx         ← Home
│   │   ├── catalogo/        ← Catálogo con filtros
│   │   ├── producto/[id]/   ← Detalle de producto
│   │   ├── receta/          ← Buscador inteligente
│   │   ├── cart/            ← Carrito
│   │   ├── checkout/        ← Checkout (PayPal + BHD + Contra entrega)
│   │   ├── cuenta/          ← Dashboard cliente
│   │   └── admin/           ← Panel admin
│   ├── components/
│   │   ├── ui/              ← Navbar, Footer, WhatsApp
│   │   ├── shop/            ← ProductCard
│   │   └── admin/           ← AdminNav
│   ├── lib/
│   │   ├── supabase.ts      ← Clientes Supabase
│   │   ├── cart-store.ts    ← Carrito con Zustand
│   │   └── prescription.ts  ← Analizador de recetas
│   └── types/
│       └── index.ts         ← Todos los tipos TypeScript
└── .env.example
```

---

## FUNCIONALIDADES INCLUIDAS

### E-commerce
- ✅ Catálogo completo con 20+ productos desde DB
- ✅ Filtros por tipo, marca, búsqueda
- ✅ Detalle de producto con selector de graduación
- ✅ Carrito persistente (Zustand + localStorage)
- ✅ Checkout completo (PayPal + BHD + Contra entrega)
- ✅ Pedidos guardados en Supabase

### Sistema inteligente de receta
- ✅ Análisis automático: Miopía / Hipermetropía / Astigmatismo / Presbicia
- ✅ Recomendación de tipo de lente
- ✅ Filtro automático del catálogo
- ✅ Disclaimer médico obligatorio

### CRM / Admin
- ✅ Dashboard con KPIs en tiempo real
- ✅ CRUD completo de productos
- ✅ Gestión de pedidos con cambio de estado
- ✅ Botón WhatsApp directo al cliente
- ✅ Panel de clientes

### Automatización
- ✅ Recordatorio de recompra creado automáticamente (25 días para lentes mensuales)
- ✅ Trigger automático de perfil al registrarse
- ✅ RLS completo en todas las tablas

---

## SIGUIENTES PASOS (OPCIONALES)

1. **Imágenes de productos** — Subir a Supabase Storage y actualizar `imagen_url`
2. **Email automático** — Configurar Supabase Email + plantillas de confirmación
3. **WhatsApp automático** — Integrar Twilio o WapiKit
4. **Analytics** — Agregar Google Analytics o Vercel Analytics
5. **App móvil** — Migrar a React Native / Expo (mismo backend Supabase)
