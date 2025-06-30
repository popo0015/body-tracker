export interface DailyEntry {
  date: string;
  measurements?: {
    waist: number;
    hips: number;
    thigh: number;
    arm: number;
    chest: number;
    underNavel: number;
    weight: number;
  };
  meals?: Array<{ product: string; grams: number; kcal: number }>;
  workouts?: Array<{ exercise: string; sets: number; reps: number; weight: number }>;
}

const STORAGE_KEY = 'fitlog';

export function loadEntries(): DailyEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveEntries(entries: DailyEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function upsertEntry(entry: DailyEntry) {
  const entries = loadEntries();
  const updated = [...entries.filter(e => e.date !== entry.date), entry];
  saveEntries(updated);
}
