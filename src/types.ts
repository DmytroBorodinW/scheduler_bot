export interface WorshipEvent {
  label: string; // Назва з таблиці (напр., "ВокалЧт1")
  key: string; // Технічний ключ (напр., "VThu1")
  mentions: string; // Сформований рядок з тегами (@user1 @user2)
}

/**
 * Дані про конкретний день
 */
export interface WorshipDay {
  date: string; // Форматована дата (напр., "вівторок, 28 квітня")
  events: WorshipEvent[]; // Масив івентів на цей день
}

/**
 * Об'єкт тижня, де ключі — це індекси днів (0, 1, 2, 3...)
 */
export interface WorshipWeek {
  [dayIndex: string]: WorshipDay;
}

/**
 * Головний об'єкт розкладу (Schedule)
 * Ключ: таймстемп понеділка у вигляді рядка
 */
export type WorshipSchedule = Record<string, WorshipWeek>;
