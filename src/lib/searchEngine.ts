import type {
  MarketplaceResult,
  ProductSearchResult,
  RatingCategory,
  RatingBreakdownFactor,
  ReviewSnippet,
} from '@/types';
import type { QuestionnaireAnswers } from '@/lib/questionnaire';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) | 0;
    return (state >>> 0) / 4294967296;
  };
}

interface MarketplaceTemplate {
  id: string;
  name: string;
  logo: string;
  color: string;
  basePriceMultiplier: number;
  url: string;
}

const MARKETPLACES: MarketplaceTemplate[] = [
  { id: 'amazon', name: 'Amazon', logo: 'a', color: 'from-blue-500 to-blue-700', basePriceMultiplier: 1.0, url: 'amazon.in' },
  { id: 'flipkart', name: 'Flipkart', logo: 'f', color: 'from-sky-400 to-blue-600', basePriceMultiplier: 0.97, url: 'flipkart.com' },
  { id: 'croma', name: 'Croma', logo: 'C', color: 'from-blue-600 to-indigo-500', basePriceMultiplier: 1.05, url: 'croma.com' },
  { id: 'reliance', name: 'Reliance Digital', logo: 'R', color: 'from-sky-500 to-blue-800', basePriceMultiplier: 1.03, url: 'reliancedigital.in' },
  { id: 'snapdeal', name: 'Snapdeal', logo: 'S', color: 'from-blue-400 to-sky-600', basePriceMultiplier: 0.92, url: 'snapdeal.com' },
  { id: 'tatacliq', name: 'Tata CLiQ', logo: 'T', color: 'from-blue-500 to-cyan-600', basePriceMultiplier: 1.01, url: 'tatacliq.com' },
];

const RATING_LABELS = [
  { label: 'Delivery Speed', icon: 'Truck', weight: 0.2 },
  { label: 'Packaging Quality', icon: 'Package', weight: 0.15 },
  { label: 'Product Authenticity', icon: 'BadgeCheck', weight: 0.25 },
  { label: 'Price Value', icon: 'Tag', weight: 0.2 },
  { label: 'Customer Service', icon: 'Headphones', weight: 0.1 },
  { label: 'Return Ease', icon: 'RotateCcw', weight: 0.1 },
];

const REVIEW_AUTHORS = [
  'Rahul S.', 'Priya M.', 'Amit K.', 'Sneha R.', 'Vikram P.',
  'Anjali D.', 'Karan J.', 'Neha G.', 'Rohit V.', 'Pooja B.',
  'Arjun N.', 'Divya L.', 'Sanjay T.', 'Meera H.', 'Aditya W.',
  'Farhan Q.', 'Ishita R.', 'Manish G.', 'Kavya N.', 'Yash B.',
];

const POSITIVE_REVIEWS = [
  'Genuine product, works perfectly. Highly recommend!',
  'Fast delivery, well packaged. Very happy!',
  'Great value for money. No issues at all.',
  'Original with warranty card. Perfect.',
  'Build quality is excellent. Exactly as described.',
  'Smooth transaction, quick delivery, authentic.',
  'Best price anywhere. Arrived in perfect condition.',
  'Very satisfied. Secure packaging, on-time delivery.',
  'Worth every rupee. No complaints after a month.',
  'Lightning fast delivery, 100% genuine product.',
];

const NEGATIVE_REVIEWS = [
  'Late delivery, product is fine though.',
  'Box was slightly damaged on arrival.',
  'Good product, slow customer service.',
  'Price dropped after I bought it.',
  'Seal was broken on the box.',
  'Return process was a hassle.',
  'Delivery took 8 days, too long.',
  'Packaging was poor, product okay.',
  'Called support 3 times to resolve issue.',
  'Return window too short, only 7 days.',
];

const NEUTRAL_REVIEWS = [
  'Does the job, nothing extraordinary.',
  'Average, works as expected.',
  'Fair value. Not the best, not the worst.',
  'Works fine for the price point.',
  'Does what it says. Average overall.',
];

const PROS_POOL = [
  'Genuine product with warranty',
  'Fast and tracked delivery',
  'Secure tamper-proof packaging',
  'Best price among competitors',
  'Easy 7-day returns',
  'Responsive customer support',
  'Cash on delivery available',
  'EMI options available',
  'High review count',
  'Verified seller badge',
];

const CONS_POOL = [
  'Slightly higher price',
  'Slower delivery in remote areas',
  'Limited stock',
  'No COD for this item',
  'Strict return window',
  'Packaging could be improved',
  'Customer support delays',
  'Price fluctuates often',
];

function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(rng() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function generateReviews(
  rng: () => number,
  starRating: number,
  count: number,
  marketplaceName: string
): ReviewSnippet[] {
  const reviews: ReviewSnippet[] = [];
  const positiveCount = Math.round(count * (starRating / 5) * 0.7);
  const negativeCount = Math.max(1, Math.round((5 - starRating) * 0.8));
  const neutralCount = Math.max(1, 3 - positiveCount - negativeCount);

  const pool: { text: string; rating: number; sentiment: 'positive' | 'neutral' | 'negative' }[] = [];
  for (let i = 0; i < positiveCount; i++) {
    pool.push({
      text: POSITIVE_REVIEWS[Math.floor(rng() * POSITIVE_REVIEWS.length)],
      rating: 4 + Math.round(rng()),
      sentiment: 'positive' as const,
    });
  }
  for (let i = 0; i < negativeCount; i++) {
    pool.push({
      text: NEGATIVE_REVIEWS[Math.floor(rng() * NEGATIVE_REVIEWS.length)],
      rating: 2 + Math.floor(rng() * 2),
      sentiment: 'negative' as const,
    });
  }
  for (let i = 0; i < neutralCount; i++) {
    pool.push({
      text: NEUTRAL_REVIEWS[Math.floor(rng() * NEUTRAL_REVIEWS.length)],
      rating: 3,
      sentiment: 'neutral' as const,
    });
  }

  const dates = ['2 days ago', '1 week ago', '2 weeks ago', '1 month ago', '3 months ago'];
  const numReviews = Math.min(pool.length, 3);
  for (let i = 0; i < numReviews; i++) {
    reviews.push({
      author: REVIEW_AUTHORS[Math.floor(rng() * REVIEW_AUTHORS.length)],
      text: pool[i].text,
      rating: pool[i].rating,
      date: dates[Math.floor(rng() * dates.length)],
      marketplace: marketplaceName,
      verified: rng() > 0.2,
      sentiment: pool[i].sentiment,
    });
  }
  return reviews;
}

function generateRatings(
  rng: () => number,
  marketIndex: number,
  deliveryDays: number,
  price: number,
  minPrice: number,
  maxPrice: number,
  reviewCount: number,
  starRating: number
): RatingCategory[] {
  return RATING_LABELS.map((label, catIdx) => {
    const base = 6 + rng() * 3.5;
    const marketBias = (marketIndex % 3) * 0.4;
    const score = Math.min(10, Math.max(3, base + marketBias - rng() * 1.5));
    const rounded = Math.round(score * 10) / 10;

    let detail = '';
    if (rounded >= 8.5) detail = 'Excellent';
    else if (rounded >= 7) detail = 'Very Good';
    else if (rounded >= 5.5) detail = 'Good';
    else if (rounded >= 4) detail = 'Average';
    else detail = 'Below Average';

    const breakdown = generateBreakdown(
      catIdx, rounded, rng, deliveryDays, price, minPrice, maxPrice, reviewCount, starRating
    );

    return {
      label: label.label,
      score: rounded,
      icon: label.icon,
      detail,
      weight: label.weight,
      breakdown,
    };
  });
}

function generateBreakdown(
  catIdx: number,
  score: number,
  rng: () => number,
  deliveryDays: number,
  price: number,
  minPrice: number,
  maxPrice: number,
  reviewCount: number,
  starRating: number
): RatingBreakdownFactor[] {
  switch (catIdx) {
    case 0: { // Delivery Speed
      const fastMentions = Math.floor(reviewCount * 0.35 * (score / 10));
      const slowMentions = Math.floor(reviewCount * 0.08 * ((10 - score) / 10));
      const onTimeRate = Math.round((score / 10) * 1000) / 10;
      return [
        { label: 'Avg delivery time', value: deliveryDays, unit: 'days', maxUnit: 7, contribution: (10 - deliveryDays) * 0.8, source: 'Shipping logs + review mentions' },
        { label: 'On-time delivery rate', value: onTimeRate, unit: '%', maxUnit: 100, contribution: (onTimeRate / 100) * 3, source: 'Carrier tracking data' },
        { label: 'Fast delivery mentions', value: fastMentions, unit: 'reviews', maxUnit: reviewCount, contribution: (fastMentions / reviewCount) * 10 * 2, source: 'NLP sentiment scan of reviews' },
        { label: 'Late delivery complaints', value: slowMentions, unit: 'reviews', maxUnit: reviewCount, contribution: -(slowMentions / reviewCount) * 10 * 2, source: 'NLP sentiment scan of reviews' },
      ];
    }
    case 1: { // Packaging Quality
      const goodPkg = Math.floor(reviewCount * 0.4 * (score / 10));
      const damagedPkg = Math.floor(reviewCount * 0.05 * ((10 - score) / 10));
      return [
        { label: 'Intact packaging reports', value: goodPkg, unit: 'reviews', maxUnit: reviewCount, contribution: (goodPkg / reviewCount) * 10 * 3, source: 'Review keyword analysis' },
        { label: 'Damaged box reports', value: damagedPkg, unit: 'reviews', maxUnit: reviewCount, contribution: -(damagedPkg / reviewCount) * 10 * 3, source: 'Review keyword analysis' },
        { label: 'Tamper-proof seal', value: score > 6 ? 1 : 0, unit: 'yes/no', maxUnit: 1, contribution: score > 6 ? 2 : -1, source: 'Seller verification' },
        { label: 'Protective fill material', value: score > 5 ? 1 : 0, unit: 'yes/no', maxUnit: 1, contribution: score > 5 ? 1.5 : 0, source: 'Unboxing review scan' },
      ];
    }
    case 2: { // Product Authenticity
      const genuineMentions = Math.floor(reviewCount * 0.45 * (score / 10));
      const fakeMentions = Math.floor(reviewCount * 0.03 * ((10 - score) / 10));
      return [
        { label: '"Genuine" mentions', value: genuineMentions, unit: 'reviews', maxUnit: reviewCount, contribution: (genuineMentions / reviewCount) * 10 * 3, source: 'NLP keyword scan' },
        { label: '"Fake/duplicate" reports', value: fakeMentions, unit: 'reviews', maxUnit: reviewCount, contribution: -(fakeMentions / reviewCount) * 10 * 4, source: 'NLP keyword scan' },
        { label: 'Warranty card included', value: score > 5 ? 1 : 0, unit: 'yes/no', maxUnit: 1, contribution: score > 5 ? 2 : 0, source: 'Review verification' },
        { label: 'Seller rating', value: Math.round(starRating * 10) / 10, unit: '/5', maxUnit: 5, contribution: (starRating / 5) * 2, source: 'Marketplace seller score' },
      ];
    }
    case 3: { // Price Value
      const priceRank = (maxPrice - price) / (maxPrice - minPrice || 1);
      const discountPct = Math.round(((maxPrice - price) / maxPrice) * 1000) / 10;
      return [
        { label: 'Price vs cheapest', value: price - minPrice, unit: 'Rs', maxUnit: maxPrice - minPrice, contribution: -((price - minPrice) / (maxPrice - minPrice || 1)) * 3, source: 'Cross-marketplace comparison' },
        { label: 'Discount vs MRP', value: discountPct, unit: '%', maxUnit: 50, contribution: (discountPct / 50) * 3, source: 'Listed price analysis' },
        { label: 'Price competitiveness rank', value: Math.round(priceRank * 10), unit: '/10', maxUnit: 10, contribution: priceRank * 3, source: 'Relative to 6 marketplaces' },
        { label: '"Value for money" mentions', value: Math.floor(reviewCount * 0.3 * (score / 10)), unit: 'reviews', maxUnit: reviewCount, contribution: (score / 10) * 1, source: 'NLP sentiment scan' },
      ];
    }
    case 4: { // Customer Service
      const helpful = Math.floor(reviewCount * 0.25 * (score / 10));
      const complaints = Math.floor(reviewCount * 0.1 * ((10 - score) / 10));
      return [
        { label: 'Positive support mentions', value: helpful, unit: 'reviews', maxUnit: reviewCount, contribution: (helpful / reviewCount) * 10 * 3, source: 'NLP sentiment scan' },
        { label: 'Support complaints', value: complaints, unit: 'reviews', maxUnit: reviewCount, contribution: -(complaints / reviewCount) * 10 * 3, source: 'NLP sentiment scan' },
        { label: 'Avg response time', value: Math.round((10 - score) * 0.5 * 10) / 10, unit: 'hrs', maxUnit: 24, contribution: -((10 - score) / 10) * 2, source: 'Support ticket analysis' },
        { label: 'Resolution rate', value: Math.round((score / 10) * 1000) / 10, unit: '%', maxUnit: 100, contribution: (score / 10) * 2, source: 'Ticket closure data' },
      ];
    }
    case 5: { // Return Ease
      const easyReturns = Math.floor(reviewCount * 0.2 * (score / 10));
      const returnIssues = Math.floor(reviewCount * 0.06 * ((10 - score) / 10));
      return [
        { label: 'Return window', value: score > 6 ? 10 : 7, unit: 'days', maxUnit: 15, contribution: (score > 6 ? 10 : 7) / 15 * 3, source: 'Seller policy' },
        { label: 'Easy return mentions', value: easyReturns, unit: 'reviews', maxUnit: reviewCount, contribution: (easyReturns / reviewCount) * 10 * 2, source: 'NLP sentiment scan' },
        { label: 'Return complaints', value: returnIssues, unit: 'reviews', maxUnit: reviewCount, contribution: -(returnIssues / reviewCount) * 10 * 3, source: 'NLP sentiment scan' },
        { label: 'Pickup service', value: score > 5 ? 1 : 0, unit: 'yes/no', maxUnit: 1, contribution: score > 5 ? 2 : 0, source: 'Seller policy verification' },
      ];
    }
    default:
      return [];
  }
}

function computeOverallScore(ratings: RatingCategory[]): number {
  let total = 0;
  ratings.forEach((r) => {
    total += r.score * r.weight;
  });
  return Math.round(total * 10) / 10;
}

interface ProductCatalogItem {
  name: string;
  model: string;
  basePrice: number;
}

const PRODUCT_CATALOG: Record<string, { brand: string; items: ProductCatalogItem[] }> = {
  Smartphone: {
    brand: 'brand',
    items: [
      { name: 'iPhone 15 Pro 256GB', model: 'A3101', basePrice: 134900 },
      { name: 'iPhone 15 128GB', model: 'A3092', basePrice: 79900 },
      { name: 'Samsung Galaxy S24 Ultra', model: 'SM-S928B', basePrice: 129999 },
      { name: 'Samsung Galaxy S24 5G', model: 'SM-S921B', basePrice: 74999 },
      { name: 'OnePlus 12 256GB', model: 'CPH2581', basePrice: 64999 },
      { name: 'OnePlus 12R 256GB', model: 'CPH2611', basePrice: 39999 },
      { name: 'Xiaomi 14 256GB', model: '23127PN0CC', basePrice: 69999 },
      { name: 'Redmi Note 13 Pro', model: '2312DRA50I', basePrice: 24999 },
      { name: 'Google Pixel 8 Pro', model: 'GP8P', basePrice: 106999 },
      { name: 'Nothing Phone 2a', model: 'A142', basePrice: 25999 },
      { name: 'Motorola Edge 50 Pro', model: 'XT2401', basePrice: 31999 },
      { name: 'Samsung Galaxy A55', model: 'SM-A556E', basePrice: 39999 },
      { name: 'iQOO Neo 9 Pro', model: 'I2302', basePrice: 35999 },
      { name: 'Realme 12 Pro+ 5G', model: 'RMX3996', basePrice: 29999 },
    ],
  },
  Laptop: {
    brand: 'brand',
    items: [
      { name: 'Dell XPS 13 9320', model: 'XPS9320', basePrice: 99990 },
      { name: 'HP Pavilion x360', model: '14-ek1010TU', basePrice: 67990 },
      { name: 'Lenovo ThinkPad E14', model: '21E3S0EJ00', basePrice: 72990 },
      { name: 'ASUS ROG Strix G16', model: 'G614JV', basePrice: 129990 },
      { name: 'MacBook Air M3 13"', model: 'MRXN3HN/A', basePrice: 114900 },
      { name: 'Acer Aspire Lite', model: 'AL15-41', basePrice: 28990 },
      { name: 'MSI Modern 15', model: 'B13M-205IN', basePrice: 45990 },
      { name: 'ASUS Vivobook 16', model: 'X1605ZA', basePrice: 39990 },
      { name: 'HP Victus 16', model: 'R0160AX', basePrice: 79990 },
      { name: 'Lenovo IdeaPad Slim 3', model: '15ITL6', basePrice: 34990 },
    ],
  },
  Audio: {
    brand: 'type',
    items: [
      { name: 'Sony WH-1000XM5', model: 'WH1000XM5', basePrice: 29990 },
      { name: 'Bose QuietComfort Ultra', model: 'QCULTRA', basePrice: 37900 },
      { name: 'Apple AirPods Pro 2', model: 'MTJV3HN/A', basePrice: 24900 },
      { name: 'Samsung Galaxy Buds2 Pro', model: 'SM-R510', basePrice: 19999 },
      { name: 'boAt Airdopes 161', model: 'AD161', basePrice: 1299 },
      { name: 'JBL Tune 770NC', model: 'JBLT770NC', basePrice: 7999 },
      { name: 'Noise Buds VS104', model: 'BVS104', basePrice: 999 },
      { name: 'Sony WF-C700N', model: 'WFC700N', basePrice: 7990 },
      { name: 'boAt Stone 1200 Speaker', model: 'ST1200', basePrice: 2999 },
      { name: 'JBL Flip 6 Speaker', model: 'JBLFLIP6', basePrice: 8999 },
    ],
  },
  Wearable: {
    brand: 'brand',
    items: [
      { name: 'Apple Watch Series 9', model: 'A2980', basePrice: 41900 },
      { name: 'Samsung Galaxy Watch 6', model: 'SM-R930', basePrice: 29999 },
      { name: 'Noise ColorFit Pro 5', model: 'CFP5', basePrice: 3999 },
      { name: 'Fire-Boltt Phoenix Pro', model: 'FBPP', basePrice: 1799 },
      { name: 'boAt Wave Call 2', model: 'WC2', basePrice: 1799 },
      { name: 'Fitbit Charge 6', model: 'FBCH6', basePrice: 13999 },
      { name: 'Noise Fit Endeavor', model: 'NFE', basePrice: 4999 },
      { name: 'Amazfit GTS 4 Mini', model: 'GTS4MINI', basePrice: 6999 },
    ],
  },
  Electronics: {
    brand: 'size',
    items: [
      { name: 'Samsung 32" Smart TV', model: 'UA32T4340BKXXL', basePrice: 14999 },
      { name: 'LG 43" 4K UHD TV', model: '43UR7500PSC', basePrice: 31999 },
      { name: 'Sony Bravia 55" 4K', model: 'KD-55X75L', basePrice: 69900 },
      { name: 'Samsung 55" QLED TV', model: 'QA55Q60CAGLXL', basePrice: 79990 },
      { name: 'LG 65" OLED TV', model: 'OLED65C3PSA', basePrice: 189990 },
      { name: 'Mi 50" Smart TV 5A', model: 'L50M7-EA', basePrice: 27999 },
      { name: 'OnePlus 65" TV U1S', model: '65U1S', basePrice: 59999 },
      { name: 'TCL 43" 4K TV', model: '43P615', basePrice: 24999 },
    ],
  },
  Camera: {
    brand: 'type',
    items: [
      { name: 'Canon EOS R50', model: 'EOSR50', basePrice: 67995 },
      { name: 'Nikon Z30', model: 'Z30', basePrice: 59950 },
      { name: 'Sony Alpha A6400', model: 'ILCE6400', basePrice: 84990 },
      { name: 'Fujifilm X-T30 II', model: 'XT30II', basePrice: 84999 },
      { name: 'GoPro Hero 12 Black', model: 'CHDHX-121', basePrice: 45000 },
      { name: 'Canon EOS 200D II', model: 'EOS200DII', basePrice: 49995 },
      { name: 'Sony ZV-1F Vlog Camera', model: 'ZV1F', basePrice: 42990 },
      { name: 'Nikon D5600', model: 'D5600', basePrice: 54950 },
    ],
  },
  Footwear: {
    brand: 'type',
    items: [
      { name: 'Nike Air Zoom Pegasus 40', model: 'DD9281', basePrice: 10995 },
      { name: 'Adidas Ultraboost 22', model: 'GY4981', basePrice: 17999 },
      { name: 'Puma RS-X Classic', model: '372624', basePrice: 4999 },
      { name: 'Nike Revader Run', model: 'CW3298', basePrice: 3295 },
      { name: 'Adidas Duramo 10', model: 'GW4085', basePrice: 3999 },
      { name: 'New Balance 574', model: 'ML574EVG', basePrice: 5999 },
      { name: 'Skechers Go Walk', model: 'GO40041', basePrice: 3999 },
      { name: 'Woodland Leather Boots', model: 'GBP266', basePrice: 4995 },
    ],
  },
  Accessories: {
    brand: 'type',
    items: [
      { name: 'American Tourister Backpack 32L', model: 'AT32L', basePrice: 1799 },
      { name: 'HP Polyester Laptop Bag', model: 'HPLB15', basePrice: 999 },
      { name: 'Skybags Trooper Suitcase', model: 'TRO55', basePrice: 3499 },
      { name: 'Wildcraft Trailhead 30L', model: 'WH30L', basePrice: 2295 },
      { name: 'Tommy Hilfiger Handbag', model: 'THHB01', basePrice: 5999 },
      { name: 'Samsonite Cosmolite 55cm', model: 'COS55', basePrice: 19999 },
      { name: 'F Gear Canvas Laptop Bag', model: 'FGLB22', basePrice: 1299 },
    ],
  },
};

const BRAND_MAP: Record<string, string[]> = {
  apple: ['iPhone', 'MacBook', 'Apple Watch', 'AirPods'],
  samsung: ['Samsung Galaxy'],
  oneplus: ['OnePlus'],
  xiaomi: ['Xiaomi', 'Redmi'],
  google: ['Google Pixel'],
  nothing: ['Nothing'],
  motorola: ['Motorola'],
  dell: ['Dell'],
  hp: ['HP'],
  lenovo: ['Lenovo'],
  asus: ['ASUS'],
  acer: ['Acer'],
  msi: ['MSI'],
  noise: ['Noise'],
  fireboltt: ['Fire-Boltt'],
  boat: ['boAt'],
  fitbit: ['Fitbit'],
  nike: ['Nike'],
  adidas: ['Adidas'],
  puma: ['Puma'],
  'new balance': ['New Balance'],
  skechers: ['Skechers'],
};

function pickProductsForCategory(
  category: string,
  answers: QuestionnaireAnswers | undefined,
  rng: () => number
): ProductCatalogItem[] {
  const catalog = PRODUCT_CATALOG[category];
  if (!catalog) return [];

  let items = [...catalog.items];

  // Filter by brand preference
  const brandAnswer = answers?.brand as string | undefined;
  if (brandAnswer && brandAnswer !== 'any' && BRAND_MAP[brandAnswer]) {
    const brandKeywords = BRAND_MAP[brandAnswer];
    const filtered = items.filter((item) =>
      brandKeywords.some((kw) => item.name.toLowerCase().includes(kw.toLowerCase()))
    );
    if (filtered.length > 0) items = filtered;
  }

  // Filter by type preference (for audio, camera, footwear, accessories)
  const typeAnswer = answers?.type as string | undefined;
  if (typeAnswer && typeAnswer !== 'any') {
    const typeFilters: Record<string, string[]> = {
      earbuds: ['AirPods', 'Airdopes', 'Buds', 'WF-'],
      headphones: ['WH-', 'QuietComfort', 'Tune'],
      speaker: ['Speaker', 'Flip', 'Stone'],
      wired: ['wired'],
      dslr: ['EOS', 'D5600'],
      mirrorless: ['R50', 'Z30', 'A6400', 'X-T30', 'ZV-1'],
      compact: ['ZV-1'],
      action: ['GoPro'],
      running: ['Pegasus', 'Ultraboost', 'Duramo', 'Revader'],
      casual: ['RS-X', '574', 'Go Walk'],
      formal: ['Woodland'],
      sports: ['Pegasus', 'Ultraboost'],
      boots: ['Woodland'],
      backpack: ['Backpack', 'Trailhead'],
      'laptop-bag': ['Laptop Bag'],
      luggage: ['Suitcase', 'Cosmolite'],
      handbag: ['Handbag'],
    };
    const filterKeywords = typeFilters[typeAnswer];
    if (filterKeywords) {
      const filtered = items.filter((item) =>
        filterKeywords.some((kw) => item.name.toLowerCase().includes(kw.toLowerCase()))
      );
      if (filtered.length > 0) items = filtered;
    }
  }

  // Filter by budget
  const budgetAnswer = answers?.budget as number | undefined;
  if (budgetAnswer && typeof budgetAnswer === 'number') {
    const filtered = items.filter((item) => item.basePrice <= budgetAnswer);
    if (filtered.length > 0) {
      items = filtered;
    } else {
      // If nothing under budget, find closest ones
      items.sort((a, b) => a.basePrice - b.basePrice);
      items = items.slice(0, 4);
    }
  }

  // Shuffle and pick up to 4 products
  const shuffled = pickN(items, Math.min(4, items.length), rng);
  return shuffled.length > 0 ? shuffled : items.slice(0, 4);
}

function generateUsageInsights(usage: string | undefined): { pros: string[]; cons: string[] } {
  const USAGE_PROS: Record<string, string[]> = {
    gaming: ['High refresh rate display', 'Powerful processor for gaming', 'Good thermal management'],
    camera: ['Excellent camera system', 'Advanced computational photography', 'OIS + EIS stabilization'],
    casual: ['Good battery life', 'Lightweight design', 'Easy to use interface'],
    business: ['Premium build quality', 'Long battery life', 'Security features included'],
    social: ['Great front camera', 'Good social media optimization', 'Stylish design'],
    programming: ['Fast SSD storage', '16GB+ RAM options', 'Comfortable keyboard'],
    office: ['Lightweight for commute', 'Good battery backup', 'Office-ready performance'],
    creative: ['Color-accurate display', 'Powerful GPU for rendering', 'Wide storage options'],
    music: ['Excellent bass response', 'Active noise cancellation', 'Long battery life'],
    calls: ['Clear microphone quality', 'Noise reduction in calls', 'Comfortable for long calls'],
    workout: ['Sweat resistance', 'Secure fit design', 'Lightweight for exercise'],
    fitness: ['Accurate step tracking', 'Heart rate monitor', 'Multiple workout modes'],
    health: ['SpO2 monitoring', '24/7 heart rate tracking', 'Sleep tracking'],
    calling: ['Built-in calling feature', 'Bluetooth calling support', 'Dial pad on watch'],
    battery: ['7+ day battery life', 'Fast charging support', 'Low power mode'],
    style: ['Premium watch faces', 'Metallic finish', 'Customizable straps'],
    movies: ['4K HDR support', 'Dolby Vision', 'Wide color gamut'],
    sports: ['120Hz refresh rate', 'Low motion blur', 'Sports mode optimization'],
    daily: ['Comfortable for all-day wear', 'Breathable material', 'Durable sole'],
    gym: ['Good grip', 'Breathable upper', 'Shock absorption'],
    outdoor: ['Rugged build', 'Water resistant', 'Ankle support'],
    beginner: ['Easy to use controls', 'Auto mode available', 'Lightweight body'],
    hobbyist: ['Manual controls available', 'Good sensor size', 'Interchangeable lens'],
    pro: ['Professional grade sensor', 'Weather sealed body', 'Dual card slots'],
    creator: ['4K video recording', 'Flip screen for vlogging', 'Fast autofocus'],
  };

  const USAGE_CONS: Record<string, string[]> = {
    gaming: ['May heat during extended sessions', 'Heavy for one-hand use'],
    camera: ['Higher price for camera features', 'Storage fills quickly with photos'],
    casual: ['Not for power users', 'Basic camera performance'],
    business: ['Premium pricing', 'Limited customization options'],
    programming: ['Can get warm under load', 'Fan noise under heavy compile'],
    creative: ['Expensive for full specs', 'Heavy for travel'],
  };

  return {
    pros: USAGE_PROS[usage || ''] || [],
    cons: USAGE_CONS[usage || ''] || [],
  };
}

export function searchProduct(
  query: string,
  answers?: QuestionnaireAnswers,
  category?: string
): ProductSearchResult {
  const trimmed = query.trim();
  const seedStr = answers
    ? trimmed + JSON.stringify(answers)
    : trimmed;
  const seed = hashString(seedStr.toLowerCase());
  const rng = seededRandom(seed);

  const parts = trimmed.split(/\s+/);
  const modelMatch = trimmed.match(/[A-Z0-9]{3,}[-/]?\d{2,}/i);
  const detectedCategory = category || detectCategory(trimmed);

  // If we have questionnaire answers, pick real products from catalog
  let productName: string;
  let modelNumber: string;
  let basePrice: number;
  let usageInsights: { pros: string[]; cons: string[] };

  if (answers && detectedCategory && PRODUCT_CATALOG[detectedCategory]) {
    const products = pickProductsForCategory(detectedCategory, answers, rng);
    if (products.length > 0) {
      // Use the first product as the "primary" one for naming
      productName = products[0].name;
      modelNumber = products[0].model;
      basePrice = products[0].basePrice;
    } else {
      productName = trimmed;
      modelNumber = modelMatch ? modelMatch[0] : parts[parts.length - 1] || '';
      basePrice = 3000 + Math.floor(rng() * 47000);
    }
    usageInsights = generateUsageInsights(answers.usage as string | undefined);
  } else {
    // Direct search — no questionnaire
    productName = modelMatch
      ? trimmed.replace(modelMatch[0], '').trim() || trimmed
      : trimmed;
    modelNumber = modelMatch ? modelMatch[0] : parts[parts.length - 1] || '';
    basePrice = 3000 + Math.floor(rng() * 47000);
    usageInsights = { pros: [], cons: [] };
  }

  const tempResults = MARKETPLACES.map((mp) => {
    const priceVariation = 0.9 + rng() * 0.2;
    const price = Math.round((basePrice * mp.basePriceMultiplier * priceVariation) / 10) * 10;
    const originalPrice = Math.round(price * (1.1 + rng() * 0.2));
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    const starRating = Math.round((3.2 + rng() * 1.6) * 10) / 10;
    const reviewCount = Math.floor(50 + rng() * 9500);
    const deliveryDays = 1 + Math.floor(rng() * 6);
    return { mp, price, originalPrice, discount, starRating, reviewCount, deliveryDays };
  });

  const prices = tempResults.map((r) => r.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const results: MarketplaceResult[] = tempResults.map((t, index) => {
    const ratings = generateRatings(
      rng, index, t.deliveryDays, t.price, minPrice, maxPrice, t.reviewCount, t.starRating
    );
    const overallScore = computeOverallScore(ratings);
    const deliveryText = `${t.deliveryDays} days`;

    // Merge usage-specific pros/cons with generic ones
    let pros = pickN(PROS_POOL, 2 + Math.floor(rng() * 2), rng);
    if (usageInsights.pros.length > 0) {
      pros = [...pickN(usageInsights.pros, Math.min(2, usageInsights.pros.length), rng), ...pros].slice(0, 5);
    }

    let cons = pickN(CONS_POOL, 1 + Math.floor(rng() * 2), rng);
    if (usageInsights.cons.length > 0) {
      cons = [...pickN(usageInsights.cons, Math.min(1, usageInsights.cons.length), rng), ...cons].slice(0, 3);
    }

    const reviews = generateReviews(rng, t.starRating, t.reviewCount, t.mp.name);

    return {
      id: t.mp.id,
      name: t.mp.name,
      logo: t.mp.logo,
      color: t.mp.color,
      price: t.price,
      originalPrice: t.originalPrice,
      discount: t.discount,
      currency: 'Rs',
      starRating: t.starRating,
      reviewCount: t.reviewCount,
      deliveryDays: deliveryText,
      ratings,
      pros,
      cons,
      reviews,
      inStock: rng() > 0.12,
      url: t.mp.url,
      overallScore,
    };
  });

  results.sort((a, b) => b.overallScore - a.overallScore);
  const bestPick = results[0];

  const avgRating =
    Math.round((results.reduce((sum, r) => sum + r.starRating, 0) / results.length) * 10) / 10;

  const summary = generateSummary(productName, bestPick, minPrice, maxPrice, avgRating);

  return {
    query: trimmed,
    productName,
    modelNumber,
    category: detectedCategory || 'Product',
    results,
    bestPick,
    summary,
    priceRange: { min: minPrice, max: maxPrice },
    averageRating: avgRating,
  };
}

function detectCategory(query: string): string {
  const q = query.toLowerCase();
  if (/phone|mobile|smartphone|iphone|samsung|oneplus|xiaomi|redmi|pixel/.test(q)) return 'Smartphone';
  if (/laptop|notebook|macbook|dell|hp|asus|lenovo|acer|msi/.test(q)) return 'Laptop';
  if (/headphone|earbud|earphone|airpod|speaker|sound|audio|airdopes/.test(q)) return 'Audio';
  if (/watch|smartwatch|band/.test(q)) return 'Wearable';
  if (/tv|television|monitor|display/.test(q)) return 'Electronics';
  if (/camera|lens|dslr|mirrorless|gopro/.test(q)) return 'Camera';
  if (/shoe|sneaker|footwear|boot|nike|adidas/.test(q)) return 'Footwear';
  if (/bag|backpack|luggage|handbag/.test(q)) return 'Accessories';
  return 'Product';
}

function generateSummary(
  productName: string,
  bestPick: MarketplaceResult,
  minPrice: number,
  maxPrice: number,
  avgRating: number
): string {
  const savings = Math.round(((maxPrice - bestPick.price) / maxPrice) * 100);
  return `After analyzing reviews across 6 major marketplaces for "${productName}", ${bestPick.name} emerges as the top pick with an overall score of ${bestPick.overallScore}/10. It excels in product authenticity and delivery speed, with ${bestPick.reviewCount.toLocaleString()} verified reviews averaging ${bestPick.starRating} stars. Prices range from Rs ${minPrice.toLocaleString()} to Rs ${maxPrice.toLocaleString()} — choosing ${bestPick.name} saves you up to ${savings}% compared to the most expensive option.`;
}
