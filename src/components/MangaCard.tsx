import { Star } from 'lucide-react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

interface ChapterInfo {
  number: string;
  label: string;
  time: string;
}

interface MangaCardProps {
  slug: string;
  title: string;
  imageUrl: string;
  chapters: ChapterInfo[];
  rating?: number;
}

const MangaCard: FC<MangaCardProps> = ({
  slug,
  title,
  imageUrl,
  chapters,
  rating,
}) => {
  return (
    <div className="group relative block bg-[var(--color-bg-primary)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-bounce-top h-full flex flex-col">
      <div className="absolute inset-0 border-2 border-white/30 group-hover:border-blue-500 rounded-lg pointer-events-none z-20 transition-colors duration-300" />

      <Link to={`/series/${slug}`} className="aspect-[3/4] overflow-hidden relative block">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-bg-thirdy)] text-sm text-white/50">
            No cover image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {typeof rating === 'number' && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 text-xs font-medium text-yellow-400 border border-white/10">
            <Star className="w-3 h-3 fill-yellow-400" />
            {rating}
          </div>
        )}
      </Link>

      <div className="p-4 relative flex-1 flex flex-col">
        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-bg-secondary)] transition-all duration-300 group-hover:w-full" />

        <Link to={`/series/${slug}`}>
          <h3 className="font-bold text-lg text-white truncate group-hover:text-[var(--color-bg-secondary)] transition-colors mb-3">
            {title}
          </h3>
        </Link>

        {chapters.length > 0 ? (
          <div className="flex flex-col gap-2 mt-auto">
            {chapters.slice(0, 3).map((chapter) => (
              <div
                key={`${slug}-${chapter.number}`}
                className="flex items-center justify-between text-sm text-[var(--color-secondary)] hover:bg-white/5 p-1 rounded transition-colors gap-2"
              >
                <Link
                  to={`/readchapter/${slug}/chapter/${chapter.number}`}
                  className="bg-[var(--color-bg-thirdy)] px-2 py-0.5 rounded text-xs hover:bg-[var(--color-bg-secondary)] hover:text-white transition-colors"
                >
                  {chapter.label}
                </Link>
                <span className="text-xs opacity-70 text-right">{chapter.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-auto text-sm text-[var(--color-secondary)]">No recent chapters available.</div>
        )}
      </div>
    </div>
  );
};

export default MangaCard;
