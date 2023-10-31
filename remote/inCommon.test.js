import RemoteAPI from './lpc';

test('In common', async () => {
  let a = await RemoteAPI.newArrayColl();
  let b = await RemoteAPI.newArrayColl();
  let el = "a";
  await a.add(el);
  await a.add("b");
  await a.add("c");
  await b.add(el);
  await b.add("e");
  await b.add("f");
  let inCommon = await RemoteAPI.inCommonColl(a, b);
  await expect(inCommon.length).resolves.toBe(1);

  for await (let item of inCommon) {
    expect(item).toBe(el);
  }

  await new Promise(async resolve => {
    await inCommon.registerObserver({
      added: (items, coll) => {
      },
      removed: (items, coll) => {
        expect(items[0]).toBe(el);
        expect(coll).toBe(inCommon);
        resolve();
      },
    });
    await b.remove(el); // calls removed()
  });
});
