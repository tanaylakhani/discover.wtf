import Link from "next/link";
import { Globe, Chrome, Twitter, Github, Mail } from "lucide-react";

export default function Component() {
  return (
    <footer className="w-full py-12 px-4">
      <div className="max-w-5xl mx-auto bg-black font-inter rounded-3xl p-8 md:p-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">Discover.wtf</span>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed max-w-md">
              Uncover the weird, wonderful, and forgotten corners of the
              internet. Our browser extension helps you explore beyond the
              mainstream and interact with the web's hidden gems.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Chrome className="h-4 w-4" />
                Get Extension
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Explore</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="#"
                className="text-slate-300 hover:text-purple-400 text-sm transition-colors"
              >
                Random Discovery
              </Link>
              <Link
                href="#"
                className="text-slate-300 hover:text-purple-400 text-sm transition-colors"
              >
                Weird Websites
              </Link>
              <Link
                href="#"
                className="text-slate-300 hover:text-purple-400 text-sm transition-colors"
              >
                Hidden Gems
              </Link>
              <Link
                href="#"
                className="text-slate-300 hover:text-purple-400 text-sm transition-colors"
              >
                Community Finds
              </Link>
            </nav>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Support</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="#"
                className="text-slate-300 hover:text-purple-400 text-sm transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="#"
                className="text-slate-300 hover:text-purple-400 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-slate-300 hover:text-purple-400 text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-slate-300 hover:text-purple-400 text-sm transition-colors"
              >
                Contact Us
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} discover.wtf - Embrace the weird web
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-slate-400 hover:text-purple-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-slate-400 hover:text-purple-400 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-slate-400 hover:text-purple-400 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
