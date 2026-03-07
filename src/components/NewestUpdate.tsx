import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { FC } from 'react';

interface UpdateProps {
  slug: string;
  title: string;
  imageUrl: string;
  chapterLabel: string;
  chapterNumber: string;
  timeAgo: string;
}

const NewestUpdate: FC<UpdateProps> = ({
  slug,
  title,
  imageUrl,
  chapterLabel,
  chapterNumber,
  timeAgo,
}) => {
  return (
    <Link
      to={`/readchapter/${slug}/chapter/${chapterNumber}`}
      className="group relative block w-full h-32 md:h-24 overflow-hidden rounded-lg transition-all mb-4 shadow-md hover:shadow-lg"
    >
      <div className="absolute inset-0 border-2 border-white/30 group-hover:border-blue-500 rounded-lg pointer-events-none z-20 transition-colors duration-300" />

      <div className="absolute inset-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover opacity-40 group-hover:opacity-20 group-hover:scale-105 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full bg-[var(--color-bg-thirdy)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <div className="relative h-full flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:px-6 gap-2">
        <div className="flex items-center gap-4">
          <div className="w-1 h-full absolute left-0 top-0 bg-[var(--color-bg-secondary)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

          <div className="flex flex-col">
            <h3 className="font-bold text-lg text-white group-hover:text-[var(--color-bg-secondary)] transition-colors truncate max-w-[200px] md:max-w-md">
              {title}
            </h3>
            <div className="text-xs text-[var(--color-secondary)] mt-1">Open chapter reader</div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <span className="bg-[var(--color-bg-thirdy)] px-3 py-1 rounded text-sm font-mono text-white group-hover:bg-[var(--color-bg-secondary)] transition-colors">
            {chapterLabel}
          </span>
          <span className="flex items-center gap-1 text-xs text-[var(--color-secondary)]">
            <Clock className="w-3 h-3" /> {timeAgo}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NewestUpdate;
