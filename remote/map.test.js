import RemoteAPI from './lpc';

async function newMap() {
  let a = await RemoteAPI.newMapColl();
  await a.set("a", "a1");
  await a.set("b", "b1");
  await a.set("c", "c1");
  await a.set("c", "c2");
  await a.set("d", "d1");
  return a;
}

test('Map add, remove', async () => {
  let a = await newMap();
  await expect(a.length).resolves.toBe(4);
  let el = "e1";
  await a.add(el);
  await expect(a.length).resolves.toBe(5);
  expect((await a.contents).length).toBe(5);
  await a.remove(el);
  await a.remove("d1");
  await expect(a.length).resolves.toBe(3);
  expect((await a.contents).length).toBe(3);
});

test('Map removeKey, delete', async () => {
  let a = await newMap();
  await expect(a.length).resolves.toBe(4);
  await a.removeKey("a");
  await a.delete("b"); // alias for removeKey();
  await expect(a.length).resolves.toBe(2);
  expect((await a.contents).length).toBe(2);
});

test('Map set, get', async () => {
  let a = await newMap();
  await expect(a.length).resolves.toBe(4);
  await a.add("e1");

  await expect(a.get("a")).resolves.toBe("a1");
  await expect(a.get("c")).resolves.toBe("c2");
  await expect(a.get(0)).resolves.toBe("e1");
  await a.set("c", "c3");
  await expect(a.length).resolves.toBe(5);
  expect((await a.contents).length).toBe(5);
  await a.set(100, "z1");
  await expect(a.length).resolves.toBe(6);
  expect((await a.contents).length).toBe(6);
});

test('Map clear', async () => {
  let a = await newMap();
  await expect(a.length).resolves.toBeGreaterThan(0);
  await a.clear();
  await expect(a.length).resolves.toBe(0);
  expect((await a.contents).length).toBe(0);
});

test('Map search functions', async () => {
  let a = await newMap();
  await expect(a.size).resolves.toBe(4);
  await expect(a.has("b")).resolves.toBe(true);
  await expect(a.contains("c1")).resolves.toBe(false);
  await expect(a.contains("c2")).resolves.toBe(true);
  await expect(a.getKeyForValue("c2")).resolves.toBe("c");
  await expect(a.findAsync(item => item == "b1")).resolves.toBe("b1");
});

test('Map for...of', async () => {
  let a = await newMap();
  let result = "";
  for await (let item of a) {
    result += "-" + item;
  }
  expect(result).toEqual("-" + (await a.contents).join("-"));
});

test('Map forEach', async () => {
  let a = await newMap();
  let result = "";
  await a.forEachAsync(item => {
    result += "-" + item;
  });
  expect(result).toEqual("-" + (await a.contents).join("-"));
});

test('Map iterators', async () => {
  let a = await newMap();
  let values = await a.values();
  await expect(values.first).resolves.toBe(await a.first);
  let keys = await a.keys();
  await expect(keys.first).resolves.toBe("a");
  let entries = await a.entries();
  expect((await entries.first)[1]).toBe(await a.first);
});
