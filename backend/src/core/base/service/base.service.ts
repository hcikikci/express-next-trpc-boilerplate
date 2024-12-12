import { BaseRepository } from '../repository/base.repository';
import { Args } from '@prisma/client/runtime/library';
import { PaginatedResult, PaginationParams } from '../types/pagination.types';
import { calculatePagination } from '../utils/pagination.utils';

export class BaseService<
  T,
  W extends Args<T, 'findMany'>['where'],
  S extends Args<T, 'findMany'>['orderBy'],
> {
  protected repository?: BaseRepository<any, any, any>;

  constructor(repository?: BaseRepository<any, any, any>) {
    this.repository = repository;
  }

  async getAll(
    paginationParams: Required<PaginationParams>,
    filters: W = {} as W,
    orderBy: S = {} as S,
  ): Promise<PaginatedResult<T>> {
    try {
      // Get total count first
      const total = await this.repository?.count({ where: filters });

      // Calculate pagination
      const { skip, take, metadata } = calculatePagination(total, paginationParams);

      // Get items for the current page
      const items = await this.repository?.findMany({
        where: filters,
        skip,
        take,
        orderBy,
      });

      return {
        items: items || [],
        metadata,
      };
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number): Promise<T | null> {
    return this.repository?.findUnique({ where: { id } });
  }

  async create(data: unknown): Promise<T> {
    return this.repository?.create({ data });
  }

  async update(id: number, data: unknown): Promise<T> {
    return this.repository?.update({ where: { id }, data });
  }

  async delete(id: number): Promise<T> {
    return this.repository?.delete({ where: { id } });
  }
}
