import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass, MapPin, ArrowRight, Star, Calendar, CheckCircle2, Menu, X, LogIn, LogOut, Sparkles,
  Hotel, Car, Activity
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useActivePlan } from "@/lib/activePlan";

// Button Component matching template interface with clean minimal styling
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "gradient" | "teal" | "accent";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

export const TemplateButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.99]";

    const variants = {
      default:
        "bg-[#222222] text-white hover:bg-[#333333] rounded-xl",
      secondary:
        "bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#F7F7F7] rounded-xl",
      ghost:
        "text-[#717171] hover:text-[#222222] hover:bg-[#F7F7F7] rounded-xl",
      accent:
        "bg-[#008489] text-white hover:bg-[#006c70] rounded-xl",
      gradient:
        "bg-[#222222] text-white hover:bg-[#333333] rounded-xl",
      teal:
        "bg-[#008489] text-white hover:bg-[#006c70] rounded-xl",
    };

    const sizes = {
      default: "h-10 px-5 text-sm",
      sm: "h-9 px-4 text-xs font-medium",
      lg: "h-12 px-6 text-sm font-semibold",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TemplateButton.displayName = "TemplateButton";

// Navigation Component
export const TemplateNavigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { user, openAuthModal, logout } = useAuth();
  const { activePlan } = useActivePlan();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#DDDDDD] shadow-sm py-3.5"
          : "bg-white/80 backdrop-blur-sm py-4"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex items-center justify-between">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#222222] flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-[#222222] tracking-tight">
              VoyageGo
            </span>
          </Link>

          {/* Actual Application Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/destinations"
              className="text-sm font-medium text-[#222222] hover:text-[#008489] transition-colors"
            >
              Explore Destinations
            </Link>
            <Link
              to="/planner"
              className="text-sm font-medium text-[#222222] hover:text-[#008489] transition-colors"
            >
              Plan a Trip
            </Link>
            <Link
              to="/my-trips"
              className="text-sm font-medium text-[#222222] hover:text-[#008489] transition-colors"
            >
              My Saved Trips
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-[#222222] hover:text-[#008489] transition-colors"
            >
              About
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Active Plan Pill */}
            {activePlan && (
              <Link
                to={`/trips/${activePlan.id}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition border shadow-xs group bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100 hover:border-teal-300 cursor-pointer"
                title={`Return to your ${activePlan.destination} itinerary`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
                </span>
                <Compass className="w-3.5 h-3.5 text-teal-700 group-hover:rotate-45 transition-transform" />
                <span>
                  Current Plan: <span className="font-bold">{activePlan.destination}</span> ({activePlan.days}d)
                </span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-full border border-stone-200 text-xs font-medium text-stone-800">
                  <div className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-stone-500 hover:text-red-600 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 border border-stone-300 rounded-xl hover:bg-stone-50 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition cursor-pointer shadow-xs"
                >
                  Register
                </button>
              </div>
            )}

            <Link to="/planner">
              <TemplateButton variant="default" size="sm">
                Start Planning
              </TemplateButton>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 text-[#222222] hover:bg-[#F7F7F7] rounded-xl transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white mt-3 border-t border-[#DDDDDD] px-6 py-6 shadow-lg">
          <div className="flex flex-col gap-4">
            <Link
              to="/destinations"
              className="text-base font-medium text-[#222222] hover:text-[#008489] py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Destinations
            </Link>
            <Link
              to="/planner"
              className="text-base font-medium text-[#222222] hover:text-[#008489] py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plan a Trip
            </Link>
            <Link
              to="/my-trips"
              className="text-base font-medium text-[#222222] hover:text-[#008489] py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Saved Trips
            </Link>
            <Link
              to="/about"
              className="text-base font-medium text-[#717171] hover:text-[#222222] py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Project
            </Link>
            <div className="pt-4 border-t border-[#DDDDDD] flex flex-col gap-2">
              <Link to="/planner" onClick={() => setMobileMenuOpen(false)}>
                <TemplateButton variant="default" className="w-full">
                  Start Planning
                </TemplateButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});
TemplateNavigation.displayName = "TemplateNavigation";

// Hero Component with Travel Visuals, Spacious Layout, and Live Showcase
export const TemplateHero = React.memo(() => {
  const navigate = useNavigate();
  const { activePlan } = useActivePlan();
  const [quickDest, setQuickDest] = React.useState("Goa");
  const [quickDays, setQuickDays] = React.useState("3");

  const handleQuickPlan = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/planner?destination=${encodeURIComponent(quickDest)}`);
  };

  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-white border-b border-[#DDDDDD] w-full">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10 w-full">
          {/* Active plan quick resume banner if user has an itinerary in session */}
          {activePlan && (
            <div className="mb-6 p-2.5 sm:p-3 px-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 flex flex-wrap items-center justify-between gap-3 text-xs w-full max-w-2xl shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-600"></span>
                </span>
                <span>
                  You have an active plan for <strong>{activePlan.destination}</strong> ({activePlan.days} Days{activePlan.budget ? `, ₹${activePlan.budget.toLocaleString()}` : ''})
                </span>
              </div>
              <Link
                to={`/trips/${activePlan.id}`}
                className="font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>View Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Subtle Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F7F7F7] border border-[#DDDDDD] text-xs font-medium text-[#717171] mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#008489]" />
            <span>Smart Travel Planning · Personalized Itineraries & Transparent Costs</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#222222] tracking-tight leading-tight max-w-3xl mx-auto mb-5 text-center">
            Your Journey. Your Interests.{" "}
            <span className="text-[#008489]">Your Perfect Trip.</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base sm:text-lg text-[#717171] font-normal leading-relaxed max-w-2xl mx-auto mb-8 text-center">
            Discover handpicked destinations, forecast verified travel budgets, and generate custom day-by-day itineraries with curated hotels and vehicle options.
          </p>

          {/* Quick interactive planning strip */}
          <form
            onSubmit={handleQuickPlan}
            className="w-full max-w-2xl mx-auto bg-white border border-[#DDDDDD] rounded-2xl shadow-sm hover:shadow-md transition-shadow p-2 flex flex-col sm:flex-row items-center gap-2 mb-8"
          >
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-[#DDDDDD]">
              <MapPin className="w-4 h-4 text-[#717171] shrink-0" />
              <div className="text-left w-full">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#717171] block">
                  Destination
                </label>
                <select
                  value={quickDest}
                  onChange={(e) => setQuickDest(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-[#222222] focus:outline-none cursor-pointer"
                >
                  <option value="Goa">Goa (Beaches & Heritage)</option>
                  <option value="Jaipur">Jaipur (Pink City Forts)</option>
                  <option value="Kerala Backwaters">Kerala Backwaters (Lagoons)</option>
                  <option value="Manali">Manali (Himalayan Adventure)</option>
                  <option value="Leh Ladakh">Leh Ladakh (High Passes)</option>
                  <option value="Udaipur">Udaipur (City of Lakes)</option>
                  <option value="Varanasi">Varanasi (Sacred Ghats)</option>
                </select>
              </div>
            </div>

            <div className="w-full sm:w-36 flex items-center gap-3 px-4 py-2">
              <Calendar className="w-4 h-4 text-[#717171] shrink-0" />
              <div className="text-left w-full">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#717171] block">
                  Duration
                </label>
                <select
                  value={quickDays}
                  onChange={(e) => setQuickDays(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-[#222222] focus:outline-none cursor-pointer"
                >
                  <option value="2">2 Days</option>
                  <option value="3">3 Days</option>
                  <option value="4">4 Days</option>
                  <option value="5">5 Days</option>
                  <option value="7">7 Days</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-[#008489] hover:bg-[#006c70] text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              Generate Plan <ArrowRight size={15} />
            </button>
          </form>

          {/* Social Proof Tags */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-[#717171]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#008489]" /> 111 Verified Attractions
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#008489]" /> Curated Stays & Vehicle Options
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#008489]" /> Guaranteed Budget Adherence
            </span>
          </div>
        </div>

        {/* Travel Showcase Preview Card */}
        <div className="relative w-full max-w-5xl mx-auto mt-6">
          <div className="bg-white rounded-2xl border border-[#DDDDDD] shadow-lg p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Visual Trip Showcase Card */}
              <div className="lg:col-span-7 space-y-5">
                <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&q=80"
                    alt="Goa Beach and Architecture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#222222] shadow-sm">
                      Beach & Culture
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#008489] text-white text-xs font-semibold shadow-sm">
                      92% Match Score
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">
                      Goa Coastal & Heritage Expedition
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-200">
                      <span className="flex items-center gap-1 font-medium text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> 4.6 Stars
                      </span>
                      <span>•</span>
                      <span>4 Days · 2 Travellers</span>
                      <span>•</span>
                      <span className="font-semibold text-white">₹23,635 Est. Cost (Within Budget)</span>
                    </div>
                  </div>
                </div>

                {/* Micro timeline sample */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#F7F7F7] border border-[#DDDDDD]">
                    <span className="text-[10px] font-semibold text-[#008489] uppercase tracking-wider block mb-1">
                      Morning · 09:30 AM
                    </span>
                    <h4 className="font-bold text-[#222222] text-xs">Fort Aguada Lighthouse</h4>
                    <p className="text-[11px] text-[#717171] mt-0.5">Historical visit · 2.0h</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F7F7F7] border border-[#DDDDDD]">
                    <span className="text-[10px] font-semibold text-[#008489] uppercase tracking-wider block mb-1">
                      Afternoon · 01:00 PM
                    </span>
                    <h4 className="font-bold text-[#222222] text-xs">Spice Plantation Tour</h4>
                    <p className="text-[11px] text-[#717171] mt-0.5">Goan lunch · 3.0h</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F7F7F7] border border-[#DDDDDD]">
                    <span className="text-[10px] font-semibold text-[#008489] uppercase tracking-wider block mb-1">
                      Evening · 05:30 PM
                    </span>
                    <h4 className="font-bold text-[#222222] text-xs">Palolem Sunset Cruise</h4>
                    <p className="text-[11px] text-[#717171] mt-0.5">Nature & leisure · 2.5h</p>
                  </div>
                </div>
              </div>

              {/* Right Trip Snapshot & Inclusions Box */}
              <div className="lg:col-span-5 bg-[#F7F7F7] rounded-xl p-6 border border-[#DDDDDD] space-y-5">
                <div>
                  <span className="text-xs font-semibold text-[#008489] uppercase tracking-wider block mb-1">
                    Trip Inclusions & Pricing
                  </span>
                  <h4 className="text-lg font-bold text-[#222222]">Relaxed Coastal Expedition</h4>
                  <p className="text-xs text-[#717171] mt-0.5">
                    Balanced scenic landscapes, coastal trails, and comfortable pacing.
                  </p>
                </div>

                {/* Practical Inclusions List */}
                <div className="space-y-2.5 pt-2 border-t border-[#DDDDDD] text-xs">
                  <div className="flex items-start justify-between p-2.5 rounded-lg bg-white border border-[#DDDDDD]">
                    <div className="flex items-center gap-2">
                      <Hotel className="w-4 h-4 text-[#008489] shrink-0" />
                      <div>
                        <div className="font-semibold text-[#222222]">Curated 4-Star Heritage Stay</div>
                        <div className="text-[11px] text-[#717171]">₹3,200/night · 1 Room (2 Guests)</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#008489] font-medium bg-teal-50 px-2 py-0.5 rounded">Included</span>
                  </div>

                  <div className="flex items-start justify-between p-2.5 rounded-lg bg-white border border-[#DDDDDD]">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#008489] shrink-0" />
                      <div>
                        <div className="font-semibold text-[#222222]">Personal Car / Two-Wheeler</div>
                        <div className="text-[11px] text-[#717171]">Fuel & Toll Budget · ₹0 Rental Fee</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#008489] font-medium bg-teal-50 px-2 py-0.5 rounded">Included</span>
                  </div>

                  <div className="flex items-start justify-between p-2.5 rounded-lg bg-white border border-[#DDDDDD]">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#008489] shrink-0" />
                      <div>
                        <div className="font-semibold text-[#222222]">Sightseeing & Activities</div>
                        <div className="text-[11px] text-[#717171]">Fort Aguada (Free Entry) + Palolem Cruise</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#008489] font-medium bg-teal-50 px-2 py-0.5 rounded">Itemized</span>
                  </div>
                </div>

                {/* Budget Adherence Bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-[#717171]">Budget Adherence (₹23,635 / ₹25,000)</span>
                    <span className="text-[#008489] font-semibold font-mono">94.5% Used</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#DDDDDD] overflow-hidden">
                    <div className="h-full bg-[#008489] rounded-full w-[94.5%]" />
                  </div>
                </div>

                {/* Call to action within preview */}
                <div className="pt-3 border-t border-[#DDDDDD] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#717171] block">Try with your preferences</span>
                    <strong className="text-xs text-[#222222]">Ready in 2 seconds</strong>
                  </div>
                  <Link to="/planner">
                    <TemplateButton variant="default" size="sm">
                      Create Your Trip →
                    </TemplateButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
TemplateHero.displayName = "TemplateHero";

// Main Component Default Export
export default function Component() {
  return (
    <main className="min-h-screen bg-[#F7F7F7] text-[#222222]">
      <TemplateNavigation />
      <TemplateHero />
    </main>
  );
}
