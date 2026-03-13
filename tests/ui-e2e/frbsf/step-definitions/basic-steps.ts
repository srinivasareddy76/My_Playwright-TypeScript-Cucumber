import { Given, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '@common/world';

Given('the framework is working', async function (this: ICustomWorld) {
  // Just a simple assertion to verify the framework works
  console.log('Framework test step executed successfully');
});

Then('the test should pass', async function (this: ICustomWorld) {
  // Simple assertion
  const result = true;
  if (!result) {
    throw new Error('Test failed');
  }
  console.log('Test passed successfully');
});
