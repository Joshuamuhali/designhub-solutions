import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, Home, Briefcase, FileText, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getRoleDefinition, getRouteForRole } from "@/lib/roleSystem";
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
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "FAQ", path: "/faq" },
  { name: "Contact", path: "/contact" },
];

// Dashboard navigation links with icons
const dashboardNavLinks = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "Projects", path: "/dashboard/projects", icon: FileText },
  { name: "Clients", path: "/dashboard/clients", icon: User },
  { name: "Support", path: "/dashboard/support", icon: Mail },
];

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
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border ${
      isDashboard ? 'bg-muted/80' : ''
    }`}>
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={user ? getRouteForRole(userRole) : '/'} className="flex items-center">
            <img src={logo} alt="Designhub Logo" className="h-10 w-auto" />
            {user && (
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                {roleDefinition.title}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {currentNavLinks.map((link) => {
              const Icon = (link as any).icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors link-underline flex items-center gap-2 ${
                    location.pathname === link.path
                      ? "text-primary"
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
                {!isAuthPage && (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-up">
            <div className="flex flex-col gap-4">
              {currentNavLinks.map((link) => {
                const Icon = (link as any).icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium py-2 transition-colors flex items-center gap-2 ${
                      location.pathname === link.path
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {link.name}
                  </Link>
                );
              })}
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                {user ? (
                  <>
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      Signed in as {user.email}
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  !isAuthPage && (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          Log In
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link to="/signup" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )
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
      {/* Role Badge */}
      <div className="hidden sm:block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
        {roleDefinition.title}
      </div>
      
      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:block">
              {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            {user.email}
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
          <DropdownMenuItem onClick={onSignOut} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
