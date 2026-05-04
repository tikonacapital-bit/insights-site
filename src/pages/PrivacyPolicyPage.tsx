import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import LegalDocumentContent from "@/components/compliance/LegalDocumentContent";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Tikona Capital</title>
        <meta
          name="description"
          content="Tikona Capital's privacy policy — how we collect, use, and protect your information."
        />
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-background pt-28 pb-16">
        <div className="container max-w-3xl px-4 md:px-6">
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-8">
            Privacy Policy
          </h1>
          <LegalDocumentContent slug="privacy-policy" />
        </div>
      </div>
    </>
  );
}
