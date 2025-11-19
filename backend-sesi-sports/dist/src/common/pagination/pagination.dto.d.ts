export declare class PaginationDto {
    page?: number;
    limit?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    get skip(): number;
    get take(): number;
}
