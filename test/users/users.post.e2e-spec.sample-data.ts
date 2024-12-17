import { faker } from '@faker-js/faker';

export const completeUser = {
  firstName: 'alen',
  lastName: faker.person.lastName(),
  email: 'favourejim56@gmail.com',
  password: 'Password123#',
};

export const missingFirstName = {
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: 'Password123#',
};

export const missingEmail = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: 'Password123#',
};

export const missingPassword = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
};