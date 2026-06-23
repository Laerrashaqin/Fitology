export type Gender = "women" | "men";
export type Language = "id" | "en";

export interface Measurements {
  height: string;
  weight: string;
  shoulder: string;
  bust: string;
  waist: string;
  hips: string;
  highHip: string;
}

export interface FitRecord {
  name: string;
  cat: string;
  reasonTag: string;
  reasonDesc: string;
  img: string;
}

export interface ShapeData {
  title: string;
  introText: string;
  desc: string;
  tipsList: string[];
  fits: FitRecord[];
}
