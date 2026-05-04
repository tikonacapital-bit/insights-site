import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function ComplianceModal({
  isOpen,
  onClose,
  title,
  children,
}: ComplianceModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-4xl bg-background rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-primary text-primary-foreground">
          <h2 className="font-heading font-semibold text-base md:text-lg leading-tight pr-4">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div
          className="overflow-y-auto p-6 md:p-8"
          style={{ maxHeight: "calc(90vh - 64px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
