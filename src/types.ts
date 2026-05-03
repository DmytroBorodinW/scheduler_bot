export enum TechEventKey {
  SOUND = "Звук",
  SOUND_EQUIPMENT = "Апаратура",
}

export enum EventLocations {
  HOME = "на хаті",
  MUSIC_ROOM = "музикалка",
}

export interface WorshipEvent {
  label: string;
  key: string;
  mentions: string;
}

export interface WorshipDay {
  date: string; // Форматована дата (напр., "вівторок, 28 квітня")
  events: WorshipEvent[]; // Масив івентів на цей день
}
export interface WorshipWeek {
  [dayIndex: string]: WorshipDay;
}

export type WorshipSchedule = Record<string, WorshipWeek>;
