import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import NewestUpdate from '../components/NewestUpdate';
import { fetchLatestChapterFeed, type LatestChapterFeedItem } from '../lib/manwhaApi';

const PAGE_SIZE = 12;

export default function LatestUpdates() {
  const [updates, setUpdates] = useState<LatestChapterFeedItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadLatestUpdates = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const items = await fetchLatestChapterFeed();

        if (isActive) {
          setUpdates(items);
          setVisibleCount(PAGE_SIZE);
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

    void loadLatestUpdates();

    return () => {
      isActive = false;
    };
  }, []);

  const visibleUpdates = updates.slice(0, visibleCount);
  const hasMoreUpdates = visibleCount < updates.length;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-[var(--color-bg-secondary)] rounded-full" />
          <h1 className="text-3xl font-bold">Latest Updates</h1>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-white/5 bg-[var(--color-bg-primary)]/80 p-8 text-center text-[var(--color-secondary)]">
            Loading latest chapter feed...
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && updates.length === 0 && (
          <div className="rounded-xl border border-white/5 bg-[var(--color-bg-primary)]/80 p-8 text-center text-[var(--color-secondary)]">
            No recent chapter updates were returned.
          </div>
        )}

        {!isLoading && !errorMessage && updates.length > 0 && (
          <>
            <div className="space-y-4">
              {visibleUpdates.map((update) => (
                <NewestUpdate
                  key={`${update.slug}-${update.chapterNumber}-${update.timeAgo}`}
                  slug={update.slug}
                  title={update.title}
                  imageUrl={update.imageUrl}
                  chapterLabel={update.chapterLabel}
                  chapterNumber={update.chapterNumber}
                  timeAgo={update.timeAgo}
                />
              ))}
            </div>

            {hasMoreUpdates && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="px-6 py-2 bg-[var(--color-bg-thirdy)] hover:bg-[var(--color-bg-secondary)] rounded-full text-sm font-medium transition-colors border border-white/5"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
