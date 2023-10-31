import RemoteAPI from './rpc';

test('Merge', async () => {
  let a = await RemoteAPI.newArrayColl();
  let b = await RemoteAPI.newArrayColl();
  await a.add("a");
  await a.add("b");
  await a.add("c");
  await b.add("d");
  await b.add("e");
  await b.add("f");
  let merged = await RemoteAPI.mergeColl(a, b);
  await expect(merged.length).resolves.toBe(6);

  expect.assertions(2);
  await new Promise(async resolve => {
    await merged.registerObserver({
      added: (items, coll) => {
        expect(items[0]).toBe("h");
        resolve();
      },
      removed: (items, coll) => {
      },
    });
    await b.add("h");
  });
});
