import EosApi from 'eosjs-api';
import { Config } from '../Config';

const convertTotalVotes = (val) => {
  let timestamp = 946684800000;
  let dates = (Date.now() / 1000) - (timestamp / 1000);
  let weight = Math.floor(dates / (86400 * 7)) / 52; // 86400 = seconds per day 24*3600
  const voteWeight = Math.pow(2, weight);
  return (val / voteWeight / 10000).toFixed(0);
};

export class EOSAPIService {
  static eos = null;
  static actions = {};

  static init() {
    EOSAPIService.eos = EosApi(Config.eosAPIConfig);
  }

  static async findPreviousRAMAction() {
    const actions = await EOSAPIService.findActionsInBlockList();
    EOSAPIService.actions = Object.assign({}, EOSAPIService.actions, actions);
    const actionList = Object.values(EOSAPIService.actions);
    actionList.sort((p, n) => n.timestamp - p.timestamp);
    return {
      actions: actionList
    };
  }

  static async findActionsInBlockList() {
    try {
      const transferActions = await EOSAPIService.getUserActions({ account: 'eosio.ram', offset: -14 });
      const transactionIds = transferActions.map(a => a.action_trace.trx_id).reverse();
      const actions = await Promise.all(transactionIds.map(async (transactionId) => {
        const trans = await EOSAPIService.getTransaction(transactionId);
        const { block_time, traces } = trans;
        const action_trace = traces.find(({ act: { name } }) => ['buyrambytes', 'sellram', 'buyram'].includes(name));
        return { transactionId, action: EOSAPIService.extractRAMTransaction({ block_time, action_trace }) };
      }));
      return actions.reduce((r, x) => {
        const { transactionId, action } = x;
        r[transactionId] = action;
        return r;
      }, {});
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  static async getLatestBlockId() {
    const info = await EOSAPIService.eos.getInfo({});
    return info.last_irreversible_block_num;
  }

  static async getInfo() {
    return await EOSAPIService.eos.getInfo({});
  }

  static async getUserActions({ account, pos = -1, offset = -20 }) {
    const { actions } = await EOSAPIService.eos.getActions(account, pos, offset);
    return actions.reverse();
  }

  static async getTransaction(transactionId) {
    return await EOSAPIService.eos.getTransaction(transactionId);
  }

  static async quoteRAMPrice() {
    const ramHistory = await EOSAPIService.eos.getTableRows({
      'json': true,
      'code': 'eosio',
      'scope': 'eosio',
      'table': 'rammarket'
    });
    const { rows } = ramHistory;
    const [{ quote, base }] = rows;
    return { quote, base };
  }

  static async listTokens() {
    const { rows, more } = await EOSAPIService.eos.getTableRows({
      'json': true,
      'code': '3rdexxxxxxxx',
      'scope': '3rdexxxxxxxx',
      'table': 'tokentable'
    });
    return { rows };
  }

  static async listAskOrders({ backer }) {
    const { rows, more } = await EOSAPIService.eos.getTableRows({
      'json': true,
      'code': '3rdexxxxxxxx',
      'scope': backer,
      'table': 'asktable'
    });
    return { rows };
  }

  static async listBidOrders({ backer }) {
    const { rows, more } = await EOSAPIService.eos.getTableRows({
      'json': true,
      'code': '3rdexxxxxxxx',
      'scope': backer,
      'table': 'bidtable'
    });
    return { rows };
  }

  static bytesToEos({ quote, base, bytes }) {
    const baseBalance = parseFloat(base.balance);
    const quoteBalance = parseFloat(quote.balance);
    const eos = (quoteBalance * bytes) / (bytes + baseBalance);
    // fixed 4
    return { eos: Math.ceil(eos * 10000) / 10000 };
  }

  static eosToBytes({ quote, base, eos }) {
    const baseBalance = parseFloat(base.balance);
    const quoteBalance = parseFloat(quote.balance);
    const bytes = (baseBalance / (1 + quoteBalance)) * eos;
    // fixed 4
    return { bytes: Math.ceil(bytes * 10000) / 10000 };
  }

  static extractRAMTransaction({ block_time, action_trace: { act: { data, name }, inline_traces } }) {
    const getPrice = {
      buyram: () => data.quant,
      buyrambytes: () => inline_traces.filter(({ act: { data: { memo } } }) => memo === 'buy ram')
        .map(({ act: { data: { quantity } } }) => quantity),
      sellram: () => inline_traces.filter(({ act: { data: { memo } } }) => memo === 'sell ram')
        .map(({ act: { data: { quantity } } }) => quantity)
    }[name];
    const eos = parseFloat(getPrice());
    const dateTime = new Date(block_time);
    return {
      timestamp: Date.parse(block_time),
      date: dateTime.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' }).replace('/', '-'),
      time: dateTime.toLocaleTimeString('en-US', { hour12: false }),
      act: { name },
      eos: eos,
      bytes: data.bytes,
      price: eos * 1024.0 / data.bytes
    };
  }

  static async getRAMHistory() {
    return await EOSAPIService.eos.getActions({ account: 'eosio.ram' });
  }

  static async getCurrentBalance(accountName) {
    const {
      ram_quota,
      ram_usage,
      cpu_weight,
      net_weight,
      cpu_limit: { used: cpuUsage, max: cpuQuota },
      net_limit: { used: netUsage, max: netQuota },
    } = await EOSAPIService.eos.getAccount(accountName);
    const [eos_quota] = await EOSAPIService.eos.getCurrencyBalance('eosio.token', accountName, Config.coreSymbol);
    return {
      accountName,
      eosQuota: parseFloat(eos_quota),
      eosStaked: parseFloat((net_weight + cpu_weight) / 10000),
      ramQuota: ram_quota / 1024,
      ramUsage: ram_usage / 1024,
      cpuQuota,
      cpuUsage,
      netQuota,
      netUsage
    };
  }

  static async getBP({ lower = '', limit = 500 }) {
    const res = await EOSAPIService.eos.getProducers(true, lower, limit);
    const bps = res.rows;
    const rank = bps.findIndex(bp => bp.owner === 'eosbeaneosbp');
    const eosBean = bps[rank];
    return {
      ...eosBean, rank: rank + 1, vote_eos: convertTotalVotes(eosBean.total_votes)
    };
  }
}
