import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowRight, MessageSquare } from "lucide-react";
import logo from "@/assets/designhub-logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-800">
      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Designhub Logo" className="h-10 w-auto brightness-200" />
            </Link>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Business, Digital & Growth Solutions
              </p>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                We help businesses build, market, sell and operate better — from professional branding and websites to custom software, marketing, sales, and strategic business growth solutions.
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold rounded-full">
                Build Better. Grow Smarter.
              </span>
            </div>
          </div>

          {/* Solution Links Col 1 */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Build & Digitise
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/solutions?category=start" className="hover:text-emerald-400 transition-colors">
                  Business Starter Package
                </Link>
              </li>
              <li>
                <Link to="/solutions?category=brand" className="hover:text-emerald-400 transition-colors">
                  Logo & Business Branding
                </Link>
              </li>
              <li>
                <Link to="/solutions?category=brand" className="hover:text-emerald-400 transition-colors">
                  Company Profiles
                </Link>
              </li>
              <li>
                <Link to="/solutions?category=digital" className="hover:text-emerald-400 transition-colors">
                  Business Websites
                </Link>
              </li>
              <li>
                <Link to="/solutions?category=digital" className="hover:text-emerald-400 transition-colors">
                  E-Commerce Platforms
                </Link>
              </li>
            </ul>
          </div>

          {/* Solution Links Col 2 */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Systems, Sales & Growth
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/solutions?category=systems" className="hover:text-emerald-400 transition-colors">
                  Customer CRM Systems
                </Link>
              </li>
              <li>
                <Link to="/solutions?category=systems" className="hover:text-emerald-400 transition-colors">
                  Business Management Software
                </Link>
              </li>
              <li>
                <Link to="/solutions?category=market" className="hover:text-emerald-400 transition-colors">
                  Marketing & Lead Generation
                </Link>
              </li>
              <li>
                <Link to="/solutions?category=sales" className="hover:text-emerald-400 transition-colors">
                  Sales Team Management
                </Link>
              </li>
              <li>
                <Link to="/solutions?category=grow" className="hover:text-emerald-400 transition-colors">
                  Business Health Check-Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Talk to Designhub
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:0974399695" className="hover:text-white transition-colors">
                  0974 399 695
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:info@designhub.co.zm" className="hover:text-white transition-colors">
                  info@designhub.co.zm
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>Lusaka, Zambia</span>
              </li>
              <li className="pt-2">
                <a
                  href="https://wa.me/0974399695?text=Hi%20Designhub!%20I'd%20like%20to%20discuss%20a%20solution%20for%20my%20business."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp Us Direct
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} Designhub Marketing Agency Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300">About Designhub</Link>
            <Link to="/solutions" className="hover:text-slate-300">Solution Catalog</Link>
            <Link to="/work" className="hover:text-slate-300">Case Studies</Link>
            <Link to="/contact" className="hover:text-slate-300">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
