// components/layout/Footer.tsx
import { Link } from 'react-router-dom';
import { Gavel } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#242424] border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Gavel className="h-6 w-6 text-[#256af4]" />
              <span className="text-xl font-bold text-white">AuctionHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted platform for online auctions. Buy and sell with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/marketplace" className="text-gray-400 hover:text-white transition">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/dashboard/my-items" className="text-gray-400 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© {currentYear} AuctionHub. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">
              Facebook
            </a>
            <a href="#" className="hover:text-white transition">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
