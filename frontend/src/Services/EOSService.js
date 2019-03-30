import Eos from 'eosjs';
import { Config } from '../Config';

export class EOSService {
  static eos = null; // PROXY FROM SCATTER. CAN NOT RETURN IN ASYNC FUNCTION
  static scatter = null;
  static account = null;
  static publicKey = null;
  static actions = [];

  static init({ scatter }) {
    EOSService.eos = scatter.eos(Config.scatterNetwork, Eos, Config.eosConfig, Config.scatterNetwork.protocol);
    EOSService.scatter = scatter;
  }

  static async autoLogin() {
    const identity = EOSService.scatter.identity;
    if (!identity) throw new Error('no saved identity');
    const account = identity.accounts.find(x => x.blockchain === 'eos');
    try {
      await EOSService.eos.getAccount(account.name);
      EOSService.account = account;
    } catch (e) {
      await EOSService.logout();
    }
  }

  static async login() {
    const requiredFields = { accounts: [Config.scatterNetwork] };
    await EOSService.scatter.getIdentity(requiredFields);
    const identity = EOSService.scatter.identity;
    EOSService.account = identity.accounts.find(x => x.blockchain === 'eos');
  }

  static async logout() {
    await EOSService.scatter.forgetIdentity();
  }

  static async createAccount({
                               accountName,
                               activePublicKey,
                               ownerPublicKey,
                               ram = Config.accountResources.ramKB * 1024,
                               cpu = `${Config.accountResources.cpu.toFixed(4)} ${Config.coreSymbol}`,
                               net = `${Config.accountResources.net.toFixed(4)} ${Config.coreSymbol}`
                             }) {

    const action = tr => {
      tr.newaccount({
        creator: EOSService.account.name,
        name: accountName,
        owner: ownerPublicKey,
        active: activePublicKey
      });
      tr.buyrambytes({
        payer: EOSService.account.name,
        receiver: accountName,
        bytes: ram
      });
      tr.delegatebw({
        from: EOSService.account.name,
        receiver: accountName,
        stake_net_quantity: net,
        stake_cpu_quantity: cpu,
        transfer: 0
      });
    };
    await EOSService.transaction({ action });
  }

  static async buyRAM({ eos, bytes, tradeType }) {
    if (!['buyrambytes', 'buyram'].includes(tradeType)) {
      throw Error('Unsupported Buy RAM Method');
    }
    const account = EOSService.account.name;
    const action = {
      buyram: tr => {
        tr.buyram({
          payer: account,
          receiver: account,
          quant: `${parseFloat(eos).toFixed(4)} ${Config.coreSymbol}`
        });
      },
      buyrambytes: tr => {
        const numberBytes = Number(bytes);
        tr.buyrambytes({
          payer: account,
          receiver: account,
          bytes: numberBytes
        });
      }
    }[tradeType];
    await EOSService.transaction({ action });
  }

  static async sellRAM({ bytes = 0 }) {
    const action = tr => {
      const account = EOSService.account.name;
      tr.sellram({ account, bytes });
    };
    await EOSService.transaction({ action });
  }

  static async stake({ net, cpu }) {
    const action = {
      actions: [{
        account: 'eosio',
        name: 'delegatebw',
        authorization: [{
          actor: EOSService.account.name,
          permission: 'active',
        }],
        data: {
          from: EOSService.account.name,
          receiver: EOSService.account.name,
          stake_net_quantity: `${net.toFixed(4)} ${Config.coreSymbol}`,
          stake_cpu_quantity: `${cpu.toFixed(4)} ${Config.coreSymbol}`,
          transfer: 0,
        }
      }]
    };
    await EOSService.transaction({ action });
  }

  static async voteProducer({ proxy = '', producers = ['eosbeaneosbp'] }) {
    const action = {
      actions: [{
        account: 'eosio',
        name: 'voteproducer',
        authorization: [{
          actor: EOSService.account.name,
          permission: 'active',
        }],
        data: {
          voter: EOSService.account.name,
          proxy,
          producers,
        }
      }]
    };
    return await EOSService.transaction({ action });
  }

  // cleos push action 3rdexxxxxxxx list '[4, "TAA", "tokentokenaa", "tokentokenaa"]' -p 3rdexxxxxxxx@active
  static async delist({ account }) {
    const action = tr => {
      tr.delist(account);
    };
    await EOSService.transaction({ action });
  }

  static async list({ contract, symbol, account, precision }) {
    const action = tr => {
      tr.list(precision, symbol, contract, account);
    };
    await EOSService.transaction({ action });
  }

  static async bid({ quantity, price }) {
    const account = EOSService.account.name;
    const action = {
      actions: [
        {
          account: '3rdexxxxxxxx',
          name: 'bid',
          authorization: [{
            actor: account,
            permission: 'active'
          }],
          data: {
            quantity,
            price_quantity: price,
            _user: account
          }
        }
      ]
    };
    await EOSService.transaction({ action });
  }

  static async ask({ quantity, price }) {
    const account = EOSService.account.name;
    const action = {
      actions: [
        {
          account: '3rdexxxxxxxx',
          name: 'ask',
          authorization: [{
            actor: account,
            permission: 'active'
          }],
          data: {
            ask: { quantity },
            quantity,
            price_quantity: price,
            _user: account
          }
        }
      ]
    };
    await EOSService.transaction({ action });
  }

  static async cancelAllBid({ token }) {
    const account = EOSService.account.name;
    const action = {
      actions: [
        {
          account: '3rdexxxxxxxx',
          name: 'cancelallbid',
          authorization: [{
            actor: account,
            permission: 'active'
          }],
          data: {
            user: account,
            quantity: `${(0.0).toFixed(token.symbol.precision)} ${token.symbol.name}@${token.symbol.contract}`,
          }
        }
      ]
    };
    await EOSService.transaction({ action });
  }

  static async cancelAllAsk({ token }) {
    const account = EOSService.account.name;
    const action = {
      actions: [
        {
          account: '3rdexxxxxxxx',
          name: 'cancelallask',
          authorization: [{
            actor: account,
            permission: 'active'
          }],
          data: {
            user: account,
            quantity: `${(0.0).toFixed(token.symbol.precision)} ${token.symbol.name}@${token.symbol.contract}`,
          }
        }
      ]
    };
    await EOSService.transaction({ action });
  }

  static async transaction({ action }) {
    try {
      return EOSService.eos.transaction(action);
    } catch (e) {
      // NOTE: miss account error: use @active instead of @owner
      throw e;
    }
  }
}
