export interface LocalizedText {
  vi: string;
  en: string;
}

export interface TeamMember {
  name: string;
  role: LocalizedText;
  contributions: {
    vi: string[];
    en: string[];
  };
  avatar: string;
}
