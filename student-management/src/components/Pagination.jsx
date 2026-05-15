const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Don't show pagination if there's only 1 page or no pages
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <span className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>

      <div className="flex gap-2">
        {/* Previous button — disabled on first page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          ← Prev
        </button>

        {/* Next button — disabled on last page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;