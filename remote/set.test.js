import RemoteAPI from './rpc';

async function newSet() {
  let a = await RemoteAPI.newSetColl();
  await a.add("a");
  await a.add("b");
  await a.add("c");
  await a.add("c");
  await a.add("d");
  return a;
}

test('Set add, remove', async () => {
  let a = await newSet();
  await expect(a.length).resolves.toBe(4); // no dups
  let el = "e";
  await a.add(el);
  await expect(a.length).resolves.toBe(5);
  expect((await a.contents).length).toBe(5);
  await a.remove(el);
  await a.remove("c");
  await expect(a.length).resolves.toBe(3);
  await a.delete("d"); // alias for remove()
  await expect(a.length).resolves.toBe(2);
  expect((await a.contents).length).toBe(2);
  await a.addAll(await newSet());
  await expect(a.length).resolves.toBe(4);
  await a.removeAll(["c", "d"]);
  await expect(a.length).resolves.toBe(2);
  expect((await a.contents).length).toBe(2);
});

test('Set clear', async () => {
  let a = await newSet();
  await expect(a.length).resolves.toBeGreaterThan(0);
  await a.clear();
  await expect(a.length).resolves.toBe(0);
  expect((await a.contents).length).toBe(0);
});

test('Set search functions', async () => {
  let a = await newSet();
  await expect(a.size).resolves.toBe(4);
  await expect(a.has("b")).resolves.toBe(true);
  await expect(a.contains("c")).resolves.toBe(true);

  await expect(a.findAsync(item => item == "b")).resolves.toBe("b");
});

test('Set for...of', async () => {
  let a = await newSet();
  let result = "";
  for await (let item of a) {
    result += "-" + item;
  }
  expect(result).toEqual("-" + (await a.contents).join("-"));
});

test('Set forEach', async () => {
  let a = await newSet();
  let result = "";
  await a.forEachAsync(item => {
    result += "-" + item;
  });
  expect(result).toEqual("-" + (await a.contents).join("-"));
});

test('Set iterators', async () => {
  let a = await newSet();
  let values = await a.values();
  await expect(values.first).resolves.toBe(await a.first);
  let entries = await a.entries();
  expect((await entries.first)[1]).toBe(await a.first);
});
