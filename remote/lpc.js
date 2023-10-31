import MessageCall from 'jpc-core/message';
import JPCProtocol from 'jpc-core/protocol';
import { inCommonColl, mergeColl, subtractColl } from '..';
import { ArrayColl, MapColl, SetColl } from '..';

class LPCMessage extends MessageCall {
  remote = null;
  connect(remote) {
    this.remote = remote;
    remote.remote = this;
  }
  send(message) {
    this.remote._incomingMessage(message);
  }
}

class LPCProtocol extends JPCProtocol {
  message = new LPCMessage();
  connect(remote) {
    this.message.connect(remote.message);
  }
  registerIncomingCall(method, listener) {
    this.message.register(method, listener);
  }
  callRemote(method, payload) {
    return this.message.makeCall(method, payload);
  }
}

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

let server = new LPCProtocol(new RemoteAPIFactory());
let client = new LPCProtocol();
server.init();
client.init();
client.connect(server);
let remoteStart = client.getRemoteStartObject();
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
