export const TEAM_MEMBERS: Record<string, string | string[]> = {
  VThu1: ["@luba_kovalska", "@MmaximysS", "@dmytroSB", "@lzve_tttth"],
  VThu2: ["@Max_333_g", "@nelyalosobyk", "@Dannusia", "@Nadiia_Borodin"],
  VFri: ["@kosarchuk", "Наталя", "@Max_333_g", "@MmaximysS"],
  InstThu1: ["@ostapkosar", "@dmytroSB", "@Kostymii"],
  InstThu2: ["@ostapkosar", "@Max_333_g", "@Kostymii", "@Dannusia"],
  InstFri: ["@kosarchuk", "@Max_333_g", "@ruslan_yolo"],
  VSun: [],
  InstSun: [],
  SEOst: "@ostapkosar",
  SEDmt: "@dmytroSB",
  SEMyk: "Микола",
  SEMax: "@Max_333_g",
  SOst: "@ostapkosar",
  SDmt: "@dmytroSB",
  SMyk: "Микола",
  SKst: "@Kostymii",
  SVit: "Віталік Кравчишин",
};

export const SCHEDULE_RULES: Record<string, any> = {
  вівторок: {
    time: "19:30",
    location: "на церкві",
    defaultType: "Репетиція (Вокал + Інструментал)",
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

export const REHEARSAL_DAYS = ["четвер", "пʼятниця", "субота"];
export const SERVICE_DAYS = ["неділя", "середа"];
