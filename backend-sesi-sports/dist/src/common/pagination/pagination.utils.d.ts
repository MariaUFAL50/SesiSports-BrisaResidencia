import { PaginatedResponseDto } from './paginated-response.dto';
import { PaginationDto } from './pagination.dto';
export declare function createPaginatedResponse<T>(items: T[], totalItems: number, paginationDto: PaginationDto): PaginatedResponseDto<T>;
