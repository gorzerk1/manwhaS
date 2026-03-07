const DEFAULT_API_BASE_URL = 'https://server.manhwawut.online';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

type RawLatestUpdatesResponseItem = {
  key: string;
  title?: string;
  image?: string;
  chapters?: Array<{
    number: number | string;
    name?: string;
    time?: string;
  }>;
};

type RawDescriptionResponse = {
  name?: string;
  imagelogo?: string;
  synopsis?: string;
  author?: string;
  artist?: string;
  updatedOn?: string;
  genres?: string[];
  keywords?: string[];
  sideImage?: string;
};

type RawSeriesDescriptionFile = {
  name?: string;
  uploadTime?: Array<{
    chapter?: number | string;
    time?: string;
  }>;
};

type RawChapterDataResponse = {
  images?: string[];
  chapters?: string[];
  maxChapter?: number | string | null;
};

type RawFilteredManwhaResponseItem = {
  manwhaName: string;
  title?: string;
  chapter?: string;
  image?: string;
  timeAgo?: string;
};

export type HomeCardChapter = {
  number: string;
  label: string;
  time: string;
};

export type HomeCardItem = {
  slug: string;
  title: string;
  imageUrl: string;
  chapters: HomeCardChapter[];
};

export type LatestChapterFeedItem = {
  slug: string;
  title: string;
  imageUrl: string;
  chapterNumber: string;
  chapterLabel: string;
  timeAgo: string;
};

export type SeriesDetails = {
  slug: string;
  title: string;
  logoUrl: string;
  sideImageUrl: string;
  synopsis: string;
  author: string;
  artist: string;
  updatedOn: string;
  genres: string[];
  keywords: string[];
  status: string;
  type: string;
};

export type SeriesChapterListItem = {
  id: string;
  number: string;
  label: string;
  date: string;
};

export type ReaderChapterOption = {
  number: string;
  label: string;
};

export type ReaderChapterData = {
  title: string;
  chapterNumber: string;
  images: string[];
  chapters: ReaderChapterOption[];
  prevChapter?: string;
  nextChapter?: string;
};

type ErrorPayload = {
  error?: string;
  message?: string;
};

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const joinUrl = (base: string, path: string) =>
  `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

const toDisplayTitle = (value: string) =>
  value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();

export const formatSeriesTitle = (value: string) => toDisplayTitle(value || '');

const toMediaUrl = (value?: string) => {
  if (!value) {
    return '';
  }

  return isAbsoluteUrl(value) ? value : joinUrl(API_BASE_URL, value);
};

const normalizeChapterNumber = (value: string | number) => {
  const text = String(value).trim();

  if (!text) {
    return '';
  }

  if (/^chapter-/i.test(text)) {
    return text.replace(/^chapter-/i, '');
  }

  if (/^chapter\s+/i.test(text)) {
    return text.replace(/^chapter\s+/i, '');
  }

  return text;
};

const toChapterLabel = (number: string) => `Chapter ${number}`;

const compareChapterNumbersDesc = (left: string, right: string) => {
  const leftNumber = Number(left);
  const rightNumber = Number(right);

  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
    return rightNumber - leftNumber;
  }

  return right.localeCompare(left, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

const getDateLabel = (value?: string) => {
  if (!value) {
    return '--';
  }

  const parts = value.split(' ');
  return parts[1] || value;
};

const getErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as ErrorPayload;
    return payload.error || payload.message || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

const getJson = async <T>(path: string) => {
  const response = await fetch(joinUrl(API_BASE_URL, path));

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as T;
};

export const fetchHomeCards = async (): Promise<HomeCardItem[]> => {
  const items = await getJson<RawLatestUpdatesResponseItem[]>('/api/latest-updates');

  return items.map((item) => ({
    slug: item.key,
    title: item.title || formatSeriesTitle(item.key),
    imageUrl: toMediaUrl(item.image),
    chapters: (item.chapters || []).map((chapter) => {
      const number = normalizeChapterNumber(chapter.number);
      return {
        number,
        label: chapter.name || toChapterLabel(number),
        time: chapter.time || '--',
      };
    }),
  }));
};

export const fetchLatestChapterFeed = async (): Promise<LatestChapterFeedItem[]> => {
  const items = await getJson<RawFilteredManwhaResponseItem[]>('/api/filtered-manwhas');

  return items.map((item) => {
    const chapterNumber = normalizeChapterNumber(item.chapter || '');

    return {
      slug: item.manwhaName,
      title: item.title || formatSeriesTitle(item.manwhaName),
      imageUrl: toMediaUrl(item.image),
      chapterNumber,
      chapterLabel: item.chapter || toChapterLabel(chapterNumber),
      timeAgo: item.timeAgo || '--',
    };
  });
};

export const fetchSeriesDetails = async (slug: string): Promise<SeriesDetails> => {
  const item = await getJson<RawDescriptionResponse>(
    `/api/description/${encodeURIComponent(slug)}`
  );

  return {
    slug,
    title: formatSeriesTitle(item.name || slug),
    logoUrl: toMediaUrl(item.imagelogo),
    sideImageUrl: toMediaUrl(item.sideImage),
    synopsis: item.synopsis || '--',
    author: item.author || '--',
    artist: item.artist || '--',
    updatedOn: item.updatedOn || '--',
    genres: item.genres || [],
    keywords: item.keywords || [],
    status: 'Ongoing',
    type: 'Manhwa',
  };
};

export const fetchSeriesChapterList = async (
  slug: string
): Promise<SeriesChapterListItem[]> => {
  const item = await getJson<RawSeriesDescriptionFile>(
    `/data/jsonFiles/${encodeURIComponent(slug)}/manwhaDescription.json`
  );

  return (item.uploadTime || [])
    .filter((chapter) => chapter.chapter && chapter.time)
    .map((chapter) => {
      const number = normalizeChapterNumber(chapter.chapter || '');
      return {
        id: `${slug}-${number}`,
        number,
        label: toChapterLabel(number),
        date: getDateLabel(chapter.time),
      };
    })
    .sort((left, right) => compareChapterNumbersDesc(left.number, right.number));
};

export const fetchReaderChapterData = async (
  slug: string,
  chapterNumber: string
): Promise<ReaderChapterData> => {
  const item = await getJson<RawChapterDataResponse>(
    `/api/chapter-data/${encodeURIComponent(slug)}/${encodeURIComponent(chapterNumber)}`
  );

  const chapters = (item.chapters || [])
    .map((chapter) => normalizeChapterNumber(chapter))
    .filter(Boolean)
    .sort(compareChapterNumbersDesc)
    .map((number) => ({
      number,
      label: toChapterLabel(number),
    }));

  const currentIndex = chapters.findIndex((chapter) => chapter.number === chapterNumber);

  return {
    title: formatSeriesTitle(slug),
    chapterNumber,
    images: (item.images || []).map((image) => toMediaUrl(image)),
    chapters,
    prevChapter:
      currentIndex >= 0 && currentIndex < chapters.length - 1
        ? chapters[currentIndex + 1]?.number
        : undefined,
    nextChapter: currentIndex > 0 ? chapters[currentIndex - 1]?.number : undefined,
  };
};
