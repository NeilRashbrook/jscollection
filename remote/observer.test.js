import RemoteAPI from './lpc';

test('Observer', async () => {
  let a = await RemoteAPI.newArrayColl();
  let el = "a";
  expect.assertions(4);
  await new Promise(async resolve => {
    await a.registerObserver({
      added: (items, coll) => {
        expect(items[0]).toBe(el);
        expect(coll).toBe(a);
      },
      removed: (items, coll) => {
        expect(items[0]).toBe(el);
        expect(coll).toBe(a);
        resolve();
      },
    });
    await a.add(el);
    await a.remove(el);
  });
});
