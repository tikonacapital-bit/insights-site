import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import ComplianceModal from "@/components/compliance/ComplianceModal";
import LegalDocumentContent from "@/components/compliance/LegalDocumentContent";
import BookConsultationModal from "@/components/BookConsultationModal";

/* ── Types ── */
type ModalState =
  | { type: "legal"; slug: string; title: string }
  | { type: "grievance" }
  | { type: "book" }
  | null;

/* ── Compliance link config ── */
const COMPLIANCE_LINKS: Array<
  | { label: string; slug: string; title: string }
  | { label: string; href: string }
  | { label: string; special: "grievance" }
> = [
  { label: "Investor Charter (Research Analyst)", slug: "investor-charter", title: "Investor Charter - Research Analyst" },
  { label: "Complaints & Annual Compliance Report", slug: "complaints", title: "Complaints & Annual Compliance Report" },
  { label: "T&C of Research Services", slug: "research-services", title: "T&C of Research Services" },
  { label: "Most Important Terms and Conditions (MITC)", slug: "most-important-terms-and-conditions", title: "Most Important Terms and Conditions (MITC)" },
  { label: "Use of Artificial Intelligence (AI)", slug: "use-of-artificial-intelligence", title: "Use of Artificial Intelligence (AI)" },
  { label: "Disclosure", slug: "disclosure", title: "Disclosure" },
  { label: "Disclaimer", slug: "disclaimer", title: "Disclaimer" },
  { label: "Grievance Policy", slug: "grievance-policy", title: "Grievance Policy" },
  { label: "Grievance Contact", special: "grievance" },
  { label: "SmartODR", href: "https://smartodr.in/login" },
  { label: "SEBI Scores Portal", href: "https://scores.sebi.gov.in/" },
  { label: "Mutual Fund – Disclosure of Commission/Brokerage", slug: "mutual-fund-disclosure", title: "Mutual Fund – Disclosure of Commission/Brokerage" },
];

/* ── Newsletter form ── */
type NewsletterStatus = "idle" | "loading" | "success" | "error";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus("error"); return; }
    setStatus("loading");
    try {
      await fetch(import.meta.env.VITE_NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch { setStatus("error"); }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <p className="text-sm font-semibold text-accent mb-2">Subscribe to Our Newsletter</p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status !== "idle") setStatus("idle"); }}
            disabled={status === "loading" || status === "success"}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm h-10 pr-8 rounded-md"
          />
          {status === "success" && <CheckCircle2 size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-400" />}
          {status === "error" && <XCircle size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-400" />}
        </div>
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="flex-shrink-0 px-4 h-10 rounded-md bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 border-0 outline-none"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {status === "success" && <p className="text-green-400 text-xs mt-1.5">Thanks for subscribing!</p>}
      {status === "error" && <p className="text-red-400 text-xs mt-1.5">Please enter a valid email address.</p>}
    </form>
  );
}

/* ── Grievance contact table ── */
function GrievanceTable() {
  const rows = [
    { designation: "Principal Officer",   name: "Sumit Poddar", email: "sumitpoddar@tikonacapital.com", phone: "9833362498", hours: "9:00AM–6:00PM" },
    { designation: "Customer Care",       name: "Sumit Poddar", email: "contact@tikonacapital.com",     phone: "9833362498", hours: "9:00AM–6:00PM" },
    { designation: "Head of Customer Care", name: "Sumit Poddar", email: "contact@tikonacapital.com",  phone: "9833362498", hours: "9:00AM–6:00PM" },
    { designation: "Compliance Officer",  name: "Sumit Poddar", email: "contact@tikonacapital.com",     phone: "9833362498", hours: "9:00AM–6:00PM" },
    { designation: "CEO",                 name: "Sumit Poddar", email: "contact@tikonacapital.com",     phone: "9833362498", hours: "9:00AM–6:00PM" },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            {["Designation", "Contact Person", "Email", "Contact No.", "Time"].map((h) => (
              <th key={h} className="border border-border/30 px-3 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-muted/30" : ""}>
              <td className="border border-border/20 px-3 py-2 text-muted-foreground whitespace-nowrap">{r.designation}</td>
              <td className="border border-border/20 px-3 py-2 text-muted-foreground whitespace-nowrap">{r.name}</td>
              <td className="border border-border/20 px-3 py-2">
                <a href={`mailto:${r.email}`} className="text-accent hover:underline">{r.email}</a>
              </td>
              <td className="border border-border/20 px-3 py-2 text-muted-foreground whitespace-nowrap">{r.phone}</td>
              <td className="border border-border/20 px-3 py-2 text-muted-foreground whitespace-nowrap">{r.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Compliance link renderer ── */
function ComplianceLink({
  item,
  openLegal,
  openGrievance,
}: {
  item: typeof COMPLIANCE_LINKS[number];
  openLegal: (slug: string, title: string) => void;
  openGrievance: () => void;
}) {
  const cls = "text-xs text-white/75 hover:text-white transition-colors cursor-pointer whitespace-nowrap border-none outline-none bg-transparent p-0";

  if ("href" in item) {
    return <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>{item.label}</a>;
  }
  if ("special" in item) {
    return <button onClick={openGrievance} className={cls}>{item.label}</button>;
  }
  return <button onClick={() => openLegal(item.slug, item.title)} className={cls}>{item.label}</button>;
}

/* ── Main Footer ── */
export default function Footer() {
  const [modal, setModal] = useState<ModalState>(null);
  const openLegal = (slug: string, title: string) => setModal({ type: "legal", slug, title });
  const openGrievance = () => setModal({ type: "grievance" });
  const openBook = () => setModal({ type: "book" });
  const closeModal = () => setModal(null);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer style={{ background: "#1F4690" }} className="text-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 pt-12 pb-6">

          {/* ── Top grid: 2 columns ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.4fr] gap-8 md:gap-10 pb-10 border-b border-white/15">

            {/* Col 1 — Brand */}
            <div>
              <h2 className="font-heading font-bold text-base md:text-lg leading-snug mb-3">
                Tikona Capital Finserv Pvt Ltd
              </h2>
              <p className="text-xs md:text-sm text-white/75 text-justify leading-relaxed mb-1">
                A boutique wealth management and advisory firm providing
                comprehensive wealth solutions. Expert-led research, personalized
                strategies, and technology-enabled services for HNIs,
                entrepreneurs, and young investors.
              </p>

              <NewsletterForm />

              <div className="mt-5">
                <p className="text-sm font-semibold text-white/80 mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { icon: <Linkedin size={17} />, href: "https://www.linkedin.com/company/tikonacapital/", label: "LinkedIn" },
                    { icon: <Twitter size={17} />,  href: "https://twitter.com/tikonacapital",               label: "Twitter" },
                    { icon: <Instagram size={17} />, href: "https://www.instagram.com/tikonacapital/",        label: "Instagram" },
                    { icon: <Youtube size={17} />,  href: "https://www.youtube.com/@tikonacapital",           label: "YouTube" },
                  ].map(({ icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Col 2 — Contact */}
            <div>
              <h3 className="font-heading font-semibold text-sm text-accent mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex gap-2.5 items-start">
                  <MapPin size={15} className="flex-shrink-0 mt-0.5 text-accent" />
                  <span className="text-xs md:text-sm text-white/80 leading-snug">
                    Parinee Cresenzo, C-30, G Block, BKC, Bandra (E), Mumbai – 400051
                  </span>
                </li>
                <li className="flex gap-2.5 items-center">
                  <Mail size={15} className="flex-shrink-0 text-accent" />
                  <a href="mailto:contact@tikonacapital.com" className="text-xs md:text-sm text-white/80 hover:text-accent transition-colors">
                    contact@tikonacapital.com
                  </a>
                </li>
                <li className="flex gap-2.5 items-center">
                  <Phone size={15} className="flex-shrink-0 text-accent" />
                  <a href="tel:+919967271135" className="text-xs md:text-sm text-white/80 hover:text-accent transition-colors">
                    +91 99672 71135
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                  <span className="text-xs text-white/55">Office Hours: 9:00 AM to 6:00 PM</span>
                </li>
              </ul>
              <button
                onClick={openBook}
                className="w-full mt-5 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors border-0 outline-none"
              >
                Book Consultation
              </button>
            </div>
          </div>

          {/* ── Regulatory section ── */}
          <div className="pt-8 space-y-3">

            {/* Box 1 — Company overview */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} className="rounded-xl px-6 py-5 text-sm text-white/85 leading-relaxed">
              <strong className="font-bold text-white">Tikona Capital Finserv Pvt Ltd</strong>
              {" "}(CIN U66190MH2024PTC429732) is AMFI registered Mutual Fund Distributor with ARN - 321153 is separate
              Identifiable unit for distribution and{" "}
              <strong className="font-bold text-white">Tikona Capital</strong>
              {" "}is SEBI registered Research Analyst firm with SEBI Registration No. INH000069807
            </div>

            {/* Box 2 — SEBI */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} className="rounded-xl px-6 py-5">
              <p className="font-bold text-base text-accent mb-4">SEBI Registration Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-sm">
                <div><span className="text-white/50 font-medium">Registered Name: </span><span className="text-white">Sumit Poddar Proprietor Tikona Capital</span></div>
                <div><span className="text-white/50 font-medium">Registered Address: </span><span className="text-white">2C 123 Kalpataru Estate, JVLR, Andheri East, Mumbai, 400093</span></div>
                <div><span className="text-white/50 font-medium">Brand Name: </span><span className="text-white">Tikona Capital</span></div>
                <div><span className="text-white/50 font-medium">Principal Officer: </span>
                  <a href="mailto:sumitpoddar@tikonacapital.com" className="text-accent hover:underline">sumitpoddar@tikonacapital.com</a>
                </div>
                <div><span className="text-white/50 font-medium">Registration Number: </span><span className="text-white">INH000069807</span></div>
                <div><span className="text-white/50 font-medium">Validity: </span><span className="text-white">Jun 13, 2022 to Jun 12, 2027</span></div>
                <div><span className="text-white/50 font-medium">BSE Enlistment Number: </span><span className="text-white">5585</span></div>
              </div>
            </div>

            {/* Box 3 — AMFI */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} className="rounded-xl px-6 py-5">
              <p className="font-bold text-base text-accent mb-4">AMFI Registration Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-sm">
                <div><span className="text-white/50 font-medium">Company Name: </span><span className="text-white">Tikona Capital Finserv Pvt Ltd (Formerly known as Tikona Capital Advisors Pvt Ltd)</span></div>
                <div><span className="text-white/50 font-medium">Registered Address: </span><span className="text-white">Parinee Cresenzo, C-30, G Block, BKC, Bandra (E), Mumbai - 400051</span></div>
                <div><span className="text-white/50 font-medium">ARN: </span><span className="text-white">321153</span></div>
                <div><span className="text-white/50 font-medium">Communication Address: </span><span className="text-white">F76, A Wing, Express Zone Mall, Malad East, W E Highway, Mumbai 400097</span></div>
              </div>
            </div>

            {/* Box 4 — Risk disclaimer */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} className="rounded-xl px-6 py-5 text-sm text-white/80 leading-relaxed">
              Investment in the securities market is subject to market risks. Read all the related documents carefully before investing.
              Registration granted by SEBI, and certification from NISM in no way guarantee performance of the intermediary or
              provide any assurance of returns to investors.
            </div>

            {/* Regulatory & Compliance links */}
            <div className="pt-2">
              <p className="font-bold text-base text-accent mb-3">Regulatory &amp; Compliance</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2.5">
                {COMPLIANCE_LINKS.map((item, i) => (
                  <span key={item.label} className="flex items-center gap-2">
                    {i > 0 && <span className="text-white/30 select-none text-xs">•</span>}
                    <ComplianceLink item={item} openLegal={openLegal} openGrievance={openGrievance} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/60">
            <button
              onClick={() => openLegal("terms-of-use", "Terms of Use")}
              className="text-white/80 hover:text-white transition-colors text-sm border-none outline-none bg-transparent p-0"
            >
              Terms of Use
            </button>
            <span className="text-white/25">|</span>
            <Link to="/privacy-policy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/25">|</span>
            <span>© {currentYear} Tikona Capital. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* ── Modals ── */}
      <ComplianceModal isOpen={modal?.type === "legal"} onClose={closeModal} title={modal?.type === "legal" ? modal.title : ""}>
        {modal?.type === "legal" && <LegalDocumentContent slug={modal.slug} />}
      </ComplianceModal>

      <ComplianceModal isOpen={modal?.type === "grievance"} onClose={closeModal} title="Grievance Contact">
        <GrievanceTable />
      </ComplianceModal>

      <BookConsultationModal isOpen={modal?.type === "book"} onClose={closeModal} />
    </>
  );
}
