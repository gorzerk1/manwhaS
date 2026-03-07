import { useState, useEffect, type ChangeEvent, type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ChevronsUp, List } from 'lucide-react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ProgressiveImage: FC<ProgressiveImageProps> = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (src.includes('picsum.photos')) {
      return `${src}?blur=10&w=50`;
    }

    return src;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const lowResSrc = src.includes('picsum.photos') ? `${src}?blur=10&w=50` : src;
    setImgSrc(lowResSrc);
    setIsLoaded(false);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${isLoaded ? 'blur-0' : 'blur-sm scale-105'}`}
        referrerPolicy="no-referrer"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse">
          <div className="w-8 h-8 border-2 border-[var(--color-bg-secondary)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

interface ChapterProps {
  mangaSlug: string;
  title: string;
  chapterNumber: string;
  images: string[];
  prevChapter?: string;
  nextChapter?: string;
  chapters: Array<{
    number: string;
    label: string;
  }>;
}

export default function Chapter({
  mangaSlug,
  title,
  chapterNumber,
  images,
  prevChapter,
  nextChapter,
  chapters,
}: ChapterProps) {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(() => {
    if (typeof window === 'undefined') {
      return 100;
    }

    const stored = window.localStorage.getItem('readerZoom');
    const parsed = stored ? Number(stored) : 100;
    return Number.isFinite(parsed) ? parsed : 100;
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const chapterLabel = `Chapter ${chapterNumber}`;
  const chapterOptions = chapters.some((chapter) => chapter.number === chapterNumber)
    ? chapters
    : [{ number: chapterNumber, label: chapterLabel }, ...chapters];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterNumber]);

  useEffect(() => {
    window.localStorage.setItem('readerZoom', String(zoom));
  }, [zoom]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleZoomIn = () => setZoom((currentZoom) => Math.min(currentZoom + 10, 150));
  const handleZoomOut = () => setZoom((currentZoom) => Math.max(currentZoom - 10, 50));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChapterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    navigate(`/readchapter/${mangaSlug}/chapter/${event.target.value}`);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 py-8 relative">
      <div className="w-full space-y-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white tracking-tight">
          {title}
        </h1>

        <div className="w-full bg-[var(--color-bg-primary)] py-3 px-4 rounded-lg border border-white/5 text-center text-sm md:text-base text-gray-400 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2 text-gray-600">&gt;</span>
          <Link to={`/series/${mangaSlug}`} className="hover:text-white transition-colors">{title}</Link>
          <span className="mx-2 text-gray-600">&gt;</span>
          <span className="text-white">{chapterLabel}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 bg-[var(--color-bg-primary)] p-4 rounded-xl border border-white/5 shadow-lg sticky top-20 z-40">
          <Link
            to={prevChapter ? `/readchapter/${mangaSlug}/chapter/${prevChapter}` : '#'}
            className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${!prevChapter ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>

          <div className="relative">
            <select
              value={chapterNumber}
              onChange={handleChapterChange}
              className="appearance-none bg-[var(--color-bg-thirdy)] text-white pl-4 pr-10 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--color-bg-secondary)] cursor-pointer"
            >
              {chapterOptions.map((chapter) => (
                <option key={chapter.number} value={chapter.number}>
                  {chapter.label}
                </option>
              ))}
            </select>
            <List className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
          </div>

          <Link
            to={nextChapter ? `/readchapter/${mangaSlug}/chapter/${nextChapter}` : '#'}
            className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${!nextChapter ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Link>

          <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />

          <div className="flex items-center gap-2 hidden sm:flex">
            <button onClick={handleZoomOut} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
            <span className="text-sm font-mono text-[var(--color-secondary)] w-12 text-center">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ZoomIn className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col items-center gap-0 w-full transition-all duration-300"
        style={{ width: `${zoom}%` }}
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <ProgressiveImage
              key={index}
              src={image}
              alt={`Page ${index + 1}`}
              className="w-full h-auto shadow-2xl"
            />
          ))
        ) : (
          <div className="w-full rounded-xl border border-white/5 bg-[var(--color-bg-primary)] p-8 text-center text-[var(--color-secondary)]">
            No chapter pages were returned for this chapter.
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl mt-12 flex items-center justify-between bg-[var(--color-bg-primary)] p-6 rounded-xl border border-white/5">
        <Link
          to={prevChapter ? `/readchapter/${mangaSlug}/chapter/${prevChapter}` : '#'}
          className={`flex items-center gap-2 text-white hover:text-[var(--color-bg-secondary)] transition-colors ${!prevChapter ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Previous Chapter</span>
        </Link>

        <Link
          to={nextChapter ? `/readchapter/${mangaSlug}/chapter/${nextChapter}` : '#'}
          className={`flex items-center gap-2 text-white hover:text-[var(--color-bg-secondary)] transition-colors ${!nextChapter ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <span className="font-medium">Next Chapter</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      <div className={`fixed bottom-8 left-4 z-50 flex flex-col items-center bg-[#1e2329]/90 backdrop-blur-md border border-white/10 rounded-full py-2 px-1.5 gap-2 shadow-2xl transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button
          onClick={scrollToTop}
          className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
          aria-label="Scroll to top"
        >
          <ChevronsUp className="w-4 h-4" />
        </button>

        <div className="w-4 h-px bg-white/10" />

        <button
          onClick={handleZoomIn}
          className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
