import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MainChapter from '../components/MainChapter';
import ScrollChapter from '../components/ScrollChapter';
import {
  fetchSeriesChapterList,
  fetchSeriesDetails,
  formatSeriesTitle,
  type SeriesChapterListItem,
  type SeriesDetails,
} from '../lib/manwhaApi';

export default function Series() {
  const { mangaName } = useParams();
  const [details, setDetails] = useState<SeriesDetails | null>(null);
  const [chapters, setChapters] = useState<SeriesChapterListItem[]>([]);
  const [isDetailsLoading, setIsDetailsLoading] = useState(true);
  const [isChaptersLoading, setIsChaptersLoading] = useState(true);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [chaptersError, setChaptersError] = useState<string | null>(null);

  useEffect(() => {
    if (!mangaName) {
      setDetailsError('Series slug is missing.');
      setIsDetailsLoading(false);
      setIsChaptersLoading(false);
      return;
    }

    let isActive = true;

    const loadSeriesDetails = async () => {
      setIsDetailsLoading(true);
      setDetailsError(null);

      try {
        const item = await fetchSeriesDetails(mangaName);

        if (isActive) {
          setDetails(item);
        }
      } catch (error) {
        if (isActive) {
          setDetailsError(error instanceof Error ? error.message : 'Failed to load series details.');
        }
      } finally {
        if (isActive) {
          setIsDetailsLoading(false);
        }
      }
    };

    const loadSeriesChapters = async () => {
      setIsChaptersLoading(true);
      setChaptersError(null);

      try {
        const items = await fetchSeriesChapterList(mangaName);

        if (isActive) {
          setChapters(items);
        }
      } catch (error) {
        if (isActive) {
          setChaptersError(error instanceof Error ? error.message : 'Failed to load chapter list.');
        }
      } finally {
        if (isActive) {
          setIsChaptersLoading(false);
        }
      }
    };

    void Promise.all([loadSeriesDetails(), loadSeriesChapters()]);

    return () => {
      isActive = false;
    };
  }, [mangaName]);

  const displayTitle = details?.title || formatSeriesTitle(mangaName || 'Series');

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-[var(--color-secondary)] mb-6">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span>Series</span>
          <span>/</span>
          <span className="text-white font-medium">{displayTitle}</span>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="w-full space-y-8">
            {isDetailsLoading && (
              <div className="rounded-xl border border-white/5 bg-[var(--color-bg-primary)]/80 p-8 text-center text-[var(--color-secondary)]">
                Loading series details...
              </div>
            )}

            {!isDetailsLoading && detailsError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">
                {detailsError}
              </div>
            )}

            {!isDetailsLoading && !detailsError && details && <MainChapter {...details} />}

            <ScrollChapter
              mangaSlug={mangaName || ''}
              chapters={chapters}
              isLoading={isChaptersLoading}
              errorMessage={chaptersError}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
