import { PaginatedResponseDto } from './paginated-response.dto';
import { PaginationDto } from './pagination.dto';

export function createPaginatedResponse<T>(
  items: T[],
  totalItems: number,
  paginationDto: PaginationDto,
): PaginatedResponseDto<T> {
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