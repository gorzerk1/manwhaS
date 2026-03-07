import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Chapter from '../components/Chapter';
import {
  fetchReaderChapterData,
  formatSeriesTitle,
  type ReaderChapterData,
} from '../lib/manwhaApi';

export default function Reader() {
  const { mangaName, chapterNumber } = useParams();
  const [readerData, setReaderData] = useState<ReaderChapterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!mangaName || !chapterNumber) {
      setReaderData(null);
      setErrorMessage('Chapter route is incomplete.');
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadReaderData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const item = await fetchReaderChapterData(mangaName, chapterNumber);

        if (isActive) {
          setReaderData(item);
        }
      } catch (error) {
        if (isActive) {
          setReaderData(null);
          setErrorMessage(error instanceof Error ? error.message : 'Failed to load chapter data.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadReaderData();

    return () => {
      isActive = false;
    };
  }, [mangaName, chapterNumber]);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Navbar />

      {isLoading && (
        <div className="mx-auto mt-8 w-full max-w-7xl rounded-xl border border-white/5 bg-[var(--color-bg-primary)]/80 p-8 text-center text-[var(--color-secondary)]">
          Loading chapter pages...
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="mx-auto mt-8 w-full max-w-7xl rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && readerData && (
        <Chapter
          mangaSlug={mangaName || ''}
          title={readerData.title || formatSeriesTitle(mangaName || 'Unknown Series')}
          chapterNumber={chapterNumber || '1'}
          images={readerData.images}
          prevChapter={readerData.prevChapter}
          nextChapter={readerData.nextChapter}
          chapters={readerData.chapters}
        />
      )}
    </div>
  );
}
