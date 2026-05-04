import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { fetchLegalDocumentBySlug } from "@/services/legalDocuments";
import type { LegalDocument } from "@/types/legalDocument";

const STRAPI_URL =
  (import.meta as any).env?.VITE_STRAPI_URL || "https://cms.tikonacapital.com";

function resolvePdfUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${STRAPI_URL}${url}`;
}

interface Props {
  slug: string;
}

export default function LegalDocumentContent({ slug }: Props) {
  const [doc, setDoc] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchLegalDocumentBySlug(slug)
      .then((d) => {
        if (!d) setError("Document not found.");
        else setDoc(d);
      })
      .catch(() => setError("Failed to load document."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <p className="text-muted-foreground text-center py-12">
        {error || "Document unavailable."}
      </p>
    );
  }

  const isPdf = doc.media?.mime === "application/pdf";

  return (
    <div>
      {isPdf && doc.media ? (
        <div>
          <object
            data={resolvePdfUrl(doc.media.url)}
            type="application/pdf"
            style={{ width: "100%", height: "70vh" }}
          >
            <p className="text-muted-foreground text-sm">
              Your browser cannot display PDFs.{" "}
              <a
                href={resolvePdfUrl(doc.media.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Download the document
              </a>
            </p>
          </object>
        </div>
      ) : (
        <BlocksRenderer
          content={doc.content}
          blocks={{
            paragraph: ({ children }) => (
              <p className="text-muted-foreground mb-3 leading-relaxed text-sm">
                {children}
              </p>
            ),
            heading: ({ children, level }) => {
              const sizeMap: Record<number, string> = {
                1: "text-2xl",
                2: "text-xl",
                3: "text-lg",
                4: "text-base",
                5: "text-sm",
                6: "text-xs",
              };
              const Tag = `h${level}` as keyof JSX.IntrinsicElements;
              return (
                <Tag
                  className={`text-primary font-bold ${sizeMap[level] ?? "text-base"} mt-6 mb-3 leading-snug`}
                >
                  {children}
                </Tag>
              );
            },
            list: ({ children, format }) => {
              if (format === "ordered") {
                return (
                  <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
                );
              }
              return (
                <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
              );
            },
            "list-item": ({ children }) => (
              <li className="text-muted-foreground text-sm">{children}</li>
            ),
            quote: ({ children }) => (
              <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground my-4 text-sm">
                {children}
              </blockquote>
            ),
            link: ({ children, url }) => (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {children}
              </a>
            ),
          }}
          modifiers={{
            bold: ({ children }) => <strong className="font-semibold">{children}</strong>,
            italic: ({ children }) => <em>{children}</em>,
            underline: ({ children }) => <u>{children}</u>,
            strikethrough: ({ children }) => <s>{children}</s>,
            code: ({ children }) => (
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            ),
          }}
        />
      )}

      {/* Last updated */}
      <p className="text-right text-xs text-muted-foreground mt-8 pt-4 border-t border-border">
        Last updated:{" "}
        {new Date(doc.lastUpdated).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
