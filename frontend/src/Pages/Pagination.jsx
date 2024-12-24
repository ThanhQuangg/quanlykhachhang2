// import React from "react";

// function Pagination({ currentPage, totalPages, onPageChange }) {
//     if (totalPages === 0) return null;
//     const isPreviousDisabled = currentPage === 0;
//     const isNextDisabled = totalPages === 0 || currentPage >= totalPages - 1;

//     return (
//         <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
//              <button
//                 className="btn btn-secondary btn-sm"
//                 onClick={() => onPageChange(0)}
//                 disabled={isPreviousDisabled}
//             >
//                 First
//             </button>
//             <button
//                 className="btn btn-secondary btn-sm"
//                 onClick={() => onPageChange(currentPage - 1)}
//                 disabled={isPreviousDisabled}
//             >
//                 Previous
//             </button>
//             <span>
//                 Page {currentPage + 1} of {totalPages}
//             </span>
//             <button
//                 className="btn btn-secondary btn-sm"
//                 onClick={() => onPageChange(currentPage + 1)}
//                 disabled={isNextDisabled}
//             >
//                 Next
//             </button>
//             <button
//                 className="btn btn-secondary btn-sm"
//                 onClick={() => onPageChange(totalPages - 1)}
//                 disabled={isNextDisabled}
//             >
//                 Last
//             </button>
//         </div>
//     );
// }

// export default Pagination;