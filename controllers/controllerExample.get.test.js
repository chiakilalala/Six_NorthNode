const controllerExample = require('./controllerExample')

it('example test', async () => {
  expect(await controllerExample.get()).toBe('Hello World')
})
