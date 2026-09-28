import type { YouthMinistryWeekSch } from './types.js';

export const TEAM_MEMBERS: Record<string, string | string[]> = {
   // October sheet teams (Команди block)
   ВокалЧт1: ['@luba_kovalska', '@y_n4ikkk', '@lzve_tttth'], // Любов, Яна, Ліза
   ВокалЧт2: ['@Nadiia_Borodin', '@Dannusia'], // Надя, Дануся
   ІнстЧт: ['@ostapkosar', '@Max_333_g', '@Kostymii', '@Dannusia'], // Остап, Макс Горобець, Костя, Дануся
   ВокалПт: ['@kosarchuk', '@nelyalosobyk', '@MmaximysS'], // Юля, Неля, Макс Зіньковський
   ІнстПт: ['@kosarchuk', '@ruslan_yolo', '@tania_zaritska'], // Юля, Руслан, Таня З
   ВокалНд: ['@lzve_tttth', '@Nadiia_Borodin', '@kosarchuk'], // Ліза, Надя, Юля
   ІнстНд: ['@kosarchuk', '@ostapkosar', '@Max_333_g'], // Юля, Остап, Макс Горобець
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

export const days: (keyof YouthMinistryWeekSch)[] = [
   'Mon',
   'Tue',
   'Wed',
   'Thu',
   'Fri',
   'Sat',
   'Sun',
];

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
