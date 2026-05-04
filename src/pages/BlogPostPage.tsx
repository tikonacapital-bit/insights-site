import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { fetchBlogPostBySlug, formatDisplayDate, getStrapiMedia, SITE_URL } from "../lib/strapi";
import type { StrapiBlogPost } from "../types/blog";

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<StrapiBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMissing, setIsMissing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const load = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        setIsMissing(false);
        const item = await fetchBlogPostBySlug(slug);
        if (!item) {
          setIsMissing(true);
          return;
        }
        setPost(item);
      } catch (err) {
        setIsMissing(true);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [slug]);

  if (isMissing && !isLoading) {
    return <Navigate to="/" replace />;
  }

  if (isLoading || !post) {
    return <div className="article-loading">Loading article…</div>;
  }

  const image = getStrapiMedia(post.image?.url);
  const canonicalUrl = `${SITE_URL}/${post.slug}`;

  return (
    <>
      <Helmet>
        <title>{post.title} | Tikona Insights</title>
        <meta name="description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        {image && <meta property="og:image" content={image} />}
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="article-page">
        <div className="article-page__topbar">
          <Link to="/" className="inline-link">
            <ArrowLeft size={16} />
            All Insights
          </Link>
          <a href="https://tikonacapital.com" target="_blank" rel="noreferrer" className="ghost-link">
            Main Website
          </a>
        </div>

        <article className="article-layout">
          <header className="article-header">
            <p className="eyebrow">{post.category || "Insights"}</p>
            <h1>{post.title}</h1>
            <p className="article-header__description">{post.description}</p>
            <div className="article-header__meta">
              <span>{post.author || "Tikona Capital"}</span>
              <span>{formatDisplayDate(post.date || post.publishedAt || post.updatedAt)}</span>
              <span>{post.readTime || "5 min read"}</span>
            </div>
          </header>

          {image && (
            <div className="article-cover">
              <img src={image} alt={post.image?.alternativeText || post.title} />
            </div>
          )}

          <div className="article-body">
            <BlocksRenderer
              content={post.content}
              blocks={{
                paragraph: ({ children }) => <p>{children}</p>,
                heading: ({ children, level }) => {
                  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
                  return <Tag>{children}</Tag>;
                },
                list: ({ children, format }) =>
                  format === "ordered" ? <ol>{children}</ol> : <ul>{children}</ul>,
                quote: ({ children }) => <blockquote>{children}</blockquote>,
                image: ({ image }) => (
                  <figure>
                    <img
                      src={getStrapiMedia(image.url)}
                      alt={image.alternativeText || "Article visual"}
                    />
                    {image.caption && <figcaption>{image.caption}</figcaption>}
                  </figure>
                ),
                link: ({ children, url }) => (
                  <a href={url} target="_blank" rel="noreferrer">
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <pre>
                    <code>{children}</code>
                  </pre>
                ),
              }}
              modifiers={{
                bold: ({ children }) => <strong>{children}</strong>,
                italic: ({ children }) => <em>{children}</em>,
                underline: ({ children }) => <u>{children}</u>,
                strikethrough: ({ children }) => <s>{children}</s>,
                code: ({ children }) => <code>{children}</code>,
              }}
            />
          </div>
        </article>

        <footer className="article-footer">
          <Link to="/" className="solid-link solid-link--button">
            Browse More Articles
          </Link>
          <a href="https://tikonacapital.com/consultation" target="_blank" rel="noreferrer" className="ghost-link">
            Book a Consultation
            <ExternalLink size={16} />
          </a>
        </footer>
      </div>
    </>
  );
};

export default BlogPostPage;
