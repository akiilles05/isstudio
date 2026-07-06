export interface Project {
  id: number;
  order: number;
  title: string;
  subtitle: string;
  url: string;
  domain: string;
  accentColor: string;
  previewBg: string;
  slug: string;
  content: string;
  results?: string | null;
  image?: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: number;
  order: number;
  content: string;
  author: string;
  role?: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: number;
  order: number;
  question: string;
  answer: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: number;
  order: number;
  num: string;
  title: string;
  desc: string;
  stack: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessStep {
  id: number;
  order: number;
  num: string;
  title: string;
  desc: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteContent {
  id: number;
  key: string;
  value: string;
  label: string;
  group: string;
  updatedAt: Date;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  company?: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

export type ContentMap = Record<string, string>;
