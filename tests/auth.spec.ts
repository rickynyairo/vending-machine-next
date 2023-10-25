import { test, expect } from '@playwright/test';

test('user should be able to login', async ({ request }) => {
  const response = await request.post(`http://localhost:3000/api/login`, {
    data: {
      username: 'test',
      password: 'test',
    }
  });
  expect(response.ok()).toBeTruthy();

  const { username } = await response.json();
  expect(username).toBe('test');
});

test('unauthorised user should not be able to login', async ({ request }) => {
  const response = await request.post(`http://localhost:3000/api/login`, {
    data: {
      username: 'false',
      password: 'false',
    }
  });

  expect(response.ok()).toBeFalsy();

  const { message } = await response.json();
  expect(message).toBe('Invalid credentials');
});