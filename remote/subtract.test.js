import RemoteAPI from './lpc';
import { jest } from '@jest/globals';

test('Subtract', async () => {
  let a = await RemoteAPI.newArrayColl();
  let b = await RemoteAPI.newArrayColl();
  let el = "a"
  await a.add(el);
  await a.add("b");
  await a.add("c");
  await b.add(el);
  await b.add("e");
  await b.add("f");
  let sub = await RemoteAPI.subtractColl(a, b);
  await expect(sub.length).resolves.toBe(2);

  expect.assertions(4);
  let addedCalled = jest.fn();
  let removedCalled = jest.fn();
  await new Promise(async resolve => {
    await sub.registerObserver({
      added: (items, coll) => {
        addedCalled(items[0]);
      },
      removed: (items, coll) => {
        removedCalled(items[0]);

        expect(addedCalled).toHaveBeenNthCalledWith(1, "h");
        expect(addedCalled).toHaveBeenNthCalledWith(2, el);
        expect(removedCalled).toHaveBeenCalledWith(el);
        resolve();
      },
    });
    await a.add("h"); // calls added()
    await b.remove(el); // calls added()
    await b.add(el); // calls removed()
  });
});
