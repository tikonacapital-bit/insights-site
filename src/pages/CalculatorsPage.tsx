import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CalculatorsSection from "@/components/CalculatorsSection";
import { SITE_URL } from "../lib/strapi";

const CalculatorsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Financial Calculators | Tikona Insights</title>
        <meta
          name="description"
          content="Plan your financial future with Tikona Capital's free financial calculators — SIP, lumpsum, goal planning, crorepati, FD, EMI, and more."
        />
        <link rel="canonical" href={`${SITE_URL.replace(/\/$/, "")}/calculators`} />
      </Helmet>

      <div className="insights-shell">
        <header className="hero">
          <div className="hero__nav">
            <div>
              <p className="eyebrow">Tikona Capital</p>
              <h1>Financial Calculators</h1>
            </div>
            <div className="hero__actions">
              <Link className="ghost-link" to="/">
                <ArrowLeft size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
                Insights
              </Link>
              <a className="solid-link" href="https://tikonacapital.com/consultation" target="_blank" rel="noreferrer">
                Book Consultation
              </a>
            </div>
          </div>

          <div className="hero__content">
            <div className="hero__copy">
              <p className="eyebrow">Tools for smarter financial decisions</p>
              <h2>Plan your goals, model returns, and stress-test your portfolio.</h2>
              <p className="hero__lede">
                Use our suite of calculators to project SIP &amp; lumpsum returns, plan goals, become a crorepati,
                compare FDs, model EMIs, and more — all in one place.
              </p>
            </div>
          </div>
        </header>

        <main className="calculators-main">
          <CalculatorsSection />
        </main>
      </div>
    </>
  );
};

export default CalculatorsPage;
