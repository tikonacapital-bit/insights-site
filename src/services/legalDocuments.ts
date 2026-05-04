import { fetchStrapi } from "@/lib/strapi";
import type {
  LegalDocument,
  StrapiLegalDocument,
  StrapiLegalDocumentResponse,
} from "@/types/legalDocument";

function transformLegalDocument(strapiDoc: StrapiLegalDocument): LegalDocument {
  return {
    id: strapiDoc.id.toString(),
    documentId: strapiDoc.documentId,
    title: strapiDoc.title,
    slug: strapiDoc.slug,
    content: strapiDoc.content,
    media: strapiDoc.media || null,
    lastUpdated: strapiDoc.lastUpdated || strapiDoc.updatedAt,
    createdAt: strapiDoc.createdAt,
    updatedAt: strapiDoc.updatedAt,
  };
}

export async function fetchLegalDocumentBySlug(
  slug: string
): Promise<LegalDocument | null> {
  const endpoint = `/api/legal-documents?filters[slug][$eq]=${slug}&populate=*`;
  const response = await fetchStrapi<StrapiLegalDocumentResponse>(endpoint);
  if (!response.data || response.data.length === 0) return null;
  return transformLegalDocument(response.data[0]);
}
