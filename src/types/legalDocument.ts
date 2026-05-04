import type { BlocksContent } from "@strapi/blocks-react-renderer";

export interface StrapiMedia {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: any | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface LegalDocument {
  id: string;
  documentId: string;
  title: string;
  slug: string;
  content: BlocksContent;
  media?: StrapiMedia | null;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiLegalDocument {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: BlocksContent;
  media?: StrapiMedia | null;
  lastUpdated?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiLegalDocumentResponse {
  data: StrapiLegalDocument[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
