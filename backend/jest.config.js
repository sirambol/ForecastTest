/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: './',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
};
