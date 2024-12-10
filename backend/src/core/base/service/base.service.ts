import { BaseRepository } from '../repository/base.repository';
import { Args } from '@prisma/client/runtime/library';

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
    page: number = 1,
    pageSize: number = 10,
    filters: W = {} as W,
    orderBy: S = {} as S,
  ): Promise<{ items: T[]; count: number }> {
    try {
      if (page < 1) {
        page = 1;
      }

      const skip = (page - 1) * pageSize;
      const [items, count] = await Promise.all([
        this.repository?.findMany({
          where: filters,
          skip,
          take: pageSize,
          orderBy,
        }),
        this.repository?.count({ where: filters }),
      ]);

      return { items, count };
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
