import type { YouthMinistryWeekSch } from './types.js';

export const PERSON_HANDLES: Record<string, string> = {
  Любов: '@luba_kovalska',
  Яна: '@y_n4ikkk',
  Ліза: '@lzve_tttth',
  Надя: '@Nadiia_Borodin',
  Дануся: '@Dannusia',
  Остап: '@ostapkosar',
  'Макс Горобець': '@Max_333_g',
  Костя: '@Kostymii',
  Юля: '@kosarchuk',
  Неля: '@nelyalosobyk',
  'Макс Зіньковський': '@MmaximysS',
  Руслан: '@ruslan_yolo',
  'Таня З': '@tania_zaritska',
};

export const TEAM_MEMBERS: Record<string, string | string[]> = {
  'Апаратура: Остап': '@ostapkosar',
  'Апаратура: Діма': '@dmytroSB',
  'Апаратура: Микола': 'Микола',
  'Апаратура: Макс': '@Max_333_g',
  'Звук: Остап': '@ostapkosar',
  'Звук: Діма': '@dmytroSB',
  'Звук: Микола': 'Микола',
  'Звук: Костя': '@Kostymii',
  'Звук: Віталік К': 'Віталік Кравчишин',
};

export const DEFAULT_TEAMS_CONFIG_RANGE = 'H30:Z45';

export const SCHEDULE_RULES: Record<string, any> = {
  вівторок: {
    vocal: {
      time: '19:30',
      location: 'на церкві',
      type: 'Вокальна репетиція',
    },
    instrumental: {
      time: '19:30',
      location: 'в музикалці на церкві',
      type: 'Репетиція (Вокал + Інструментал)',
    },
  },
  середа: {
    mainEvent: '⛪️ **Молодіжка о 19:00**',
    rehearsalTime: '18:00',
    location: 'на церкві',
    type: 'Репетиція (Вокал + Інструментал)',
  },
  четвер: {
    vocal: { time: '19:00', location: 'на хаті', type: 'Вокальна репетиція' },
    instrumental: {
      time: '19:30',
      location: 'в музикалці на церкві',
      type: 'Інструментальна репетиція',
    },
  },
  пʼятниця: {
    vocal: {
      time: '19:30',
      location: 'на церкві',
      type: 'Вокальна репетиція',
    },
    instrumental: {
      time: '19:30',
      location: 'в музикалці на церкві',
      type: 'Репетиція (Вокал + Інструментал)',
    },
  },
  субота: {
    vocal: {
      time: '19:30',
      location: 'на церкві',
      type: 'Вокальна репетиція',
    },
    instrumental: {
      time: '18:00',
      location: 'в музикалці на церкві',
      type: 'Репетиція (Вокал + Інструментал)',
    },
  },
  неділя: {
    mainEvent: '⛪️ **Ранкове о 10:00**',
    rehearsalTime: '08:30',
    location: 'на церкві',
    type: 'Репетиція (Вокал + Інструментал)',
  },
};

export const REHEARSAL_DAYS = ['вівторок', 'четвер', 'пʼятниця', 'субота'];
export const SERVICE_DAYS = ['неділя', 'середа'];

export const days: (keyof YouthMinistryWeekSch)[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const dayNames: Record<string, string> = {
  Mon: 'ПОНЕДІЛОК',
  Tue: 'ВІВТОРОК',
  Wed: 'СЕРЕДА',
  Thu: 'ЧЕТВЕР',
  Fri: 'П’ЯТНИЦЯ',
  Sat: 'СУБОТА',
  Sun: 'НЕДІЛЯ',
};

export const emojiMap: Record<string, string> = {
  Спікер: '🗣️',
  Спів: '🎹',
  'Група прославлення': '🎹',
  Ведучий: '🎤',
  Молитва: '🇺🇦',
  Звук: '🎧',
  Апаратура: '🔊',
  Слайди: '💻',
  Гостинність: '☺️',
  Тема: '📖',
  Медіа: '🎥',
};

export const monthNames = [
  'СІЧНЯ',
  'ЛЮТОГО',
  'БЕРЕЗНЯ',
  'КВІТНЯ',
  'ТРАВНЯ',
  'ЧЕРВНЯ',
  'ЛИПНЯ',
  'СЕРПНЯ',
  'ВЕРЕСНЯ',
  'ЖОВТНЯ',
  'ЛИСТОПАДА',
  'ГРУДНЯ',
];
