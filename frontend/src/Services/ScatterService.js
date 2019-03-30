import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';

ScatterJS.plugins(new ScatterEOS());

export class ScatterService {
  static scatter: {
    identity: {
      hash: String;
      kyc: Boolean;
      name: String;
      publicKey: String;
    }
  } = null;

  static async init() {
    if (ScatterService.scatter) return ScatterService.scatter;
    const connected = await ScatterJS.scatter.connect('3RDEX');
    if (connected) {
      ScatterService.scatter = ScatterJS.scatter;
      window.scatter = null;
      return ScatterService.scatter;
    }
  }
}
