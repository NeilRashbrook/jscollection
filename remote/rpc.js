import JPCWebSocket from 'jpc-ws/protocol';
import { inCommonColl, mergeColl, subtractColl } from '..';
import { ArrayColl, MapColl, SetColl } from '..';

class RemoteAPIFactory {
  inCommonColl(...args) {
    return inCommonColl(...args);
  }
  mergeColl(...args) {
    return mergeColl(...args);
  }
  newArrayColl(...args) {
    return new ArrayColl(...args);
  }
  newMapColl(...args) {
    return new MapColl(...args);
  }
  newSetColl(...args) {
    return new SetColl(...args);
  }
  subtractColl(...args) {
    return subtractColl(...args);
  }
}

let server = new JPCWebSocket(new RemoteAPIFactory());
let client = new JPCWebSocket();
afterAll(function() {
  client.close();
  server.close();
});
let remoteStart = (async function() {
  let port = await server.listen("test", 0, false);
  await client.connect("test", null, port);
  return client.getRemoteStartObject();
})();
export default {
  async inCommonColl(...args) {
    return (await remoteStart).inCommonColl(...args);
  },
  async mergeColl(...args) {
    return (await remoteStart).mergeColl(...args);
  },
  async newArrayColl(...args) {
    return (await remoteStart).newArrayColl(...args);
  },
  async newMapColl(...args) {
    return (await remoteStart).newMapColl(...args);
  },
  async newSetColl(...args) {
    return (await remoteStart).newSetColl(...args);
  },
  async subtractColl(...args) {
    return (await remoteStart).subtractColl(...args);
  },
};
