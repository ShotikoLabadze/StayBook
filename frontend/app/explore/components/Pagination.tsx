"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 pt-10 mt-6 border-t border-border-subtle w-full select-none">
      <button
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle bg-card-bg text-text-muted hover:bg-neutral-bg hover:text-primary disabled:opacity-30 disabled:hover:bg-card-bg disabled:hover:text-text-muted transition-all cursor-pointer shadow-3xs"
        aria-label="Previous page"
      >
        <svg
          className="w-4 h-4 stroke-[2.5]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <span className="text-xs font-bold text-primary font-headline tracking-wide">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle bg-card-bg text-text-muted hover:bg-neutral-bg hover:text-primary disabled:opacity-30 disabled:hover:bg-card-bg disabled:hover:text-text-muted transition-all cursor-pointer shadow-3xs"
        aria-label="Next page"
      >
        <svg
          className="w-4 h-4 stroke-[2.5]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
