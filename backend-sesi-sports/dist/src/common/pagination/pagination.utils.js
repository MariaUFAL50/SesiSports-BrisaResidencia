"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginatedResponse = createPaginatedResponse;
function createPaginatedResponse(items, totalItems, paginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const totalPages = Math.ceil(totalItems / limit);
    return {
        items,
        total: totalItems,
        page,
        limit,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
    };
}
//# sourceMappingURL=pagination.utils.js.map