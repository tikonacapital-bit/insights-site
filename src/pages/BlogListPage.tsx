import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAllBlogPosts, SITE_URL } from "../lib/strapi";
import type { BlogCard } from "../types/blog";
import CalculatorsSection from "../components/CalculatorsSection";
import Navbar from "../components/Navbar";

const HOME_POSTS = 3;

const BlogListPage = () => {
  const [posts, setPosts] = useState<BlogCard[]>([]);
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
        <title>Tikona Capital | Insights & Financial Calculators</title>
        <meta
          name="description"
          content="Explore Tikona Capital's long-form insights on markets, personal finance, investing wisdom, and wealth creation."
        />
        <link rel="canonical" href={SITE_URL} />
      </Helmet>

      <Navbar />

      <section className="tk-hero">
        <div className="tk-hero__center">
          <h1 className="tk-hero__title">
            Start Your Journey to
            <span className="tk-hero__title-accent">Wealth Creation</span>
          </h1>
          <p className="tk-hero__lede">
            We empower our customers to invest in high-quality businesses &amp;
            assets to build long-term wealth.
          </p>

          <ul className="tk-hero__badges">
            <li>
              <TrendingUp size={18} />
              Multiple Market Cycle Experience
            </li>
            <li>
              <Users size={18} />
              100+ Clients
            </li>
            <li>
              <DollarSign size={18} />
              ₹200 Cr+ Capital Deployed
            </li>
          </ul>
        </div>
      </section>

      <div className="site-shell">

        <section id="calculators" className="tk-section">
          <div className="calculators-wrap">
            <CalculatorsSection />
          </div>
        </section>

        <section id="blogs" className="tk-section">
          <div className="tk-section__head">
            <h2 className="tk-section__title">Blogs</h2>
            <p className="tk-section__lede">
              Latest perspectives on markets, investing, and wealth creation.
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
                {posts.slice(0, HOME_POSTS).map((post) => (
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

              {posts.length > HOME_POSTS && (
                <div className="load-more">
                  <Link to="/post" className="tk-btn tk-btn--gold">
                    View All Blogs
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default BlogListPage;
