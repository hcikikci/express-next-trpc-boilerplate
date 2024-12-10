type Operation =
  | 'findFirst'
  | 'findUnique'
  | 'findMany'
  | 'create'
  | 'createMany'
  | 'update'
  | 'updateMany'
  | 'delete'
  | 'deleteMany'
  | 'count';

export abstract class BaseRepository<
  Db extends { [Key in Operation]: (data: any) => unknown },
  Args extends { [K in Operation]: unknown },
  Return extends { [K in Operation]: unknown },
> {
  constructor(protected db: Db) {}

  findFirst(data?: Args['findFirst']): Return['findFirst'] {
    return this.db.findFirst(data);
  }

  findUnique(data: Args['findUnique']): Return['findUnique'] {
    return this.db.findUnique(data);
  }

  findById(id: number): Return['findUnique'] {
    return this.db.findUnique({ where: { id } });
  }

  findMany(data?: Args['findMany']): Return['findMany'] {
    return this.db.findMany(data);
  }

  create(data: Args['create']): Return['create'] {
    return this.db.create(data);
  }

  createMany(data: Args['createMany']): Return['createMany'] {
    return this.db.createMany(data);
  }

  update(data: Args['update']): Return['update'] {
    return this.db.update(data);
  }

  updateMany(data: Args['updateMany']): Return['updateMany'] {
    return this.db.updateMany(data);
  }

  delete(data: Args['delete']): Return['delete'] {
    return this.db.delete(data);
  }

  deleteById(id: number): Return['delete'] {
    return this.db.delete({ where: { id } });
  }

  deleteMany(data?: Args['deleteMany']): Return['deleteMany'] {
    return this.db.deleteMany(data);
  }

  count(data?: Args['count']): Return['count'] {
    return this.db.count(data);
  }
}

export type DelegateArgs<T> = {
  [Key in keyof T]: T[Key] extends (args: infer A) => unknown ? A : never;
};

export type DelegateReturnTypes<T> = {
  [Key in keyof T]: T[Key] extends (...args: any[]) => any ? ReturnType<T[Key]> : never;
};
