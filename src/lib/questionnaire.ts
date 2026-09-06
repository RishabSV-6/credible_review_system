export type AnswerValue = string | number;

export interface QuestionOption {
  label: string;
  value: AnswerValue;
}

export interface CategoryQuestion {
  id: string;
  label: string;
  type: 'choice' | 'range';
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

export interface CategoryConfig {
  category: string;
  title: string;
  description: string;
  questions: CategoryQuestion[];
}

export type QuestionnaireAnswers = Record<string, AnswerValue>;

export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  Smartphone: {
    category: 'Smartphone',
    title: 'Tell us about your phone needs',
    description: 'Help us find the best smartphone for you across all marketplaces',
    questions: [
      {
        id: 'brand',
        label: 'Which brand do you prefer?',
        type: 'choice',
        options: [
          { label: 'Any brand', value: 'any' },
          { label: 'Apple', value: 'apple' },
          { label: 'Samsung', value: 'samsung' },
          { label: 'OnePlus', value: 'oneplus' },
          { label: 'Xiaomi', value: 'xiaomi' },
          { label: 'Google', value: 'google' },
          { label: 'Nothing', value: 'nothing' },
          { label: 'Motorola', value: 'motorola' },
        ],
      },
      {
        id: 'budget',
        label: 'What is your budget?',
        type: 'choice',
        options: [
          { label: 'Under Rs 15,000', value: 15000 },
          { label: 'Rs 15,000 - 30,000', value: 30000 },
          { label: 'Rs 30,000 - 50,000', value: 50000 },
          { label: 'Rs 50,000 - 80,000', value: 80000 },
          { label: 'Above Rs 80,000', value: 120000 },
        ],
      },
      {
        id: 'usage',
        label: 'What is your primary use?',
        type: 'choice',
        options: [
          { label: 'Gaming', value: 'gaming' },
          { label: 'Photography', value: 'camera' },
          { label: 'Everyday use', value: 'casual' },
          { label: 'Business / Work', value: 'business' },
          { label: 'Social media', value: 'social' },
        ],
      },
    ],
  },
  Laptop: {
    category: 'Laptop',
    title: 'Tell us about your laptop needs',
    description: 'Help us find the best laptop for you across all marketplaces',
    questions: [
      {
        id: 'brand',
        label: 'Which brand do you prefer?',
        type: 'choice',
        options: [
          { label: 'Any brand', value: 'any' },
          { label: 'Dell', value: 'dell' },
          { label: 'HP', value: 'hp' },
          { label: 'Lenovo', value: 'lenovo' },
          { label: 'ASUS', value: 'asus' },
          { label: 'Apple', value: 'apple' },
          { label: 'Acer', value: 'acer' },
          { label: 'MSI', value: 'msi' },
        ],
      },
      {
        id: 'budget',
        label: 'What is your budget?',
        type: 'choice',
        options: [
          { label: 'Under Rs 30,000', value: 30000 },
          { label: 'Rs 30,000 - 60,000', value: 60000 },
          { label: 'Rs 60,000 - 1,00,000', value: 100000 },
          { label: 'Above Rs 1,00,000', value: 150000 },
        ],
      },
      {
        id: 'usage',
        label: 'What will you use it for?',
        type: 'choice',
        options: [
          { label: 'Gaming', value: 'gaming' },
          { label: 'Programming / Dev', value: 'programming' },
          { label: 'Office / Studies', value: 'office' },
          { label: 'Content creation', value: 'creative' },
          { label: 'Everyday use', value: 'casual' },
        ],
      },
    ],
  },
  Audio: {
    category: 'Audio',
    title: 'Tell us about your audio needs',
    description: 'Help us find the best audio device for you across all marketplaces',
    questions: [
      {
        id: 'type',
        label: 'What type of audio device?',
        type: 'choice',
        options: [
          { label: 'Wireless earbuds', value: 'earbuds' },
          { label: 'Over-ear headphones', value: 'headphones' },
          { label: 'Bluetooth speaker', value: 'speaker' },
          { label: 'Wired earphones', value: 'wired' },
          { label: 'Any type', value: 'any' },
        ],
      },
      {
        id: 'budget',
        label: 'What is your budget?',
        type: 'choice',
        options: [
          { label: 'Under Rs 1,500', value: 1500 },
          { label: 'Rs 1,500 - 5,000', value: 5000 },
          { label: 'Rs 5,000 - 15,000', value: 15000 },
          { label: 'Above Rs 15,000', value: 30000 },
        ],
      },
      {
        id: 'usage',
        label: 'What is your primary use?',
        type: 'choice',
        options: [
          { label: 'Music listening', value: 'music' },
          { label: 'Gaming', value: 'gaming' },
          { label: 'Work calls', value: 'calls' },
          { label: 'Workout / Sports', value: 'workout' },
          { label: 'Everyday use', value: 'casual' },
        ],
      },
    ],
  },
  Wearable: {
    category: 'Wearable',
    title: 'Tell us about your wearable needs',
    description: 'Help us find the best smartwatch for you across all marketplaces',
    questions: [
      {
        id: 'brand',
        label: 'Which brand do you prefer?',
        type: 'choice',
        options: [
          { label: 'Any brand', value: 'any' },
          { label: 'Apple Watch', value: 'apple' },
          { label: 'Samsung Galaxy Watch', value: 'samsung' },
          { label: 'Noise', value: 'noise' },
          { label: 'Fire-Boltt', value: 'fireboltt' },
          { label: 'boAt', value: 'boat' },
          { label: 'Fitbit', value: 'fitbit' },
        ],
      },
      {
        id: 'budget',
        label: 'What is your budget?',
        type: 'choice',
        options: [
          { label: 'Under Rs 2,000', value: 2000 },
          { label: 'Rs 2,000 - 5,000', value: 5000 },
          { label: 'Rs 5,000 - 15,000', value: 15000 },
          { label: 'Above Rs 15,000', value: 30000 },
        ],
      },
      {
        id: 'features',
        label: 'What features matter most?',
        type: 'choice',
        options: [
          { label: 'Fitness tracking', value: 'fitness' },
          { label: 'Heart rate + SpO2', value: 'health' },
          { label: 'Calling feature', value: 'calling' },
          { label: 'Long battery life', value: 'battery' },
          { label: 'Style / Looks', value: 'style' },
        ],
      },
    ],
  },
  Electronics: {
    category: 'Electronics',
    title: 'Tell us about your TV / display needs',
    description: 'Help us find the best option for you across all marketplaces',
    questions: [
      {
        id: 'size',
        label: 'What size do you need?',
        type: 'choice',
        options: [
          { label: '32 inch', value: 32 },
          { label: '43 inch', value: 43 },
          { label: '50-55 inch', value: 55 },
          { label: '65 inch+', value: 65 },
          { label: 'Any size', value: 0 },
        ],
      },
      {
        id: 'budget',
        label: 'What is your budget?',
        type: 'choice',
        options: [
          { label: 'Under Rs 20,000', value: 20000 },
          { label: 'Rs 20,000 - 50,000', value: 50000 },
          { label: 'Rs 50,000 - 1,00,000', value: 100000 },
          { label: 'Above Rs 1,00,000', value: 200000 },
        ],
      },
      {
        id: 'usage',
        label: 'What is your primary use?',
        type: 'choice',
        options: [
          { label: 'Gaming', value: 'gaming' },
          { label: 'Movies / Streaming', value: 'movies' },
          { label: 'Sports', value: 'sports' },
          { label: 'Everyday TV', value: 'casual' },
        ],
      },
    ],
  },
  Camera: {
    category: 'Camera',
    title: 'Tell us about your camera needs',
    description: 'Help us find the best camera for you across all marketplaces',
    questions: [
      {
        id: 'type',
        label: 'What type of camera?',
        type: 'choice',
        options: [
          { label: 'DSLR', value: 'dslr' },
          { label: 'Mirrorless', value: 'mirrorless' },
          { label: 'Point & shoot', value: 'compact' },
          { label: 'Action camera', value: 'action' },
          { label: 'Any type', value: 'any' },
        ],
      },
      {
        id: 'budget',
        label: 'What is your budget?',
        type: 'choice',
        options: [
          { label: 'Under Rs 30,000', value: 30000 },
          { label: 'Rs 30,000 - 70,000', value: 70000 },
          { label: 'Rs 70,000 - 1,50,000', value: 150000 },
          { label: 'Above Rs 1,50,000', value: 300000 },
        ],
      },
      {
        id: 'usage',
        label: 'What is your skill level?',
        type: 'choice',
        options: [
          { label: 'Beginner', value: 'beginner' },
          { label: 'Hobbyist', value: 'hobbyist' },
          { label: 'Professional', value: 'pro' },
          { label: 'Content creator', value: 'creator' },
        ],
      },
    ],
  },
  Footwear: {
    category: 'Footwear',
    title: 'Tell us about your footwear needs',
    description: 'Help us find the best shoes for you across all marketplaces',
    questions: [
      {
        id: 'type',
        label: 'What type of footwear?',
        type: 'choice',
        options: [
          { label: 'Running shoes', value: 'running' },
          { label: 'Casual sneakers', value: 'casual' },
          { label: 'Formal shoes', value: 'formal' },
          { label: 'Sports shoes', value: 'sports' },
          { label: 'Boots', value: 'boots' },
        ],
      },
      {
        id: 'budget',
        label: 'What is your budget?',
        type: 'choice',
        options: [
          { label: 'Under Rs 1,500', value: 1500 },
          { label: 'Rs 1,500 - 3,000', value: 3000 },
          { label: 'Rs 3,000 - 7,000', value: 7000 },
          { label: 'Above Rs 7,000', value: 15000 },
        ],
      },
      {
        id: 'usage',
        label: 'What is your primary use?',
        type: 'choice',
        options: [
          { label: 'Daily wear', value: 'daily' },
          { label: 'Gym / Workout', value: 'gym' },
          { label: 'Office', value: 'office' },
          { label: 'Outdoor / Trekking', value: 'outdoor' },
        ],
      },
    ],
  },
  Accessories: {
    category: 'Accessories',
    title: 'Tell us about your accessory needs',
    description: 'Help us find the best option for you across all marketplaces',
    questions: [
      {
        id: 'type',
        label: 'What type of accessory?',
        type: 'choice',
        options: [
          { label: 'Backpack', value: 'backpack' },
          { label: 'Laptop bag', value: 'laptop-bag' },
          { label: 'Travel luggage', value: 'luggage' },
          { label: 'Handbag', value: 'handbag' },
          { label: 'Any type', value: 'any' },
        ],
      },
      {
        id: 'budget',
        label: 'What is your budget?',
        type: 'choice',
        options: [
          { label: 'Under Rs 1,000', value: 1000 },
          { label: 'Rs 1,000 - 3,000', value: 3000 },
          { label: 'Rs 3,000 - 7,000', value: 7000 },
          { label: 'Above Rs 7,000', value: 15000 },
        ],
      },
    ],
  },
};

// Keywords that trigger the questionnaire — broad/generic terms without a specific model
const BROAD_KEYWORDS: Record<string, string[]> = {
  Smartphone: ['phone', 'mobile', 'smartphone', 'mobile phone'],
  Laptop: ['laptop', 'notebook', 'computer', 'pc'],
  Audio: ['headphone', 'headphones', 'earphone', 'earphones', 'earbud', 'earbuds', 'airpod', 'airpods', 'speaker', 'speakers', 'sound', 'audio'],
  Wearable: ['watch', 'smartwatch', 'smart watch', 'band', 'fitness band', 'wearable'],
  Electronics: ['tv', 'television', 'monitor', 'display'],
  Camera: ['camera', 'dslr', 'mirrorless'],
  Footwear: ['shoe', 'shoes', 'sneaker', 'sneakers', 'footwear', 'boot', 'boots'],
  Accessories: ['bag', 'backpack', 'luggage', 'handbag', 'accessory', 'accessories'],
};

// Specific model patterns that should NOT trigger the questionnaire
const SPECIFIC_PATTERNS = [
  /\b[A-Z]{2,}\s?\d{2,}\b/i, // e.g. "iPhone 15", "Galaxy S24"
  /\b\d{3,}\b/, // e.g. "WH-1000", "Airdopes 161"
  /\b(pro|max|ultra|plus|mini|lite|air|nova|edge)\b/i,
  /\b(iphone|galaxy|oneplus|macbook|xps|thinkpad|wh-|airpods?|rolex)\b/i,
];

export function detectCategory(query: string): string | null {
  const q = query.toLowerCase().trim();

  // If it contains a specific model pattern, it's specific enough
  if (SPECIFIC_PATTERNS.some((p) => p.test(q))) {
    return null;
  }

  // Check if the query is a broad category term
  for (const [category, keywords] of Object.entries(BROAD_KEYWORDS)) {
    for (const kw of keywords) {
      if (q === kw || q.startsWith(kw + ' ') || q.endsWith(' ' + kw)) {
        return category;
      }
    }
  }

  // If query is very short (1-2 words) and matches a category keyword
  const words = q.split(/\s+/);
  if (words.length <= 2) {
    for (const [category, keywords] of Object.entries(BROAD_KEYWORDS)) {
      if (keywords.some((kw) => q.includes(kw))) {
        return category;
      }
    }
  }

  return null;
}

export function getCategoryConfig(category: string): CategoryConfig | null {
  return CATEGORY_CONFIGS[category] || null;
}
