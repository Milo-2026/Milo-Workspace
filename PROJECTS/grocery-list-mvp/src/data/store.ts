// Grocery List App - Basic Data Store
// This is a simple offline-first implementation

export interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  completed: boolean;
  addedBy?: string;
  completedBy?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  icon: string;
}

export interface GroceryList {
  id: string;
  name: string;
  items: Item[];
  store?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Default categories with aisle order
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'produce', name: 'Produce', sortOrder: 1, icon: '🍎' },
  { id: 'meat', name: 'Meat & Seafood', sortOrder: 2, icon: '🥩' },
  { id: 'dairy', name: 'Dairy & Eggs', sortOrder: 3, icon: '🥛' },
  { id: 'bakery', name: 'Bakery', sortOrder: 4, icon: '🍞' },
  { id: 'frozen', name: 'Frozen', sortOrder: 5, icon: '❄️' },
  { id: 'pantry', name: 'Pantry', sortOrder: 6, icon: '🥫' },
  { id: 'beverages', name: 'Beverages', sortOrder: 7, icon: '🧃' },
  { id: 'snacks', name: 'Snacks', sortOrder: 8, icon: '🍿' },
  { id: 'household', name: 'Household', sortOrder: 9, icon: '🧻' },
  { id: 'other', name: 'Other', sortOrder: 10, icon: '📦' },
];

// Category auto-detection keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  produce: ['apple', 'banana', 'orange', 'lemon', 'lime', 'tomato', 'onion', 'garlic', 'pepper', 'lettuce', 'spinach', 'broccoli', 'carrot', 'celery', 'potato', 'avocado', 'mushroom', 'cucumber', 'zucchini', 'squash', 'berry', 'grape', 'melon', 'watermelon', 'cantaloupe', 'fruit', 'vegetable', 'herb', 'cilantro', 'parsley', 'basil', 'mint'],
  meat: ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'sausage', 'bacon', 'ham', 'steak', 'ground', 'fish', 'salmon', 'tuna', 'shrimp', 'crab', 'lobster', 'seafood', 'meat', 'veal', 'roast', 'chop'],
  dairy: ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'sour cream', 'egg', 'margarine', 'cottage', 'ricotta', 'mozzarella', 'cheddar', 'parmesan', 'feta'],
  bakery: ['bread', 'bagel', 'muffin', 'croissant', 'donut', 'pastry', 'bun', 'tortilla', 'pita', 'roll', 'cake', 'pie', 'cookie'],
  frozen: ['ice cream', 'frozen', 'pizza', 'fries', 'waffle', 'popsicle', 'sorbet'],
  pantry: ['pasta', 'rice', 'bean', 'lentil', 'canned', 'soup', 'sauce', 'oil', 'vinegar', 'flour', 'sugar', 'salt', 'pepper', 'spice', 'cereal', 'oat', 'granola', 'honey', 'jam', 'peanut', 'nut', 'cracker'],
  beverages: ['juice', 'soda', 'water', 'coffee', 'tea', 'energy', 'drink', 'coconut', 'kombucha'],
  snacks: ['chip', 'cracker', 'nut', 'pretzel', 'popcorn', 'candy', 'chocolate', 'cookie', 'bar', 'granola bar'],
  household: ['paper', 'toilet', 'towel', 'napkin', 'cleaner', 'detergent', 'soap', 'shampoo', 'conditioner', 'tooth', 'brush', 'laundry', 'trash', 'bag', 'battery', 'light'],
};

// Auto-detect category from item name
export function autoDetectCategory(itemName: string): string {
  const lowerName = itemName.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category;
    }
  }
  return 'other';
}

// Sort items by category then alphabetically
export function sortItems(items: Item[]): Item[] {
  const categoryMap = new Map(DEFAULT_CATEGORIES.map(c => [c.id, c.sortOrder]));
  
  return [...items].sort((a, b) => {
    const catA = categoryMap.get(a.category) ?? 99;
    const catB = categoryMap.get(b.category) ?? 99;
    
    if (catA !== catB) return catA - catB;
    return a.name.localeCompare(b.name);
  });
}

// Group items by category for display
export function groupByCategory(items: Item[]): Record<string, Item[]> {
  const grouped: Record<string, Item[]> = {};
  
  for (const item of items) {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  }
  
  return grouped;
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Sample data for demo
export function createSampleList(): GroceryList {
  return {
    id: generateId(),
    name: "This Week's Groceries",
    store: "Whole Foods",
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      { id: generateId(), name: 'Bananas', quantity: 2, unit: 'bunch', category: 'produce', completed: true, createdAt: new Date() },
      { id: generateId(), name: 'Chicken breast', quantity: 2, unit: 'lbs', category: 'meat', completed: false, createdAt: new Date() },
      { id: generateId(), name: 'Milk', quantity: 1, unit: 'gallon', category: 'dairy', completed: false, createdAt: new Date() },
      { id: generateId(), name: 'Eggs', quantity: 1, unit: 'dozen', category: 'dairy', completed: true, createdAt: new Date() },
      { id: generateId(), name: 'Bread', quantity: 1, unit: 'loaf', category: 'bakery', completed: false, createdAt: new Date() },
      { id: generateId(), name: 'Greek yogurt', quantity: 2, unit: 'containers', category: 'dairy', completed: false, createdAt: new Date() },
      { id: generateId(), name: 'Broccoli', quantity: 1, unit: 'head', category: 'produce', completed: false, createdAt: new Date() },
    ]
  };
}