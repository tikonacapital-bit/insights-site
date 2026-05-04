import { useState, useCallback, useEffect, useRef } from "react";
import { Calculator, Target, Trophy, Clock, TrendingUp, PieChart, Landmark, Home, MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SIPLumpsumCalculator from "./calculators/SIPLumpsumCalculator";
import GoalPlanningCalculator from "./calculators/GoalPlanningCalculator";
import CrorepatiCalculator from "./calculators/CrorepatiCalculator";
import SIPDelayCalculator from "./calculators/SIPDelayCalculator";
import StepUpSIPCalculator from "./calculators/StepUpSIPCalculator";
import AssetAllocationCalculator from "./calculators/AssetAllocationCalculator";
import FDCalculator from "./calculators/FDCalculator";
import EMICalculator from "./calculators/EMICalculator";
import KnowYourRiskChat from "./calculators/KnowYourRiskChat";

const CalculatorsSection = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isRiskPopupOpen, setIsRiskPopupOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileTabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mobileTabsRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollLeft > 20);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  const tabs = [{
    id: "know-your-risk",
    label: "Know Your Risk",
    icon: MessageCircle
  }, {
    id: "sip-lumpsum",
    label: "MF Return",
    icon: Calculator
  }, {
    id: "goal-planning",
    label: "Goal Planning",
    icon: Target
  }, {
    id: "crorepati",
    label: "Crorepati",
    icon: Trophy
  }, {
    id: "sip-delay",
    label: "SIP Delay",
    icon: Clock
  }, {
    id: "step-up-sip",
    label: "Step Up SIP",
    icon: TrendingUp
  }, {
    id: "asset-allocation",
    label: "Allocation",
    icon: PieChart
  }, {
    id: "fd",
    label: "FD",
    icon: Landmark
  }, {
    id: "emi",
    label: "EMI",
    icon: Home
  }];
  const handleTabClick = (tabId: string) => {
    if (tabId === "know-your-risk") {
      setIsRiskPopupOpen(true);
      return;
    }
    setActiveTab(activeTab === tabId ? null : tabId);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent, currentIndex: number) => {
    const tabCount = tabs.length;
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabCount;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (currentIndex - 1 + tabCount) % tabCount;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabCount - 1;
        break;
      default:
        return;
    }

    const tabButtons = document.querySelectorAll('[role="tab"]');
    (tabButtons[newIndex] as HTMLElement)?.focus();
  }, [tabs.length]);
  const renderCalculatorContent = () => <>
      {activeTab === "sip-lumpsum" && <>
          <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-6">Mutual Fund Return Calculator</h3>
          <SIPLumpsumCalculator />
        </>}
      {activeTab === "goal-planning" && <>
          <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-6">Goal Planning Calculator</h3>
          <GoalPlanningCalculator />
        </>}
      {activeTab === "crorepati" && <>
          <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-6">Become a Crorepati Calculator</h3>
          <CrorepatiCalculator />
        </>}
      {activeTab === "sip-delay" && <>
          <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-6">SIP Delay Cost Calculator</h3>
          <SIPDelayCalculator />
        </>}
      {activeTab === "step-up-sip" && <>
          <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-6">Step Up SIP Calculator</h3>
          <StepUpSIPCalculator />
        </>}
      {activeTab === "asset-allocation" && <>
          <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-6">Asset Allocation Calculator</h3>
          <AssetAllocationCalculator />
        </>}
      {activeTab === "fd" && <>
          <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-6">Fixed Deposit Calculator</h3>
          <FDCalculator />
        </>}
      {activeTab === "emi" && <>
          <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-6">EMI Calculator</h3>
          <EMICalculator />
        </>}
    </>;
  return <section id="calculators-section" className="py-4 md:py-16 bg-transparent">
      <div className="container mx-auto px-2 md:px-4">
        <div className="text-center mb-3 md:mb-10 animate-fade-in">
          <h2 className="text-lg md:text-3xl lg:text-5xl font-heading font-bold mb-1.5 md:mb-4 text-primary">
            Financial Calculators
          </h2>
          <p className="text-[11px] md:text-base text-muted-foreground max-w-2xl mx-auto px-1">
            Plan your financial future with our powerful calculation tools
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Desktop Tab Bar */}
          <div className="hidden md:block">
            <div className={`bg-card border border-border shadow-sm transition-all duration-300 ${activeTab ? 'rounded-t-xl border-b-0' : 'rounded-xl'}`}>
              <div className="p-2">
                <TooltipProvider delayDuration={300}>
                  <div
                    role="tablist"
                    aria-label="Financial calculators"
                    className="grid grid-cols-9 gap-1"
                  >
                    {tabs.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const isRiskTab = tab.id === "know-your-risk";
                    return <Tooltip key={tab.id}>
                          <TooltipTrigger asChild>
                            <button
                              role="tab"
                              id={`tab-${tab.id}`}
                              aria-selected={isActive}
                              aria-controls={isRiskTab ? undefined : `panel-${tab.id}`}
                              aria-haspopup={isRiskTab ? "dialog" : undefined}
                              tabIndex={isActive || (activeTab === null && index === 0) ? 0 : -1}
                              onClick={() => handleTabClick(tab.id)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              className={`
                                flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg
                                transition-all duration-300 ease-in-out cursor-pointer
                                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                                ${isActive ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/80'}
                              `}
                            >
                              <Icon className="h-5 w-5" aria-hidden="true" />
                              <span className="text-xs font-medium text-center leading-tight">{tab.label}</span>
                            </button>
                          </TooltipTrigger>
                          {!isActive && <TooltipContent>
                              <p>{isRiskTab ? 'Open risk assessment' : 'Click to view calculator'}</p>
                            </TooltipContent>}
                        </Tooltip>;
                  })}
                  </div>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Mobile Tab Bar */}
          <div className="md:hidden">
            <div className={`bg-card border border-border shadow-sm transition-all duration-300 ${activeTab ? 'rounded-t-xl border-b-0' : 'rounded-xl'}`}>
              <div className="p-2 relative">
                <div
                  ref={mobileTabsRef}
                  className="overflow-x-auto scrollbar-hide scroll-smooth"
                >
                  <div
                    role="tablist"
                    aria-label="Financial calculators"
                    className="flex gap-1 w-max min-w-full"
                  >
                    {tabs.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const isRiskTab = tab.id === "know-your-risk";
                    return <button
                          key={tab.id}
                          role="tab"
                          id={`mobile-tab-${tab.id}`}
                          aria-selected={isActive}
                          aria-controls={isRiskTab ? undefined : `panel-${tab.id}`}
                          aria-haspopup={isRiskTab ? "dialog" : undefined}
                          tabIndex={isActive || (activeTab === null && index === 0) ? 0 : -1}
                          onClick={() => handleTabClick(tab.id)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          className={`
                            flex flex-col items-center gap-1 px-3 py-2 rounded-md
                            transition-all duration-300 ease-in-out cursor-pointer whitespace-nowrap flex-shrink-0
                            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                            ${isActive ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/80'}
                          `}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          <span className="text-[10px] font-medium">{tab.label}</span>
                        </button>;
                  })}
                  </div>
                </div>
                {/* Scroll indicator - clickable, fades on scroll */}
                <button
                  onClick={() => {
                    if (mobileTabsRef.current) {
                      mobileTabsRef.current.scrollBy({ left: 120, behavior: 'smooth' });
                    }
                  }}
                  className={`absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-muted/90 border border-border rounded-md flex items-center justify-center shadow-sm transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  aria-label="Scroll right"
                >
                  <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Content - Shared between Desktop and Mobile */}
          <div className={`
              overflow-hidden transition-all duration-500 ease-in-out origin-top
              ${activeTab ? 'max-h-[2000px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95'}
            `} style={{
          transformOrigin: 'top'
        }}>
            {activeTab && <div
                role="tabpanel"
                id={`panel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
                tabIndex={0}
                className="bg-card border-x border-b border-border rounded-b-xl shadow-sm"
              >
                <div className="p-4 md:p-6 animate-fade-in">
                  {renderCalculatorContent()}
                </div>
              </div>}
          </div>
        </div>
      </div>

      {/* Know Your Risk Popup */}
      <Dialog open={isRiskPopupOpen} onOpenChange={setIsRiskPopupOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 border-0 shadow-lg rounded-xl overflow-clip">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5">
            <DialogHeader className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <DialogTitle className="text-xl md:text-2xl font-heading font-bold text-white">
                  Know Your Risk
                </DialogTitle>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white/90 text-center leading-relaxed">
                  Answer 30 quick strategic questions to uncover your risk profile score -<br />
                  invest smarter, not harder
                </p>
                <p className="text-xs text-white/70 text-center">
                  Take the 7-Minute Assessment → Now
                </p>
              </div>
            </DialogHeader>
          </div>

          {/* Content area */}
          <div className="bg-card overflow-y-auto max-h-[calc(90vh-120px)] px-2">
            <KnowYourRiskChat />
          </div>
        </DialogContent>
      </Dialog>
    </section>;
};
export default CalculatorsSection;