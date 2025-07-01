/// <reference types="jest" />

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get(PrismaService);
    await prisma.task.deleteMany(); 
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  let createdTaskId: number;

  it('/POST /tasks - should create a task', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Test task', urgency: 2 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test task');
    expect(response.body.done).toBe(false);
    expect(response.body.urgency).toBe(2);

    createdTaskId = response.body.id;
  });

  it('/GET /tasks - should return all tasks', async () => {
    const response = await request(app.getHttpServer()).get('/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/GET /tasks/:id - should return the created task', async () => {
    const response = await request(app.getHttpServer()).get(`/tasks/${createdTaskId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdTaskId);
  });

  it('/PATCH /tasks/:id - should update task', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/tasks/${createdTaskId}`)
      .send({ title: 'Updated task' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated task');
  });
  
  it('/PATCH /tasks/:id/done - should write task done', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/tasks/${createdTaskId}/done`);

    expect(response.status).toBe(200);
    expect(response.body.done).toBe(true);
  });

  it('/DELETE /tasks/:id - should delete the task', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/tasks/${createdTaskId}`);

    expect(response.status).toBe(200);
  });

  it('/GET /tasks/:id - should return 404 for deleted task', async () => {
    const response = await request(app.getHttpServer()).get(`/tasks/${createdTaskId}`);
    expect(response.status).toBe(404);
  });

  it('/PATCH /tasks/:id - should return 404 if task does not exist', async () => {
  const response = await request(app.getHttpServer())
    .patch('/tasks/99999') 
    .send({ title: 'Will fail' });

  expect(response.status).toBe(404);
  expect(response.body.message).toContain('not found');
  });

  it('/PATCH /tasks/:id/done - should return 404 if task does not exist', async () => {
  const response = await request(app.getHttpServer()).patch('/tasks/99999/done');

  expect(response.status).toBe(404);
  });
});
