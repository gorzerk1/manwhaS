import { Search, Menu, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function Navbar({ searchValue = '', onSearchChange }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const location = useLocation();
  const navigate = useNavigate();
  const searchEnabled = true;
  const isControlledSearch = typeof onSearchChange === 'function';

  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  const currentSearchValue = isControlledSearch ? searchValue : localSearchValue;

  const handleSearchChange = (value: string) => {
    if (isControlledSearch) {
      onSearchChange(value);
      return;
    }

    setLocalSearchValue(value);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isControlledSearch && location.pathname === '/') {
      return;
    }

    const trimmedValue = currentSearchValue.trim();
    const target = trimmedValue
      ? `/?search=${encodeURIComponent(trimmedValue)}`
      : '/';

    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    navigate(target);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--color-bg-secondary)] shadow-lg border-b border-white/10">
      <div className="w-full max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-[var(--color-bg-secondary)] font-bold text-xl group-hover:scale-110 transition-transform">
            M
          </div>
          <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
            MangaReader
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-white/90 hover:text-white font-medium transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
          </Link>
          <Link to="/lastedUpdate" className="text-white/90 hover:text-white font-medium transition-colors relative group">
            Latest Updates
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {searchEnabled && (
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search manga..."
                value={currentSearchValue}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="bg-black/20 text-white placeholder-white/50 px-4 py-1.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/30 w-48 transition-all focus:w-64 border border-transparent focus:border-white/20"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                aria-label="Search manga"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          )}

          {searchEnabled && (
            <button
              className="sm:hidden text-white p-1"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-6 h-6" />
            </button>
          )}

          <button
            className="md:hidden text-white p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {searchEnabled && (
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden bg-[var(--color-bg-secondary)] border-t border-white/10 overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="p-4">
                <input
                  type="text"
                  placeholder="Search manga..."
                  value={currentSearchValue}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  className="w-full bg-black/20 text-white placeholder-white/50 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/30 border border-transparent focus:border-white/20"
                  autoFocus
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[var(--color-bg-primary)] border-t border-white/10 overflow-hidden absolute w-full shadow-xl"
          >
            <div className="flex flex-col p-4 gap-4">
              <Link
                to="/"
                className="text-white/90 hover:text-[var(--color-bg-secondary)] font-medium transition-colors p-2 hover:bg-white/5 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/lastedUpdate"
                className="text-white/90 hover:text-[var(--color-bg-secondary)] font-medium transition-colors p-2 hover:bg-white/5 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Latest Updates
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
