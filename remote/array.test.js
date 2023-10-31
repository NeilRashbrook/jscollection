import RemoteAPI from './lpc';

async function newArray() {
  return RemoteAPI.newArrayColl(["a", "b", "c", "c", "d"]);
}

test('Array add, remove', async () => {
  let a = await newArray();
  await expect(a.length).resolves.toBe(5);

  await a.push("d", "d"); // alias for addAll([...])
  let el = "e";
  await a.add(el);
  await expect(a.length).resolves.toBe(8);
  expect((await a.contents).length).toBe(8);
  await a.removeAll(["d", el]);
  await expect(a.length).resolves.toBe(6);
  expect((await a.contents).length).toBe(6);
  await a.remove("d");
  await expect(a.length).resolves.toBe(5);
  expect((await a.contents).length).toBe(5);
  await a.removeEach("c");
  await expect(a.length).resolves.toBe(3);
  expect((await a.contents).length).toBe(3);
});

test('Array set, get', async () => {
  let a = await newArray();
  await expect(a.length).resolves.toBe(5);

  await expect(a.get(0)).resolves.toBe("a");
  await expect(a.getIndex(2)).resolves.toBe("c");
  await expect(a.at(2)).resolves.toBe("c");
  await expect(a.getKeyForValue("a")).resolves.toBe(0);
  await a.set(2, "c2");
  await expect(a.length).resolves.toBe(5);
  expect((await a.contents).length).toBe(5);
  await a.set(3, "d2");
  await expect(a.length).resolves.toBe(5);
  expect((await a.contents).length).toBe(5);
  await a.set(100, "e");
  await expect(a.length).resolves.toBe(101);
  expect((await a.contents).length).toBe(101);
  await a.removeKey(3);
  await expect(a.length).resolves.toBe(100);
  expect((await a.contents).length).toBe(100);
});

test('Array push, pop', async () => {
  let a = await newArray();
  let before = await a.contents;

  await a.push(await a.pop());
  await expect(a.contents).resolves.toMatchObject(before);
});

test('Array shift, unshift', async () => {
  let a = await newArray();
  let before = await a.contents;

  await a.unshift(await a.shift(), await a.shift());
  await expect(a.contents).resolves.toMatchObject(before);
});

test('Array clear', async () => {
  let a = await newArray();
  await expect(a.length).resolves.toBeGreaterThan(0);

  await a.clear();
  await expect(a.length).resolves.toBe(0);
  expect((await a.contents).length).toBe(0);
});

test('Array replace', async () => {
  let a = await newArray();
  await a.remove("c");
  expect.assertions(7);
  await expect(a.length).resolves.toBe(4);

  await a.registerObserver({
    added: (items, coll) => {
      expect(items.length).toBe(1);
      expect(items[0]).toBe("e");
      expect(coll).toBe(a);
    },
    removed: (items, coll) => {
      expect(items.length).toBe(1);
      expect(items[0]).toBe("a");
      expect(coll).toBe(a);
    },
  });
  await a.replaceAll(["b", "c", "d", "e"]);
});

test('Array search functions', async () => {
  let a = await newArray();
  await expect(a.length).resolves.toBe(5);

  await expect(a.contains("b")).resolves.toBe(true);
  await expect(a.includes("b", 3)).resolves.toBe(false);

  await expect(a.indexOf("b")).resolves.toBe(1);
  await expect(a.lastIndexOf("c")).resolves.toBe(3);
  await expect(a.findIndexAsync(item => item == "b")).resolves.toBe(1);
  await expect(a.findAsync(item => item == "b")).resolves.toBe("b");

  await expect(a.everyAsync(item => item >= "a" && item < "h")).resolves.toBe(true);
  await expect(a.everyAsync(item => item < "c")).resolves.toBe(false);
  await expect(a.someAsync(item => item > "h")).resolves.toBe(false);
  await expect(a.someAsync(item => item < "b")).resolves.toBe(true);
});

test('Array for...of', async () => {
  let a = await newArray();
  let result = "";
  for await (let item of a) {
    result += "-" + item;
  }
  expect(result).toEqual("-" + (await a.contents).join("-"));
});

test('Array forEach', async () => {
  let a = await newArray();
  let result = "";
  await a.forEachAsync(item => {
    result += "-" + item;
  });
  expect(result).toEqual("-" + (await a.contents).join("-"));
});

test('Array iterators', async () => {
  let a = await newArray();
  let values = await a.values();
  await expect(values.first).resolves.toBe(await a.first);
  let keys = await a.keys();
  await expect(keys.first).resolves.toBe(0);
  let entries = await a.entries();
  await expect((await entries.first)[1]).toBe(await a.first);
});

test('Array toString', async () => {
  let a = await newArray();
  await expect(a.join(" + ")).resolves.toBe((await a.contents).join(" + "));
  await expect(a.toString()).resolves.toBe((await a.contents).toString());
  await expect(a.toLocaleString()).resolves.toBe((await a.contents).toLocaleString());
});

test('Array reversed', async () => {
  let a = await newArray();
  let reversed = await a.reverse();
  await expect(reversed.contents).resolves.toMatchObject((await a.contents).reverse());
});

test('Array splice 0', async () => {
  let a = await newArray();
  let before = await a.contents;
  await a.addAll(["g", "h"]);
  let removedItems = await a.splice(before.length);
  await expect(removedItems.contents).resolves.toMatchObject(["g", "h"]);
  await expect(a.contents).resolves.toMatchObject(before);
});

test('Array splice 1', async () => {
  let a = await newArray();
  let array = await a.contents;
  await a.splice(3, 2, "h", "g");
  array.splice(3, 2, "h", "g");
  await expect(a.contents).resolves.toMatchObject(array);
});

test('Array splice 2', async () => {
  let a = await newArray();
  let array = await a.contents;
  await a.splice(3, 2);
  array.splice(3, 2);
  await expect(a.contents).resolves.toMatchObject(array);
});

test('Array splice 3', async () => {
  let a = await newArray();
  let array = await a.contents;
  await a.splice(3);
  array.splice(3);
  await expect(a.contents).resolves.toMatchObject(array);
});

test('Array slice 0', async () => {
  let a = await newArray();
  let before = await a.contents;
  await a.addAll(["g", "h"]);
  let sliced = await a.slice(0, -2);
  await expect(sliced.contents).resolves.toMatchObject(before);
  await a.pop();
  await a.pop();
  await expect(a.contents).resolves.toMatchObject(before);
});

test('Array slice 1', async () => {
  let a = await newArray();
  let array = await a.contents;
  let result = await a.slice(2, 2);
  let resultArray = array.slice(2, 2);
  await expect(result.contents).resolves.toMatchObject(resultArray);
});

test('Array slice 2', async () => {
  let a = await newArray();
  let array = await a.contents;
  let result = await a.slice(2, -2);
  let resultArray = array.slice(2, -2);
  await expect(result.contents).resolves.toMatchObject(resultArray);
});

test('Array slice 3', async () => {
  let a = await newArray();
  let array = await a.contents;
  let result = await a.slice(2);
  let resultArray = array.slice(2);
  await expect(result.contents).resolves.toMatchObject(resultArray);
});

test('Array getIndexRange(1, ...) ', async () => {
  let a = await newArray();
  await expect(a.length).resolves.toBeGreaterThan(4);
  let array = await a.contents;
  let result = a.getIndexRange(1, 3);
  let resultArray = array.slice(1, 4);
  await expect(result).resolves.toMatchObject(resultArray);
});

test('Array getIndexRange(0, ...) ', async () => {
  let a = await newArray();
  await expect(a.length).resolves.toBeGreaterThan(4);
  let array = await a.contents;
  let result = a.getIndexRange(0, 3);
  let resultArray = array.slice(0, 3);
  await expect(result).resolves.toMatchObject(resultArray);
});

test('Array getIndexRange(..., 0) ', async () => {
  let a = await newArray();
  await expect(a.length).resolves.toBeGreaterThan(4);
  let result = await a.getIndexRange(3, 0);
  expect(result.length).toBe(0);
});

test('Array fill 1', async () => {
  let a = await newArray();
  let array = await a.contents;
  await a.fill("n");
  array.fill("n");
  await expect(a.contents).resolves.toMatchObject(array);
});

test('Array fill 2', async () => {
  let a = await newArray();
  let array = await a.contents;
  await a.fill("n", 2);
  array.fill("n", 2);
  await expect(a.contents).resolves.toMatchObject(array);
});

test('Array fill 3', async () => {
  let a = await newArray();
  let array = await a.contents;
  await a.fill("n", 2, 4);
  array.fill("n", 2, 4);
  await expect(a.contents).resolves.toMatchObject(array);
});

test('Array copyWithin 1', async () => {
  let a = await newArray();
  let array = await a.contents;
  await a.copyWithin(1, 3, 2);
  array.copyWithin(1, 3, 2);
  await expect(a.contents).resolves.toMatchObject(array);
});

test('Array copyWithin 2', async () => {
  let a = await newArray();
  let array = await a.contents;
  await a.copyWithin(1, 3);
  array.copyWithin(1, 3);
  await expect(a.contents).resolves.toMatchObject(array);
});

test('Array copyWithin 3', async () => {
  let a = await newArray();
  let array = await a.contents;
  await a.copyWithin(1);
  array.copyWithin(1);
  await expect(a.contents).resolves.toMatchObject(array);
});

test('Array flat', async () => {
  let a = await newArray();
  await a.set(3, await (await newArray()).contents);
  let array = await a.contents;
  let result = await a.flat();
  let resultArray = array.flat(2);
  await expect(result.contents).resolves.toMatchObject(resultArray);
});

test('Array flatMap', async () => {
  let a = await newArray();
  let array = await a.contents;
  let result = await a.flatMapAsync(item => [item, item]);
  let resultArray = array.flatMap(item => [item, item]);
  await expect(result.contents).resolves.toMatchObject(resultArray);
});

test('Array reduce', async () => {
  let a = await newArray();
  let array = await a.contents;
  let result = a.reduceAsync((prev, item) => prev + ", " + item, "start");
  let resultArray = array.reduce((prev, item) => prev + ", " + item, "start");
  await expect(result).resolves.toEqual(resultArray);
});

test('Array reduceRight', async () => {
  let a = await newArray();
  let array = await a.contents;
  let result = a.reduceRightAsync((prev, item) => prev + ", " + item, "start");
  let resultArray = array.reduceRight((prev, item) => prev + ", " + item, "start");
  await expect(result).resolves.toEqual(resultArray);
});
