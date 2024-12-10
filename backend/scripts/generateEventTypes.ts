import * as fs from 'fs-extra';
import * as path from 'path';

async function generateEventTypes() {
  const schemaDir = path.resolve(__dirname, '../prisma/schema');
  const outputPath = path.resolve(__dirname, '../src/core/event/event.types.ts');

  const customEvents: string[] = [];

  // Read all .prisma files in the schema directory
  const files = await fs.readdir(schemaDir);
  const schemaFiles = files.filter(file => file.endsWith('.prisma'));

  const models: string[] = [];

  for (const file of schemaFiles) {
    const schemaPath = path.join(schemaDir, file);
    const schema = await fs.readFile(schemaPath, 'utf-8');

    // Extract model names using regex
    const modelRegex = /model\s+(\w+)\s+{/g;
    let match;

    while ((match = modelRegex.exec(schema)) !== null) {
      models.push(match[1]);
    }
  }

  // Define the event operations you want to generate
  const operations = ['Created', 'Updated', 'Deleted'];

  // Generate enum entries
  const enumEntries = models
    .map(model => operations.map(op => `  On${model}${op} = 'On${model}${op}',`).join('\n'))
    .join('\n');

  const customEnumEntries =
    customEvents.length > 0
      ? customEvents
          .map(event => `  ${event} = '${event?.charAt(0).toLowerCase() + event?.slice(1)}',`)
          .join('\n')
      : '';

  const enumContent = `export enum EventTypes {
  // Custom events
${customEnumEntries}

  // Prisma generated events
${enumEntries}
}
`;

  // Write the generated enum to the output file
  await fs.outputFile(outputPath, enumContent);
}

generateEventTypes()
  .then(() => console.log('EventTypes enum generated successfully.'))
  .catch(err => console.error('Error generating EventTypes enum:', err));
