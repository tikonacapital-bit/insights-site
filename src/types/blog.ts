import type { BlocksContent } from "@strapi/blocks-react-renderer";

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiImage {
  url: string;
  width: number;
  height: number;
  alternativeText: string | null;
  caption: string | null;
  mime: string;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  } | null;
}

export interface StrapiBlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  content: BlocksContent;
  image: StrapiImage | null;
  author: string;
  category: string;
  readTime: string;
  date: string;
  publishedAt: string;
  updatedAt: string;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface BlogCard {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
}
