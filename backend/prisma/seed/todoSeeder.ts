import { PrismaClient, TodoStatus } from '@prisma/client';

const todos = [
  {
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the project',
    status: TodoStatus.Pending,
  },
  {
    title: 'Implement user authentication',
    description: 'Add user login and registration functionality',
    status: TodoStatus.InProgress,
  },
  {
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    status: TodoStatus.Completed,
  },
  {
    title: 'Code review',
    description: 'Review pull requests from team members',
    status: TodoStatus.Pending,
  },
  {
    title: 'Database optimization',
    description: 'Optimize database queries and indexes',
    status: TodoStatus.InProgress,
  },
];

export async function seedTodos(prisma: PrismaClient) {
  console.log('Seeding todos...');

  for (const todo of todos) {
    await prisma.todo.create({
      data: todo,
    });
  }

  console.log('Todo seeding completed!');
}
