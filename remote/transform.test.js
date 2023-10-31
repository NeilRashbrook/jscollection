import RemoteAPI from './rpc';

test('transform observer finds the right changes', async () => {
  let a = await RemoteAPI.newArrayColl([ "b", "c", "d", "e", "f", "g", "h" ]);

  let transform = await a.reverse(); // uses TransformCollection

  let added = await RemoteAPI.newArrayColl();
  let removed = await RemoteAPI.newArrayColl();
  let removedDone;
  let registerDone;
  let addedDone = new Promise(addedResolve => {
    removedDone = new Promise(removedResolve => {
      registerDone = transform.registerObserver({
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

  await a.unshift("a");
  await a.remove("b");

  await addedDone;
  await removedDone;

  /*
  // swap "c" and "d"
  let swap = a.get(1);
  a.set(1, a.get(2));
  console.log("after setting d", a.contents, added.contents, removed.contents);
  a.set(2, swap);
  console.log("after setting c", a.contents, added.contents, removed.contents);

  expect(transform.contents).toMatchObject([ "a", "d", "c", "e", "f", "g", "h" ].reverse());
  expect(removed.contents).toMatchObject([ "b", "c", "d" ]);
  expect(added.contents).toMatchObject([ "a", "d", "c" ]);
  */

  await expect(transform.contents).resolves.toMatchObject([ "a", "c", "d", "e", "f", "g", "h" ].reverse());
  await expect(removed.contents).resolves.toMatchObject([ "b" ]);
  await expect(added.contents).resolves.toMatchObject([ "a" ]);
});
