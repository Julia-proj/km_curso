-- ===========================================
-- ОТВЕТЫ КВИЗА
-- ===========================================
create table if not exists quiz_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  
  -- идентификация
  user_email text,
  session_id text, -- для анонимных, до того как оставил email
  user_id uuid references profiles(id),
  
  -- ответы (структурированные)
  hair_type text, -- 'natural' | 'colored' | 'bleached' | 'highlighted'
  scalp_type text, -- 'normal' | 'oily' | 'dry' | 'sensitive' | 'unknown'
  main_concern text, -- 'dryness' | 'breakage' | 'volume_loss' | 'color_fade' | 'oiliness' | 'unknown'
  wash_frequency text, -- 'daily' | 'every_other' | 'twice_week' | 'weekly'
  heat_styling text, -- 'daily' | 'often' | 'rarely' | 'never'
  recent_treatments jsonb, -- ['coloring', 'bleaching', 'keratin', 'perm', 'none']
  budget_range text, -- 'budget' | 'mid' | 'premium' | 'no_limit'
  
  -- raw answers (для отладки и будущих анализов)
  raw_answers jsonb,
  
  -- мета
  user_ip text,
  user_agent text
);

create index idx_quiz_email on quiz_responses(user_email);
create index idx_quiz_session on quiz_responses(session_id);

-- ===========================================
-- КАТАЛОГ ПРОДУКТОВ LIMBA
-- ===========================================
create table if not exists products (
  id text primary key, -- 'limba-color-shampoo', 'limba-detox-mask', etc
  name text not null,
  category text not null, -- 'color' | 'volume' | 'detox' | 'hydration' | 'universal'
  product_type text not null, -- 'shampoo' | 'conditioner' | 'mask' | 'heat_protection' | 'accessory'
  description text,
  ingredients_short text,
  volume_ml int,
  price_eur numeric(10, 2),
  stripe_price_id text,
  image_path text,
  available_in_studio boolean default true,
  is_gift boolean default false,
  order_index int,
  created_at timestamptz default now()
);

-- Начальный набор продуктов (заменишь на свои данные)
insert into products (id, name, category, product_type, description, price_eur, order_index) values
  ('limba-color-shampoo', 'Limba Color Шампунь', 'color', 'shampoo', 'Защита цвета и блеск для окрашенных волос', 24.00, 1),
  ('limba-color-conditioner', 'Limba Color Кондиционер', 'color', 'conditioner', 'Кондиционер для защиты пигмента', 22.00, 2),
  ('limba-color-mask', 'Limba Color Маска', 'color', 'mask', 'Интенсивная маска для окрашенных волос', 32.00, 3),
  
  ('limba-volume-shampoo', 'Limba Volume Шампунь', 'volume', 'shampoo', 'Объём и плотность для тонких волос', 24.00, 4),
  ('limba-volume-conditioner', 'Limba Volume Кондиционер', 'volume', 'conditioner', 'Лёгкий кондиционер без утяжеления', 22.00, 5),
  ('limba-volume-mask', 'Limba Volume Маска', 'volume', 'mask', 'Маска для плотности волос', 32.00, 6),
  
  ('limba-detox-shampoo', 'Limba Detox Шампунь', 'detox', 'shampoo', 'Глубокое очищение и обновление', 26.00, 7),
  ('limba-detox-conditioner', 'Limba Detox Кондиционер', 'detox', 'conditioner', 'Кондиционер после детокса', 22.00, 8),
  ('limba-detox-mask', 'Limba Detox Маска', 'detox', 'mask', 'Маска восстанавливающая баланс', 32.00, 9),
  
  ('limba-hydration-shampoo', 'Limba Hydration Шампунь', 'hydration', 'shampoo', 'Увлажнение для сухих волос', 24.00, 10),
  ('limba-hydration-conditioner', 'Limba Hydration Кондиционер', 'hydration', 'conditioner', 'Интенсивное увлажнение', 22.00, 11),
  ('limba-hydration-mask', 'Limba Hydration Маска', 'hydration', 'mask', 'Маска глубокого увлажнения', 32.00, 12),
  
  ('limba-heat-protection', 'Limba Термозащита', 'universal', 'heat_protection', 'Универсальная термозащита перед укладкой', 28.00, 13),
  
  -- Подарки (опционально к pack)
  ('gift-thermo-cap', 'Термошапочка', 'universal', 'accessory', 'Усиливает действие маски', 0, 14),
  ('gift-massage-brush', 'Массажная щётка для шампуня', 'universal', 'accessory', 'Глубокая очистка кожи головы', 0, 15),
  ('gift-detangling-comb', 'Расчёска для распутывания', 'universal', 'accessory', 'Минимизирует ломкость на мокрых волосах', 0, 16);

update products set is_gift = true where id in ('gift-thermo-cap', 'gift-massage-brush', 'gift-detangling-comb');

-- ===========================================
-- РЕКОМЕНДАЦИИ (сохраняем расчётный результат)
-- ===========================================
create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_email text,
  user_id uuid references profiles(id),
  
  -- источники данных для рекомендации
  quiz_response_id uuid references quiz_responses(id),
  diagnostic_id uuid references diagnostics(id),
  
  -- результат
  primary_category text, -- 'color' | 'volume' | 'detox' | 'hydration'
  secondary_category text, -- если нужен mix, например hydration + color
  recommended_product_ids text[], -- массив id продуктов
  recommended_gift_ids text[], -- массив подарков
  
  -- объяснение для пользователя (генерируется AI или из шаблонов)
  reasoning_summary text,
  reasoning_details jsonb -- структурированно
);

-- ===========================================
-- ЗАКАЗЫ (если ещё не было таблицы)
-- ===========================================
-- если orders уже есть, добавь поля:
alter table orders 
  add column if not exists recommendation_id uuid references recommendations(id),
  add column if not exists pickup_location text default 'studio_madrid',
  add column if not exists pickup_status text default 'pending'; 
  -- 'pending' | 'ready' | 'picked_up'

-- RLS policies
alter table quiz_responses enable row level security;
alter table products enable row level security;
alter table recommendations enable row level security;

create policy "users see own quiz responses" on quiz_responses
  for select using (auth.uid() = user_id);

create policy "everyone can read products" on products
  for select using (true);

create policy "users see own recommendations" on recommendations
  for select using (auth.uid() = user_id);
