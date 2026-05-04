import { useEffect } from "react";
import { X } from "lucide-react";

interface BookConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookConsultationModal({
  isOpen,
  onClose,
}: BookConsultationModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/60"
      style={{ zIndex: 10000 }}
      onClick={onClose}
    >
      <div
        className="relative bg-background rounded-2xl shadow-2xl border border-border/50 overflow-hidden flex flex-col"
        style={{ width: "95vw", maxWidth: "64rem", height: "95vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 text-center bg-gradient-to-r from-primary to-secondary text-primary-foreground relative">
          <h2 className="font-heading font-bold text-xl md:text-2xl">
            Book Your Consultation
          </h2>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Quick 2 minutes to know more
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors text-primary-foreground"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Iframe */}
        <iframe
          src="https://forms.zohopublic.in/tikonacapital/form/BookConsultation1/formperma/RuTCb0c02-_LPFbwGDpPNl7HXPLlb5B4bCdqFlDXlIs"
          title="Book Consultation"
          className="w-full flex-1 border-0"
        />
      </div>
    </div>
  );
}
