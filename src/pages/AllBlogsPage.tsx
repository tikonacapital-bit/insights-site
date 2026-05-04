import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAllBlogPosts, SITE_URL } from "../lib/strapi";
import type { BlogCard } from "../types/blog";
import Navbar from "../components/Navbar";

const PAGE_SIZE = 9;

const AllBlogsPage = () => {
  const [posts, setPosts] = useState<BlogCard[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const items = await fetchAllBlogPosts();
        setPosts(items);
      } catch {
        setError("Unable to load insights right now. Please try again shortly.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Helmet>
        <title>All Posts | Tikona Capital</title>
        <meta
          name="description"
          content="Browse all Tikona Capital insights on markets, personal finance, and wealth creation."
        />
        <link rel="canonical" href={`${SITE_URL}/post`} />
      </Helmet>

      <Navbar />

      <div className="site-shell">
        <section className="tk-section tk-section--blogs-page">
          <div className="tk-section__head">
            <Link to="/" className="tk-back-link">
              <ArrowLeft size={16} />
              Back to home
            </Link>
            <h1 className="tk-section__title">All Posts</h1>
            <p className="tk-section__lede">
              Long-form perspectives on markets, investing wisdom, and wealth
              creation.
            </p>
          </div>

          {isLoading ? (
            <div className="empty-state">Loading insights…</div>
          ) : error ? (
            <div className="empty-state">{error}</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">No articles available yet.</div>
          ) : (
            <>
              <div className="article-grid">
                {posts.slice(0, visibleCount).map((post) => (
                  <article key={post.id} className="article-card">
                    <div className="article-card__media">
                      {post.image ? (
                        <img src={post.image} alt={post.title} />
                      ) : (
                        <div className="article-card__fallback">Tikona Capital</div>
                      )}
                      {post.readTime && (
                        <span className="article-card__readtime">{post.readTime}</span>
                      )}
                    </div>
                    <div className="article-card__body">
                      <div className="article-card__date">{post.date}</div>
                      <h3>{post.title}</h3>
                      <p>{post.description}</p>
                    </div>
                    <div className="article-card__footer">
                      <Link to={`/post/${post.slug}`} className="read-more-link">
                        Read More
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {visibleCount < posts.length && (
                <div className="load-more">
                  <button
                    className="tk-btn tk-btn--gold"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default AllBlogsPage;
