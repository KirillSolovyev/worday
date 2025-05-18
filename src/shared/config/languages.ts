export enum Language {
  EN = 'en', // English
  ES = 'es', // Spanish
  ZH = 'zh', // Chinese
  HI = 'hi', // Hindi
  AR = 'ar', // Arabic
  PT = 'pt', // Portuguese
  BN = 'bn', // Bengali
  FR = 'fr', // French
  DE = 'de', // German
  JA = 'ja', // Japanese
  KK = 'kk', // Kazakh
  RU = 'ru', // Russian
  KO = 'ko', // Korean
  UZ = 'uz', // Uzbek
  KG = 'kg', // Kyrgyz
  TR = 'tr', // Turkish
  IT = 'it', // Italian
}

export const getVerbalLanguage = (lang: Language) => {
  switch (lang) {
    case Language.EN:
      return 'English';
    case Language.ES:
      return 'Spanish';
    case Language.ZH:
      return 'Chinese';
    case Language.HI:
      return 'Hindi';
    case Language.AR:
      return 'Arabic';
    case Language.PT:
      return 'Portuguese';
    case Language.BN:
      return 'Bengali';
    case Language.FR:
      return 'French';
    case Language.DE:
      return 'German';
    case Language.JA:
      return 'Japanese';
    case Language.KK:
      return 'Kazakh';
    case Language.RU:
      return 'Russian';
    case Language.KO:
      return 'Korean';
    case Language.UZ:
      return 'Uzbek';
    case Language.KG:
      return 'Kyrgyz';
    case Language.TR:
      return 'Turkish';
    case Language.IT:
      return 'Italian';
  }
};
