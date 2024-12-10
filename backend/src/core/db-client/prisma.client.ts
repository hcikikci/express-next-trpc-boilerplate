import { PrismaClient as _PrismaClient, Prisma } from '@prisma/client';

class PrismaClient {
  private static instance: _PrismaClient;

  private constructor() {}

  public static getInstance(): _PrismaClient {
    if (!PrismaClient.instance) {
      PrismaClient.instance = new _PrismaClient();
      PrismaClient.instance.$use(softDeleteMiddleware());
      PrismaClient.instance.$use(excludeDeletedMiddleware());
    }
    return PrismaClient.instance;
  }
}

function getDeletedAtField(model: string): string | null {
  const modelFields = Prisma.dmmf.datamodel.models.find(m => m.name === model)?.fields;
  const deletedAtField = modelFields?.find(field => field.name === 'deletedAt');
  return deletedAtField ? deletedAtField.name : null;
}

function softDeleteMiddleware() {
  return async (params, next) => {
    const deletedAtField = getDeletedAtField(params.model as string);
    if (deletedAtField) {
      if (params.action === 'delete') {
        params.action = 'update';
        params.args.data = { deletedAt: new Date() };
      }
      if (params.action === 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data) {
          params.args.data.deletedAt = new Date();
        } else {
          params.args.data = { deletedAt: new Date() };
        }
      }
    }
    return next(params);
  };
}
function excludeDeletedMiddleware() {
  return async (params, next) => {
    const deletedAtField = getDeletedAtField(params.model as string);
    if (deletedAtField) {
      if (params.action === 'findMany') {
        params.args = params.args || {}; // Ensure params.args is defined
        if (params.args.where) {
          params.args.where = { ...params.args.where, deletedAt: null };
        } else {
          params.args.where = { deletedAt: null };
        }
      }
    }
    return next(params);
  };
}

export const prismaClient = PrismaClient.getInstance();
