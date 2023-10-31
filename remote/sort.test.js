import RemoteAPI from './lpc';

test('sort', async () => {
  let a = await RemoteAPI.newArrayColl(["h", "f", "d", "g", "b", "c", "b", "e"]);

  let sorted = await a.sort();

  let added = await RemoteAPI.newArrayColl();
  let removed = await RemoteAPI.newArrayColl();
  let removedDone;
  let registerDone;
  let addedDone = new Promise(addedResolve => {
    removedDone = new Promise(removedResolve => {
      registerDone = sorted.registerObserver({
        added: async (items, coll) => {
          await added.addAll(items);
          addedResolve();
        },
        removed: async (items, coll) => {
          await removed.addAll(items);
          removedResolve();
        },
      });
    });
  });
  await registerDone;

  await a.add("a");
  await a.remove("c");

  await addedDone;
  await removedDone;

  /*
  // swap the first two
  let swap = a.get(0);
  a.set(0, a.get(1));
  a.set(1, swap);
  */

  await expect(sorted.contents).resolves.toMatchObject(["a", "b", "b", "d", "e", "f", "g", "h"]);
  await expect(removed.contents).resolves.toMatchObject(["c"]);
  await expect(added.contents).resolves.toMatchObject(["a"]);
});
