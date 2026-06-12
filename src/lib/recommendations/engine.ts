import { Diagnostic } from '../ai/diagnose';
import { buildProductIds, HEAT_PROTECTION_ADVICE } from './pick-products';
import { CATEGORY_INFO } from '@/config/limba-products';

interface QuizData {
  hair_type?: string;
  scalp_type?: string;
  main_concern?: string;
  wash_frequency?: string;
  heat_styling?: string;
  recent_treatments?: string[];
  budget_range?: string;
}

/** Minimal shape the engine needs from a catalog row. */
interface CatalogProduct {
  id: string;
  price_eur: number | string;
}

interface RecommendationResult {
  primary_category: 'color' | 'volume' | 'detox' | 'hydration';
  secondary_category?: 'color' | 'volume' | 'detox' | 'hydration';
  product_ids: string[];
  gift_ids: string[];
  reasoning_summary: string;
  reasoning_details: {
    why_primary: string;
    why_products: { product_id: string; reason: string }[];
  };
  pack_total_eur: number;
  estimated_savings_eur: number;
}

export async function calculateRecommendation(
  diagnostic: Diagnostic,
  quiz: QuizData | null,
  productsCatalog: CatalogProduct[]
): Promise<RecommendationResult> {

  // 1. Определяем primary category
  const primary = diagnostic.recommended_limba_category;
  const secondary = diagnostic.secondary_limba_category;

  // 2. Термозащита почти всегда (кроме редких случаев)
  const needsHeatProtection =
    quiz?.heat_styling !== 'never' ||
    diagnostic.main_issues.includes('breakage') ||
    diagnostic.main_issues.includes('split_ends') ||
    diagnostic.hair_classification.apparent_type === 'bleached';

  // 3. Пилинг кожи головы и детокс-шампунь если моют каждый день
  const needsDetox =
    quiz?.wash_frequency === 'daily' ||
    diagnostic.main_issues.includes('oily_scalp') ||
    primary === 'detox';

  // 4. Базовый pack (общая логика с care-страницей — pick-products.ts)
  const baseProductIds = buildProductIds(primary, secondary, {
    needsHeatProtection,
    needsDetox,
  });

  // 5. Подарки на основе issues
  const gifts: string[] = [];
  
  // термошапочка если нужна маска часто (сухость, ломкость)
  if (diagnostic.main_issues.includes('dryness') || 
      diagnostic.main_issues.includes('breakage')) {
    gifts.push('gift-thermo-cap');
  }
  
  // массажная щётка если жирные корни или detox
  if (diagnostic.main_issues.includes('oily_scalp') || 
      primary === 'detox') {
    gifts.push('gift-massage-brush');
  }
  
  // расчёска если ломкость или blond
  if (diagnostic.main_issues.includes('breakage') ||
      diagnostic.hair_classification.apparent_type === 'bleached') {
    gifts.push('gift-detangling-comb');
  }
  
  // 6. Считаем стоимость
  const products = productsCatalog.filter(p => baseProductIds.includes(p.id));
  const packTotal = products.reduce((sum, p) => sum + Number(p.price_eur), 0);
  
  // эстимейт экономии: если бы покупала по отдельности
  // в нашем случае это маркетинговый аргумент, поставь 10-15€
  const savings = Math.round(packTotal * 0.1);
  
  // 7. Формируем reasoning
  const whyPrimary = generateWhyPrimary(primary, diagnostic, quiz);

  const reasoningSummary = [
    `На основе твоего фото и ответов теста подходит линия Limba ${CATEGORY_INFO[primary].label}. ${whyPrimary}`,
    needsHeatProtection ? HEAT_PROTECTION_ADVICE : '',
  ]
    .filter(Boolean)
    .join(' ');
  
  const whyProducts = baseProductIds.map(id => ({
    product_id: id,
    reason: generateProductReason(id, diagnostic, quiz)
  }));
  
  return {
    primary_category: primary,
    secondary_category: secondary,
    product_ids: baseProductIds,
    gift_ids: gifts,
    reasoning_summary: reasoningSummary,
    reasoning_details: {
      why_primary: whyPrimary,
      why_products: whyProducts
    },
    pack_total_eur: packTotal,
    estimated_savings_eur: savings
  };
}

function generateWhyPrimary(
  category: string, 
  diagnostic: Diagnostic, 
  quiz: QuizData | null
): string {
  const reasons: Record<string, string[]> = {
    color: [
      'Видна потеря пигмента и тусклость на длине.',
      'Для окрашенных волос важно сохранить цвет и блеск.',
      'Эта линия минимизирует вымывание пигмента после мытья.'
    ],
    volume: [
      'Видна потеря плотности и объёма у корней.',
      'Эта линия не утяжеляет, добавляет лёгкости.',
      'Для тонких волос важно не перегружать структуру.'
    ],
    detox: [
      'Видны признаки накопления продуктов и тусклость.',
      'Эта линия глубоко очищает и обновляет.',
      'Подходит когда обычные средства перестали работать.'
    ],
    hydration: [
      'Видна сухость по длине и на кончиках.',
      'Эта линия восстанавливает водный баланс.',
      'Самая частая необходимость после блонда и термоукладки.'
    ]
  };
  
  return reasons[category]?.[0] || '';
}

function generateProductReason(
  productId: string,
  diagnostic: Diagnostic,
  quiz: QuizData | null
): string {
  if (productId.includes('shampoo')) return 'Очищение по типу твоих волос.';
  if (productId.includes('conditioner')) return 'Лёгкое восстановление после мытья.';
  if (productId.includes('mask')) return 'Глубокое восстановление 1-2 раза в неделю.';
  if (productId.includes('heat-protection')) return 'Защита от термоукладки.';
  return '';
}
