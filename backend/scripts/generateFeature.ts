const fs = require('fs');
const path = require('path');

const featureName = process.argv[2];

if (!featureName) {
  console.error('Please provide a feature name.');
  process.exit(1);
}

const baseDir = path.join(process.cwd(), 'src', 'features', featureName);

// Ensure the base directory exists before creating files
fs.mkdirSync(baseDir, { recursive: true });

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

// Create empty events directory with index.ts files
const eventsDir = path.join(baseDir, 'events');

fs.mkdirSync(eventsDir, { recursive: true });
fs.writeFileSync(path.join(eventsDir, 'index.ts'), '');

// Generate repository file
const repositoryContent = `import { prismaClient } from '@core/db-client/prisma.client';
import { Prisma } from '@prisma/client';
import {
  BaseRepository,
  DelegateArgs,
  DelegateReturnTypes,
} from '@core/base/repository/base.repository';
import { DefaultArgs } from '@prisma/client/runtime/library';

type ${capitalizeFirstLetter(featureName)}Delegate = Prisma.${capitalizeFirstLetter(featureName)}Delegate<DefaultArgs>;

export class ${capitalizeFirstLetter(featureName)}Repository extends BaseRepository<
  ${capitalizeFirstLetter(featureName)}Delegate,
  DelegateArgs<${capitalizeFirstLetter(featureName)}Delegate>,
  DelegateReturnTypes<${capitalizeFirstLetter(featureName)}Delegate>
> {
  constructor() {
    super(prismaClient.${featureName});
  }
}
`;

// Generate service file
const serviceContent = `import { ${capitalizeFirstLetter(featureName)}Repository } from './${featureName}.repository';
import { ${capitalizeFirstLetter(featureName)}, Prisma } from '@prisma/client';
import { BaseService } from '@core/base/service/base.service';

export class ${capitalizeFirstLetter(featureName)}Service extends BaseService<
  ${capitalizeFirstLetter(featureName)},
  Prisma.${capitalizeFirstLetter(featureName)}WhereInput,
  Prisma.${capitalizeFirstLetter(featureName)}OrderByWithRelationInput
> {
  constructor(private readonly ${featureName}Repository: ${capitalizeFirstLetter(featureName)}Repository) {
    super(${featureName}Repository);
  }
}
`;

// Generate API file
const apiContent = `import { z } from 'zod';
import { router, procedure } from '../../core/server/trpc';
import { ${capitalizeFirstLetter(featureName)}Service } from './${featureName}.service';
import { ${capitalizeFirstLetter(featureName)}Repository } from './${featureName}.repository';
import { Request } from 'express';
import { FilterOptions, parseFilters } from '@core/base/api/parseFilters';

const ${featureName}Service = new ${capitalizeFirstLetter(featureName)}Service(new ${capitalizeFirstLetter(featureName)}Repository());

export const ${featureName}Router = router({
  getAll${capitalizeFirstLetter(featureName)}s: procedure.query(async ({ ctx }) => {
    const req = ctx.req as Request;
    const searchableFields: FilterOptions['searchableFields'] = ['title', 'description'];
    const { where, orderBy, skip, take } = parseFilters(req, { searchableFields });
    return ${featureName}Service.getAll(skip, take, where, orderBy);
  }),

  getById: procedure.input(z.number()).query(async ({ input }) => {
    return ${featureName}Service.getById(input);
  }),

  create: procedure
    .input(
      z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return ${featureName}Service.create(input);
    }),

  update: procedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().min(1).optional(),
          description: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      return ${featureName}Service.update(input.id, input.data);
    }),

  delete: procedure.input(z.number()).mutation(async ({ input }) => {
    return ${featureName}Service.delete(input);
  }),
});
`;

// Generate Prisma schema file
const prismaSchemaDir = path.join(process.cwd(), 'prisma', 'schema');
fs.mkdirSync(prismaSchemaDir, { recursive: true });

const prismaSchemaContent = `model ${capitalizeFirstLetter(featureName)} {
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
`;

fs.writeFileSync(path.join(prismaSchemaDir, `${featureName}.prisma`), prismaSchemaContent);

// Write files
fs.writeFileSync(path.join(baseDir, `${featureName}.repository.ts`), repositoryContent);
fs.writeFileSync(path.join(baseDir, `${featureName}.service.ts`), serviceContent);
fs.writeFileSync(path.join(baseDir, `${featureName}.api.ts`), apiContent);

console.log(`Feature ${featureName} generated successfully.`);
