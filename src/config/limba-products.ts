/**
 * Static Limba product catalog (real data).
 * Photos live in /public/images/limba/. Prices in EUR.
 *
 * Lines by colour: pink = Color, blue = Volume, yellow = Hydration (normal/dry),
 * green = Detox (oily scalp). Thermo + peel are universal add-ons.
 */

export type LimbaCategory = 'color' | 'volume' | 'detox' | 'hydration'

export interface LimbaProduct {
  id: string
  name: string
  description: string
  price_eur: number
  /** Path under /public. */
  image?: string
  category: LimbaCategory | 'universal'
  isGift?: boolean
}

const CATEGORY_RU: Record<LimbaCategory, string> = {
  color: 'Color',
  volume: 'Volume',
  detox: 'Detox',
  hydration: 'Hydration',
}

export const SIGN_LABELS: Record<string, string> = {
  dryness: 'сухость',
  breakage: 'ломкость',
  split_ends: 'секущиеся кончики',
  dullness: 'тусклость',
  color_fade: 'потеря цвета',
  frizz: 'пушистость',
  oily_scalp: 'жирность корней',
  volume_loss: 'потеря объёма',
  thinning: 'истончение',
}

export const CATEGORY_INFO: Record<LimbaCategory, { label: string; description: string; why: string }> = {
  color: {
    label: 'Color',
    description: 'Защита цвета и яркость для окрашенных и осветлённых волос',
    why: 'защита цвета и блеск окрашенных волос'
  },
  volume: {
    label: 'Volume',
    description: 'Объём и плотность для тонких и ослабленных волос',
    why: 'плотность и восстановление тонких и ослабленных волос'
  },
  hydration: {
    label: 'Hydration',
    description: 'Увлажнение и восстановление для сухих, пористых и ломких волос',
    why: 'увлажнение и питание для сухих и пористых волос'
  },
  detox: {
    label: 'Detox',
    description: 'Детокс кожи головы: глубокое очищение и баланс',
    why: 'глубокое очищение и обновление'
  }
}

/** Flat per-item prices. Core set (shampoo+conditioner+mask+thermo) = 90€. */
export const PRICES = {
  shampoo: 20,
  conditioner: 20,
  mask: 25,
  heatProtection: 25,
  detoxShampoo: 20,
  scalpPeel: 25,
  peptideMask: 25,
  mangoCream: 35,
  glazeCream: 25,
  goldenHour: 25,
} as const

export const LIMBA_PRODUCTS: LimbaProduct[] = [
  // ── Color (pink) ──
  {
    id: 'limba-color-shampoo',
    name: 'Шампунь Limba Vibrant Color',
    description: 'Продлевает стойкость цвета и бережно очищает окрашенные волосы.',
    price_eur: PRICES.shampoo,
    image: '/images/limba/pink_color_champoo.png',
    category: 'color',
  },
  {
    id: 'limba-color-conditioner',
    name: 'Кондиционер Limba Intense Color',
    description: 'Сохраняет цвет, разглаживает и питает окрашенные волосы.',
    price_eur: PRICES.conditioner,
    image: '/images/limba/pink_color_conditioner.png',
    category: 'color',
  },
  {
    id: 'limba-color-mask',
    name: 'Маска Limba Color Prolonger',
    description: 'Продлевает цвет, укрепляет и смягчает волосы по длине.',
    price_eur: PRICES.mask,
    image: '/images/limba/pink_color_mask.png',
    category: 'color',
  },

  // ── Volume (blue) ──
  {
    id: 'limba-volume-shampoo',
    name: 'Шампунь Limba Pure Volume',
    description: 'Объём и плотность для тонких волос, мягкое очищение.',
    price_eur: PRICES.shampoo,
    image: '/images/limba/blue_volume_shampoo.png',
    category: 'volume',
  },
  {
    id: 'limba-volume-conditioner',
    name: 'Кондиционер Limba Bodifying',
    description: 'Уплотняет волос и повышает эластичность без утяжеления.',
    price_eur: PRICES.conditioner,
    image: '/images/limba/blue_bodifying_conditioner.png',
    category: 'volume',
  },
  {
    id: 'limba-volume-mask',
    name: 'Маска Limba Rejuvenating',
    description: 'Восстановление для ослабленных и ломких волос, возвращает упругость.',
    price_eur: PRICES.mask,
    image: '/images/limba/blue_rejuv_mask.png',
    category: 'volume',
  },

  // ── Hydration (yellow) ──
  {
    id: 'limba-hydration-shampoo',
    name: 'Шампунь Limba Normal & Dry Hydration',
    description: 'Мягкое очищение и увлажнение для нормальной и сухой кожи головы.',
    price_eur: PRICES.shampoo,
    image: '/images/limba/yellow_hydrating_shampoo.png',
    category: 'hydration',
  },
  {
    id: 'limba-hydration-conditioner',
    name: 'Кондиционер Limba Nourishing',
    description: 'Глубокое питание, естественный блеск и рассыпчатость.',
    price_eur: PRICES.conditioner,
    image: '/images/limba/yellow_nourishing_conditioner.png',
    category: 'hydration',
  },
  {
    id: 'limba-hydration-mask',
    name: 'Маска Limba Antioxidant Hydrating',
    description: 'Насыщает влагой сухие и пористые волосы, делает мягкими.',
    price_eur: PRICES.mask,
    image: '/images/limba/green_antiox_mask.png',
    category: 'hydration',
  },
  {
    id: 'limba-discipline-mask',
    name: 'Маска Limba Discipline',
    description: 'Дисциплинирует непослушные и склонные к спутыванию волосы, разглаживает.',
    price_eur: PRICES.mask,
    image: '/images/limba/yellow_discipline_mask.png',
    category: 'hydration',
  },

  // ── Detox / oily scalp (green) — add-ons ──
  {
    id: 'limba-detox-shampoo',
    name: 'Детокс-шампунь Limba Detox',
    description: 'Глубокое очищение жирной кожи головы, профилактика перхоти. Чередуй с основным шампунем.',
    price_eur: PRICES.detoxShampoo,
    image: '/images/limba/green_detox_shampoo.png',
    category: 'detox',
  },
  {
    id: 'limba-detox-conditioner',
    name: 'Детокс-кондиционер Limba Detangling',
    description: 'Лёгкое расчёсывание, увлажнение и баланс кожи головы.',
    price_eur: PRICES.conditioner,
    image: '/images/limba/green_detox_conditioner.png',
    category: 'detox',
  },
  {
    id: 'limba-scalp-peel',
    name: 'Пилинг-скраб для кожи головы Limba',
    description: 'Очищает кожу головы от себума и загрязнений, стимулирует фолликулы. 1 раз в неделю.',
    price_eur: PRICES.scalpPeel,
    image: '/images/limba/peeling.png',
    category: 'detox',
  },

  // ── Universal ──
  {
    id: 'limba-heat-protection',
    name: 'Спрей-термозащита Limba Protein',
    description: 'Защита от фена, утюжка и стайлера. Разглаживает и питает. Универсальный шаг для всех.',
    price_eur: PRICES.heatProtection,
    image: '/images/limba/thermo.png',
    category: 'universal',
  },
  {
    id: 'limba-glaze-cream',
    name: 'Крем-термозащита Limba Thermal Protection Glaze',
    description: 'Крем-термозащита перед сушкой: облегчает расчёсывание и укладку, защищает от термического и механического воздействия. Масла ши и кокоса, гидролизованный кератин и витамины для плотности и блеска без утяжеления.',
    price_eur: PRICES.glazeCream,
    image: '/images/limba/glaze_cream.png',
    category: 'universal',
  },
  {
    id: 'limba-mango-cream',
    name: 'Крем Limba Organic Line Mango',
    description: 'Несмываемый питательный крем на влажные волосы перед сушкой. Масла авокадо, манго и арган, гидролизаты и керамиды. Удерживает влагу, разглаживает, защищает от термо и механики, уменьшает пушение.',
    price_eur: PRICES.mangoCream,
    image: '/images/limba/mango.png',
    category: 'universal',
  },
  {
    id: 'limba-golden-hour',
    name: 'Спрей-финиш Limba Glance Golden Hour',
    description: 'Завершающий уход после укладки: блеск, гладкость, защита длины от пересушивания и пушения, более ухоженный вид волос.',
    price_eur: PRICES.goldenHour,
    image: '/images/limba/golden_thermo.jpg',
    category: 'universal',
  },
  {
    id: 'limba-peptide-mask',
    name: 'Пептидная маска Limba Instant Transformation',
    description: 'Пептидная маска (можно как несмываемый уход на влажные волосы): уплотняет поверхность волоса, приглаживает кутикулу, повышает прочность и создаёт тонкую защитную плёнку без перегруза тонкой структуры.',
    price_eur: PRICES.peptideMask,
    image: '/images/limba/mask_peptide.png',
    category: 'universal',
  },
]

export function getProductsByIds(ids: string[]): LimbaProduct[] {
  return ids
    .map((id) => LIMBA_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is LimbaProduct => Boolean(p))
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_RU[category as LimbaCategory] ?? category
}
