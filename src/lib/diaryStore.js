import { format, isToday, isYesterday, differenceInDays } from 'date-fns';

const DIARY_KEY = 'nutriwise_diary';
const STREAK_KEY = 'nutriwise_streak';

export function getDiary() {
  try {
    return JSON.parse(localStorage.getItem(DIARY_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveDiary(diary) {
  localStorage.setItem(DIARY_KEY, JSON.stringify(diary));
}

export function getTodayStr() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function addFoodToDiary(product, macros, healthScore) {
  const diary = getDiary();
  const today = getTodayStr();

  if (!diary[today]) {
    diary[today] = {
      entries: [],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    };
  }

  diary[today].entries.push({
    id: Date.now().toString(),
    time: format(new Date(), 'HH:mm'),
    name: product.product_name,
    brands: product.brands,
    calories: macros.calories || 0,
    protein: macros.protein || 0,
    healthScore: healthScore || 0,
    image_url: product.image_url,
  });

  // Update totals
  diary[today].totals.calories += (macros.calories || 0);
  diary[today].totals.protein += (macros.protein || 0);
  diary[today].totals.carbs += (macros.carbs || 0);
  diary[today].totals.fat += (macros.fat || 0);

  saveDiary(diary);
  updateStreak(today);
}

function getStreakData() {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"current": 0, "lastEntry": null}');
  } catch {
    return { current: 0, lastEntry: null };
  }
}

function updateStreak(todayStr) {
  const streak = getStreakData();
  
  if (!streak.lastEntry) {
    streak.current = 1;
    streak.lastEntry = todayStr;
  } else if (streak.lastEntry !== todayStr) {
    const lastDate = new Date(streak.lastEntry);
    const todayDate = new Date(todayStr);
    const diff = differenceInDays(todayDate, lastDate);
    
    if (diff === 1) {
      // Consecutive day
      streak.current += 1;
    } else if (diff > 1) {
      // Missed a day, reset streak
      streak.current = 1;
    }
    streak.lastEntry = todayStr;
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
}

export function getStreak() {
  const streak = getStreakData();
  // Check if streak is broken because they missed yesterday
  if (streak.lastEntry) {
    const lastDate = new Date(streak.lastEntry);
    const todayDate = new Date();
    const diff = differenceInDays(todayDate, lastDate);
    if (diff > 1) {
      return 0; // Streak broken
    }
  }
  return streak.current;
}

export function getTodayTotals() {
  const diary = getDiary();
  const today = getTodayStr();
  return diary[today]?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
}

export function getTodayEntries() {
  const diary = getDiary();
  const today = getTodayStr();
  return diary[today]?.entries || [];
}
