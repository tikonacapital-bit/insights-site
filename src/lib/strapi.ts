import type { BlogCard, StrapiBlogPost, StrapiListResponse } from "../types/blog";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "https://cms.tikonacapital.com";
export const SITE_URL = import.meta.env.VITE_SITE_URL || "https://insights.tikonacapital.com";

export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${STRAPI_URL}${url}`;
}

export async function fetchStrapi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${STRAPI_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchAllBlogPosts(): Promise<BlogCard[]> {
  const posts: BlogCard[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await fetchStrapi<StrapiListResponse<StrapiBlogPost>>(
      `/api/blogs?sort=date:desc&populate=*&pagination[page]=${page}&pagination[pageSize]=100`
    );

    for (const item of response.data || []) {
      posts.push(mapBlogCard(item));
    }

    totalPages = response.meta.pagination.pageCount || 1;
    page += 1;
  } while (page <= totalPages);

  return posts;
}

export async function fetchBlogPostBySlug(slug: string): Promise<StrapiBlogPost | null> {
  const response = await fetchStrapi<StrapiListResponse<StrapiBlogPost>>(
    `/api/blogs?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );

  return response.data?.[0] || null;
}

export function mapBlogCard(item: StrapiBlogPost): BlogCard {
  return {
    id: item.documentId || String(item.id),
    slug: item.slug || "",
    title: item.title || "Untitled",
    description: item.description || "",
    image: getStrapiMedia(item.image?.url),
    category: item.category || "Uncategorized",
    readTime: item.readTime || "5 min read",
    author: item.author || "Tikona Capital",
    date: formatDisplayDate(item.date || item.publishedAt || item.updatedAt),
  };
}

export function formatDisplayDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
