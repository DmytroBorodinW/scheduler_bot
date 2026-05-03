export const TEAM_MEMBERS: Record<string, string | string[]> = {
  ВокалЧт1: ["@luba_kovalska", "@MmaximysS", "@dmytroSB", "@lzve_tttth"],
  ВокалЧт2: ["@Max_333_g", "@nelyalosobyk", "@Dannusia", "@Nadiia_Borodin"],
  ВокалПт: ["@kosarchuk", "Наталя", "@Max_333_g", "@MmaximysS"],
  ІнстЧт1: ["@ostapkosar", "@dmytroSB", "@Kostymii"],
  ІнстЧт2: ["@ostapkosar", "@Max_333_g", "@Kostymii", "@Dannusia"],
  ІнстПт: ["@kosarchuk", "@Max_333_g", "@ruslan_yolo"],
  ВокалНд: [],
  ІнстНд: [],
  "Апаратура: Остап": "@ostapkosar",
  "Апаратура: Діма": "@dmytroSB",
  "Апаратура: Микола": "Микола",
  "Апаратура: Макс": "@Max_333_g",
  "Звук: Остап": "@ostapkosar",
  "Звук: Діма": "@dmytroSB",
  "Звук: Микола": "Микола",
  "Звук: Костя": "@Kostymii",
  "Звук: Віталік К": "Віталік Кравчишин",
};

export const SCHEDULE_RULES: Record<string, any> = {
  вівторок: {
    vocal: { time: "19:30", location: "на церкві", type: "Вокальна репетиція" },
    instrumental: {
      time: "19:30",
      location: "в музикалці на церкві",
      type: "Репетиція (Вокал + Інструментал)",
    },
  },
  середа: {
    mainEvent: "⛪️ **Молодіжка о 19:00**",
    rehearsalTime: "18:00",
    location: "на церкві",
    type: "Репетиція (Вокал + Інструментал)",
  },
  четвер: {
    vocal: { time: "19:00", location: "на хаті", type: "Вокальна репетиція" },
    instrumental: {
      time: "19:30",
      location: "в музикалці на церкві",
      type: "Інструментальна репетиція",
    },
  },
  пʼятниця: {
    vocal: { time: "19:30", location: "на церкві", type: "Вокальна репетиція" },
    instrumental: {
      time: "19:30",
      location: "в музикалці на церкві",
      type: "Репетиція (Вокал + Інструментал)",
    },
  },
  субота: {
    vocal: { time: "19:30", location: "на церкві", type: "Вокальна репетиція" },
    instrumental: {
      time: "18:00",
      location: "в музикалці на церкві",
      type: "Репетиція (Вокал + Інструментал)",
    },
  },
  неділя: {
    mainEvent: "⛪️ **Ранкове о 10:00**",
    rehearsalTime: "08:30",
    location: "на церкві",
    type: "Репетиція (Вокал + Інструментал)",
  },
};

export const REHEARSAL_DAYS = ["вівторок", "четвер", "пʼятниця", "субота"];
export const SERVICE_DAYS = ["неділя", "середа"];
