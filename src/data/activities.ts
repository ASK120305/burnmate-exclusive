export interface ActivityData {
  name: string;
  caloriesPerMinute: number;
  category: 'daily' | 'exercise' | 'fun' | 'household';
  emoji: string;
}

export const ACTIVITY_DATA: Record<string, ActivityData> = {
  'climb-stairs': {
    name: 'Climb stairs',
    caloriesPerMinute: 8,
    category: 'daily',
    emoji: '🏃'
  },
  'dance': {
    name: 'Dance',
    caloriesPerMinute: 6,
    category: 'fun',
    emoji: '💃'
  },
  'carry-groceries': {
    name: 'Carry groceries',
    caloriesPerMinute: 4,
    category: 'daily',
    emoji: '🛒'
  },
  'play-football': {
    name: 'Play football',
    caloriesPerMinute: 12,
    category: 'exercise',
    emoji: '⚽'
  },
  'walk-dog': {
    name: 'Walk the dog',
    caloriesPerMinute: 4,
    category: 'daily',
    emoji: '🐕'
  },
  'vacuum-house': {
    name: 'Vacuum house',
    caloriesPerMinute: 5,
    category: 'household',
    emoji: '🧹'
  },
  'jumping-jacks': {
    name: 'Jumping jacks',
    caloriesPerMinute: 10,
    category: 'exercise',
    emoji: '🤸'
  },
  'cook-meal': {
    name: 'Cook a meal',
    caloriesPerMinute: 3,
    category: 'household',
    emoji: '👨‍🍳'
  },
  'play-with-kids': {
    name: 'Play with kids',
    caloriesPerMinute: 5,
    category: 'fun',
    emoji: '👶'
  },
  'gardening': {
    name: 'Gardening',
    caloriesPerMinute: 6,
    category: 'household',
    emoji: '🌱'
  },
  'yoga': {
    name: 'Yoga',
    caloriesPerMinute: 4,
    category: 'exercise',
    emoji: '🧘'
  },
  'cycling': {
    name: 'Cycling',
    caloriesPerMinute: 11,
    category: 'exercise',
    emoji: '🚴'
  }
};

export const FOOD_EQUIVALENTS = [
  { name: 'samosa', calories: 130, emoji: '🥟' },
  { name: 'biscuit', calories: 50, emoji: '🍪' },
  { name: 'banana', calories: 105, emoji: '🍌' },
  { name: 'apple', calories: 80, emoji: '🍎' },
  { name: 'slice of pizza', calories: 285, emoji: '🍕' },
  { name: 'donut', calories: 250, emoji: '🍩' },
  { name: 'chocolate bar', calories: 150, emoji: '🍫' },
  { name: 'cup of coffee', calories: 2, emoji: '☕' },
  { name: 'glass of juice', calories: 110, emoji: '🧃' },
  { name: 'ice cream scoop', calories: 140, emoji: '🍦' }
];

export const MOOD_ACTIVITIES = {
  stressed: [
    { activity: 'yoga', reason: 'Calm your mind and stretch' },
    { activity: 'walk-dog', reason: 'Fresh air helps clear thoughts' },
    { activity: 'dance', reason: 'Shake off the stress!' }
  ],
  bored: [
    { activity: 'jumping-jacks', reason: 'Quick energy boost' },
    { activity: 'vacuum-house', reason: 'Productive and active' },
    { activity: 'cook-meal', reason: 'Create something delicious' }
  ],
  energetic: [
    { activity: 'play-football', reason: 'Channel that energy!' },
    { activity: 'cycling', reason: 'Adventure awaits' },
    { activity: 'climb-stairs', reason: 'Quick intense workout' }
  ],
  tired: [
    { activity: 'yoga', reason: 'Gentle movement to energize' },
    { activity: 'gardening', reason: 'Peaceful outdoor activity' },
    { activity: 'play-with-kids', reason: 'Their energy is contagious' }
  ]
};