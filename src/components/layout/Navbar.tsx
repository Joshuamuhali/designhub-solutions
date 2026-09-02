import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, Home, FileText, Mail, ChevronDown, Rocket, Palette, Globe, Cpu, Megaphone, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getRoleDefinition, getRouteForRole } from "@/lib/roleSystem";
import { PRODUCT_CATEGORIES } from "@/data/products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/designhub-logo.png";

// Public navigation links
const publicNavLinks = [
  { name: "Home", path: "/" },
  { name: "Solutions", path: "/solutions", hasDropdown: true },
  { name: "Industries", path: "/industries" },
  { name: "Work", path: "/work" },
  { name: "About", path: "/about" },
  { name: "Insights", path: "/insights" },
  { name: "Contact", path: "/contact" },
];

// Dashboard navigation links with icons
const dashboardNavLinks = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "Projects", path: "/dashboard/projects", icon: FileText },
  { name: "Clients", path: "/dashboard/clients", icon: User },
  { name: "Support", path: "/dashboard/support", icon: Mail },
];

const categoryIcons: Record<string, any> = {
  Start: Rocket,
  Brand: Palette,
  Digital: Globe,
  Systems: Cpu,
  Market: Megaphone,
  Sales: TrendingUp,
  Grow: BarChart3,
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Determine navigation links based on current path
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const currentNavLinks = isDashboard ? dashboardNavLinks : publicNavLinks;

  // Get user role information
  const userRole = user?.user_metadata?.role || 'client';
  const roleDefinition = getRoleDefinition(userRole);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm transition-all ${
      isDashboard ? 'bg-muted/90' : ''
    }`}>
      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={user ? getRouteForRole(userRole) : '/'} className="flex items-center gap-3">
            <img src={logo} alt="Designhub Logo" className="h-10 w-auto" />
            {user && (
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                {roleDefinition.title}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {currentNavLinks.map((link) => {
              if (link.hasDropdown && !isDashboard) {
                return (
                  <DropdownMenu key={link.path}>
                    <DropdownMenuTrigger className={`text-sm font-medium transition-colors flex items-center gap-1.5 focus:outline-none ${
                      location.pathname.startsWith('/solutions')
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}>
                      <span>Solutions</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-80 p-2 shadow-xl border-border/80 rounded-xl bg-card/95 backdrop-blur-md">
                      <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Our Solution Categories
                      </div>
                      <DropdownMenuSeparator />
                      {PRODUCT_CATEGORIES.map((cat) => {
                        const Icon = categoryIcons[cat.name] || Globe;
                        return (
                          <DropdownMenuItem
                            key={cat.id}
                            onClick={() => navigate(`/solutions?category=${cat.id}`)}
                            className="flex items-start gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-foreground flex items-center gap-1">
                                {cat.name} — <span className="font-normal text-muted-foreground">{cat.title}</span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {cat.headline}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        );
                      })}
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuItem
                        onClick={() => navigate('/solutions')}
                        className="p-2 text-center text-xs font-bold text-primary flex items-center justify-center gap-1 cursor-pointer"
                      >
                        View Full Solution Catalog
                        <ArrowRight className="w-3.5 h-3.5" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              const Icon = (link as any).icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors link-underline flex items-center gap-2 ${
                    location.pathname === link.path
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <AuthButtons user={user} onSignOut={handleSignOut} />
            ) : (
              <>
                {!isDashboard && (
                  <Button
                    asChild
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md rounded-lg px-4"
                  >
                    <Link to="/project-consultation">
                      Book a Consultation
                    </Link>
                  </Button>
                )}
                {!isAuthPage && !user && (
                  <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                    <Link to="/login">Log In</Link>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground rounded-lg hover:bg-accent focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-up max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col gap-2">
              {currentNavLinks.map((link) => {
                const Icon = (link as any).icon;
                return (
                  <div key={link.path}>
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-sm font-semibold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                        location.pathname === link.path
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4 text-primary" />}
                        {link.name}
                      </span>
                    </Link>

                    {/* Solutions Sub-categories on Mobile */}
                    {link.hasDropdown && (
                      <div className="pl-4 pr-2 py-2 grid grid-cols-1 gap-1 my-1 bg-muted/40 rounded-lg border border-border/50">
                        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 px-2">
                          Solution Categories
                        </div>
                        {PRODUCT_CATEGORIES.map((cat) => {
                          const CatIcon = categoryIcons[cat.name] || Globe;
                          return (
                            <Link
                              key={cat.id}
                              to={`/solutions?category=${cat.id}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-2.5 py-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded hover:bg-background/80"
                            >
                              <CatIcon className="w-3.5 h-3.5 text-primary" />
                              <span className="font-bold text-foreground">{cat.name}</span>
                              <span className="text-muted-foreground truncate">— {cat.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Mobile Auth & CTA Buttons */}
              <div className="flex flex-col gap-2.5 mt-3 pt-3 border-t border-border">
                {user ? (
                  <>
                    <div className="px-2 py-1 text-xs text-muted-foreground">
                      Signed in as <span className="font-medium text-foreground">{user.email}</span>
                    </div>
                    <Button variant="outline" className="w-full justify-start" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full bg-primary text-primary-foreground font-semibold" asChild>
                      <Link to="/project-consultation" onClick={() => setIsOpen(false)}>
                        Book a Consultation
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-center" asChild>
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        Log In
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function AuthButtons({ user, onSignOut }: { user: any; onSignOut: () => void }) {
  const navigate = useNavigate();
  const userRole = user?.user_metadata?.role || 'client';
  const roleDefinition = getRoleDefinition(userRole);

  return (
    <div className="flex items-center gap-3">
      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 font-medium">
            <User className="h-4 w-4 text-primary" />
            <span className="hidden sm:block">
              {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2 text-xs text-muted-foreground">
            <div className="font-semibold text-foreground truncate">{user.email}</div>
            <div className="text-[11px] text-primary font-medium mt-0.5">{roleDefinition.title}</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(getRouteForRole(userRole))}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
