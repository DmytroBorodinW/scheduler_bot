export const parseTableDate = (dateStr: string): Date => {
  const cleanDate = dateStr.split(",")[1]?.trim() || dateStr;
  const [day, month, yearShort] = cleanDate.split(".").map(Number);
  const year = 2000 + yearShort;

  return new Date(year, month - 1, day);
};

export const getCurrentMondayTimestamp = (): string => {
  const now = new Date();
  const day = now.getDay(); // 0 (Нд) - 6 (Сб)

  // Знаходимо зміщення до понеділка:
  // Якщо сьогодні Нд (0), нам треба відняти 6 днів.
  // Якщо сьогодні Пн (1), віднімаємо 0.
  // В інших випадках віднімаємо (day - 1).
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);

  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0); // Обнуляємо час для точного збігу ключа

  return monday.getTime().toString();
};

export const getCurrentMonthName = (): string => {
  const now = new Date();
  // 'uk-UA' для української ("Травень") або 'en-US' для англійської ("May")
  // Обирай ту локаль, якою ти реально називаєш листи в таблиці
  const monthName = now.toLocaleString("en-US", { month: "long" });

  return monthName; // Наприклад: "May"
};
