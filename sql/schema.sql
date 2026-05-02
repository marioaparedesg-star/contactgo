-- ============================================================
-- ContactGo — Schema completo para Supabase
-- Pega esto en el SQL Editor de Supabase y ejecuta
-- ============================================================

-- ── EXTENSIONES ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── LIMPIAR (si re-ejecutas) ─────────────────────────────────
DROP TABLE IF EXISTS reminders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ── PROFILES (extiende auth.users) ──────────────────────────
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre        TEXT,
  telefono      TEXT,
  email         TEXT,
  role          TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── CATEGORIES ───────────────────────────────────────────────
CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  orden       INT DEFAULT 0
);

INSERT INTO categories (nombre, slug, descripcion, orden) VALUES
  ('Lentes Esféricos',     'esfericos',     'Para miopía e hipermetropía', 1),
  ('Lentes Tóricos',       'toricos',       'Para astigmatismo',           2),
  ('Lentes Multifocales',  'multifocales',  'Para presbicia',              3),
  ('Lentes de Color',      'color',         'Con o sin graduación',        4),
  ('Soluciones',           'soluciones',    'Limpieza y mantenimiento',    5),
  ('Gotas Oftálmicas',     'gotas',         'Lubricación ocular',          6);

-- ── PRODUCTS ─────────────────────────────────────────────────
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre          TEXT NOT NULL,
  descripcion     TEXT,
  marca           TEXT,
  precio          NUMERIC(10,2) NOT NULL DEFAULT 0,
  costo           NUMERIC(10,2) DEFAULT 0,
  stock           INT NOT NULL DEFAULT 0,
  categoria_id    INT REFERENCES categories(id),
  tipo            TEXT CHECK (tipo IN ('esferico','torico','multifocal','color','solucion','gota')),
  imagen_url      TEXT,
  activo          BOOLEAN DEFAULT TRUE,
  -- Parámetros ópticos disponibles (arrays para el filtro de receta)
  sph_disponibles  NUMERIC[] DEFAULT '{}',
  cyl_disponibles  NUMERIC[] DEFAULT '{}',
  add_disponibles  TEXT[]    DEFAULT '{}',
  -- Metadatos
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── ADDRESSES ────────────────────────────────────────────────
CREATE TABLE addresses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  direccion   TEXT NOT NULL,
  ciudad      TEXT NOT NULL,
  provincia   TEXT,
  telefono    TEXT,
  principal   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── PRESCRIPTIONS ────────────────────────────────────────────
CREATE TABLE prescriptions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Ojo derecho
  od_sph      NUMERIC(5,2),
  od_cyl      NUMERIC(5,2),
  od_axis     INT,
  -- Ojo izquierdo
  oi_sph      NUMERIC(5,2),
  oi_cyl      NUMERIC(5,2),
  oi_axis     INT,
  -- Adición (presbicia)
  add_power   NUMERIC(4,2),
  -- Metadata
  imagen_url  TEXT,
  notas       TEXT,
  fecha       DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── ORDERS ───────────────────────────────────────────────────
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Cliente (para pedidos sin cuenta)
  cliente_nombre  TEXT,
  cliente_email   TEXT,
  cliente_telefono TEXT,
  -- Estado
  estado          TEXT NOT NULL DEFAULT 'pendiente'
                  CHECK (estado IN ('pendiente','confirmado','preparando','enviado','entregado','cancelado')),
  -- Totales
  subtotal        NUMERIC(10,2) NOT NULL DEFAULT 0,
  envio           NUMERIC(10,2) NOT NULL DEFAULT 200,
  descuento       NUMERIC(10,2) DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL DEFAULT 0,
  -- Pago
  metodo_pago     TEXT CHECK (metodo_pago IN ('paypal','transferencia','contra_entrega')),
  pago_estado     TEXT DEFAULT 'pendiente' CHECK (pago_estado IN ('pendiente','verificado','rechazado')),
  pago_referencia TEXT,
  -- Envío
  direccion_id    UUID REFERENCES addresses(id) ON DELETE SET NULL,
  direccion_texto TEXT,  -- snapshot de la dirección al momento del pedido
  -- Receta usada
  receta_id       UUID REFERENCES prescriptions(id) ON DELETE SET NULL,
  -- Notas
  notas_admin     TEXT,
  -- Timestamps
  fecha           TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── ORDER_ITEMS ──────────────────────────────────────────────
CREATE TABLE order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  -- Snapshot del producto al momento del pedido
  nombre        TEXT NOT NULL,
  precio        NUMERIC(10,2) NOT NULL,
  cantidad      INT NOT NULL CHECK (cantidad > 0),
  subtotal      NUMERIC(10,2) GENERATED ALWAYS AS (precio * cantidad) STORED,
  -- Parámetros ópticos seleccionados
  sph           NUMERIC(5,2),
  cyl           NUMERIC(5,2),
  axis          INT,
  add_power     NUMERIC(4,2),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── REMINDERS ────────────────────────────────────────────────
CREATE TABLE reminders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id          UUID REFERENCES products(id) ON DELETE SET NULL,
  order_id            UUID REFERENCES orders(id) ON DELETE SET NULL,
  tipo                TEXT DEFAULT 'recompra',
  fecha_recordatorio  DATE NOT NULL,
  enviado             BOOLEAN DEFAULT FALSE,
  enviado_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_products_tipo        ON products(tipo);
CREATE INDEX idx_products_categoria   ON products(categoria_id);
CREATE INDEX idx_products_activo      ON products(activo);
CREATE INDEX idx_products_marca       ON products(marca);
CREATE INDEX idx_orders_user          ON orders(user_id);
CREATE INDEX idx_orders_estado        ON orders(estado);
CREATE INDEX idx_orders_fecha         ON orders(fecha DESC);
CREATE INDEX idx_order_items_order    ON order_items(order_id);
CREATE INDEX idx_prescriptions_user   ON prescriptions(user_id);
CREATE INDEX idx_addresses_user       ON addresses(user_id);
CREATE INDEX idx_reminders_fecha      ON reminders(fecha_recordatorio);
CREATE INDEX idx_reminders_enviado    ON reminders(enviado);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders      ENABLE ROW LEVEL SECURITY;

-- ── Función helper: es admin ──
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ── PROFILES ──
CREATE POLICY "Usuarios ven su propio perfil"
  ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "Usuarios actualizan su propio perfil"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Insert propio perfil"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin ve todos los perfiles"
  ON profiles FOR ALL USING (is_admin());

-- ── PRODUCTS (público para leer, admin para escribir) ──
CREATE POLICY "Productos visibles para todos"
  ON products FOR SELECT USING (activo = TRUE OR is_admin());

CREATE POLICY "Solo admin modifica productos"
  ON products FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Solo admin actualiza productos"
  ON products FOR UPDATE USING (is_admin());

CREATE POLICY "Solo admin elimina productos"
  ON products FOR DELETE USING (is_admin());

-- ── CATEGORIES (público) ──
CREATE POLICY "Categorías visibles para todos"
  ON categories FOR SELECT USING (TRUE);

CREATE POLICY "Solo admin modifica categorías"
  ON categories FOR ALL USING (is_admin());

-- ── ADDRESSES ──
CREATE POLICY "Usuarios ven sus direcciones"
  ON addresses FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Usuarios crean sus direcciones"
  ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios actualizan sus direcciones"
  ON addresses FOR UPDATE USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Usuarios eliminan sus direcciones"
  ON addresses FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- ── PRESCRIPTIONS ──
CREATE POLICY "Usuarios ven sus recetas"
  ON prescriptions FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Usuarios crean sus recetas"
  ON prescriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios actualizan sus recetas"
  ON prescriptions FOR UPDATE USING (auth.uid() = user_id OR is_admin());

-- ── ORDERS ──
CREATE POLICY "Usuarios ven sus pedidos"
  ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Usuarios crean pedidos"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Admin actualiza pedidos"
  ON orders FOR UPDATE USING (is_admin());

-- ── ORDER_ITEMS ──
CREATE POLICY "Usuarios ven sus items"
  ON order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (user_id = auth.uid() OR is_admin()))
  );

CREATE POLICY "Insertar items en pedidos propios"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
  );

-- ── REMINDERS ──
CREATE POLICY "Usuarios ven sus recordatorios"
  ON reminders FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Sistema crea recordatorios"
  ON reminders FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());

-- ============================================================
-- TRIGGER: auto-crear perfil al registrarse
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, nombre)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- TRIGGER: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at   BEFORE UPDATE ON products   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at     BEFORE UPDATE ON orders     FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ADMIN: asignar rol admin (ejecutar después con el UUID real)
-- ============================================================
-- UPDATE profiles SET role = 'admin' WHERE email = 'info@contactgo.net';

-- ============================================================
-- SEED: productos iniciales desde inventario real
-- ============================================================
INSERT INTO products (nombre, marca, precio, stock, tipo, categoria_id, sph_disponibles) VALUES
-- Esféricos
('1-Day Acuvue Moist', 'Acuvue', 3100, 553, 'esferico', 1,
  '{-0.5,-0.75,-1,-1.25,-1.5,-1.75,-2,-2.25,-2.5,-2.75,-3,-3.25,-3.5,-3.75,-4,-4.25,-4.5,-4.75,-5,-5.25,-5.5,-5.75,-6,-6.5,-7,-7.5,-8,-8.5,-9,-9.5,-10,-10.5,-11,-11.5,-12,2.25,4.5}'),
('Acuvue 2',            'Acuvue', 2965, 94,  'esferico', 1,
  '{-0.75,-1,-1.25,-1.5,-2,-2.25,-2.75,-3,-3.25,-3.5,-3.75,-4,-4.25,-4.75,-5,-5.25,-5.5,-5.75,-6.5,-7,-7.5,-8,-8.5}'),
('Acuvue Oasys',        'Acuvue', 3100, 541, 'esferico', 1,
  '{-0.5,-0.75,-1,-1.25,-1.5,-1.75,-2,-2.25,-2.5,-2.75,-3,-3.25,-3.5,-3.75,-4,-4.25,-4.5,-4.75,-5,-5.25,-5.5,-5.75,-6,-6.5,-7,-7.5,-8,-8.5,-9,-9.5,-10,-10.5,-11,-11.5,-12,1,1.75,2.5,3,6,8}'),

-- Tóricos
('1-Day Acuvue Moist for Astigmatism', 'Acuvue', 4975, 5, 'torico', 2,
  '{-6.5,-1.75,0}'),
('Acuvue Oasys for Astigmatism',       'Acuvue', 4975, 62, 'torico', 2,
  '{-1.25,-7,-1.25,-8,-2,-4,-4.25,0,-0.75,-1.5,-1.75,-2.25,-3.5,-4,-5.5,-1,-3,-4,-4.75,-5.75,-6.5,-8.5,1,1.5}'),

-- Multifocales
('Acuvue Oasys for Multifocal',        'Acuvue', 6200, 16, 'multifocal', 3,
  '{-2.5,-2.25,-4.5,-4,-3.5,-4.75,-4.25,0.5,1,1.25,1.5,2.25,-3.75}'),

-- Color
('Air Optix COLOR',      'Alcon',   2000, 134, 'color', 4, '{0,-0.75,-2,-3,-3.5,-4.75,-5,-8,1,2.5,4}'),
('FreshLook',            'Alcon',   1500, 34,  'color', 4, '{0,-0.5,-2.75,-4.75,-6,0.75,3.5}'),
('Bausch+Lomb Lunare',   'B+L',     1500, 34,  'color', 4, '{}'),

-- Soluciones
('Opti-Free Puremoist 300ml', 'Alcon',   1500, 30, 'solucion', 5, '{}'),
('Opti-Free Puremoist 90ml',  'Alcon',    900, 25, 'solucion', 5, '{}'),
('Prolub Hyfresh 60ml',       'Prolub',   800, 40, 'solucion', 5, '{}'),
('Dream Eye 360ml',           'Dream Eye',1200,20, 'solucion', 5, '{}'),
('Solite',                    'Genérico', 600, 30, 'solucion', 5, '{}'),
('Soltec',                    'Genérico', 700, 25, 'solucion', 5, '{}'),

-- Gotas
('Frigine Gotas 15ml',        'Frigine',  850, 35, 'gota', 6, '{}'),
('Refresh Gotas',             'Allergan', 750, 20, 'gota', 6, '{}'),
('Lagricel',                  'Lagricel', 650, 30, 'gota', 6, '{}'),
('Sprainer',                  'Sprainer', 700, 25, 'gota', 6, '{}');
