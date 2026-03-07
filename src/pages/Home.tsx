import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MangaCard from '../components/MangaCard';
import { fetchHomeCards, type HomeCardItem } from '../lib/manwhaApi';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [manga, setManga] = useState<HomeCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    let isActive = true;

    const loadHomeCards = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const items = await fetchHomeCards();

        if (isActive) {
          setManga(items);
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(error instanceof Error ? error.message : 'Failed to load latest updates.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadHomeCards();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredManga = manga.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    const nextParams = new URLSearchParams(searchParams);

    if (value.trim()) {
      nextParams.set('search', value);
    } else {
      nextParams.delete('search');
    }

    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Navbar searchValue={searchQuery} onSearchChange={handleSearchChange} />

      <main className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[var(--color-bg-secondary)] rounded-full" />
            Latest Updates
          </h2>
          <Link
            to="/lastedUpdate"
            className="text-sm text-[var(--color-bg-secondary)] hover:text-white transition-colors font-medium"
          >
            View All
          </Link>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-white/5 bg-[var(--color-bg-primary)]/80 p-8 text-center text-[var(--color-secondary)]">
            Loading latest updates...
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && filteredManga.length === 0 && (
          <div className="rounded-xl border border-white/5 bg-[var(--color-bg-primary)]/80 p-8 text-center text-[var(--color-secondary)]">
            {searchQuery ? `No manga found for "${searchQuery}".` : 'No manga updates were returned.'}
          </div>
        )}

        {!isLoading && !errorMessage && filteredManga.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredManga.map((item) => (
              <MangaCard
                key={item.slug}
                slug={item.slug}
                title={item.title}
                imageUrl={item.imageUrl}
                chapters={item.chapters}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
