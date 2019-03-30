const environment = process.env.ENVIRONMENT;
const invalidEnv = ['production', 'staging', 'dev'].indexOf(environment.toLowerCase()) === -1;
const env = invalidEnv ? 'dev' : environment;

const MAIN_NET_END_POINT = {
  host: 'nodes.get-scatter.com',
  port: 443,
  protocol: 'https',
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
};

// const TEST_NET_END_POINT = {
//   host: 'jungle.eosio.cr',
//   port: 443,
//   protocol: 'https',
//   chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'
// };

const TEST_NET_END_POINT = {
  host: 'forest.host.3rdex.com',
  port: 8888,
  protocol: 'http',
  chainId: ''
};

const LOCAL_END_POINT = {
  host: 'localhost',
  port: 8888,
  protocol: 'http',
  chainId: ''
};

const endPoint = {
  production: MAIN_NET_END_POINT,
  prod: MAIN_NET_END_POINT,
  staging: TEST_NET_END_POINT,
  dev: TEST_NET_END_POINT
}[env];

const googleAnalyticsTrackingID = {
  production: 'UA-127074317-1',
  prod: 'UA-127074317-1',
  staging: 'UA-127074317-2',
  dev: ''
}[env];

const frontendBase = {
  production: 'https://3rdex.com',
  prod: 'https://3rdex.com',
  staging: 'http://lancer.host.3rdex.com',
  dev: 'http://localhost:8080'
}[env];

// NOTE: service fee in US cent
const serviceFee = 799;

const accountResources = {
  cpu: 0.2000, // EOS / SYS
  net: 0.2000, // EOS / SYS
  ramKB: 4       // KB
};

export class Config {
  static get scatterNetwork() {
    return {
      blockchain: 'eos',
      host: endPoint.host,
      port: endPoint.port,
      protocol: endPoint.protocol,
      chainId: endPoint.chainId
    };
  }

  static get coreSymbol() {
    return {
      production: 'EOS',
      staging: 'SYS',
      dev: 'SYS',
    }[env];
  }

  static get eosConfig() {
    return {
      broadcast: true,
      sign: true,
      chainId: endPoint.chainId
    };
  }

  static get eosAPIConfig() {
    return {
      httpEndpoint: `${endPoint.protocol}://${endPoint.host}:${endPoint.port}`,
      verbose: false // API logging
    };
  }

  static get frontend() {
    return frontendBase;
  }

  static get backend() {
    return {
      production: 'https://api.3rdex.com/',
      staging: 'http://lancer.host.3rdex.com:3000/',
      dev: 'http://localhost:3000/',
    }[env];
  }

  static get googleAnalyticsTrackingID() {
    return googleAnalyticsTrackingID;
  }

  static get stripeConfig() {
    const key = {
      production: 'pk_live_ND6T4Yv8115j3CCJmUs1U0lq',
      staging: 'pk_test_hSTS8rf11m67EWHfUvi7kYvv',
      dev: 'pk_test_hSTS8rf11m67EWHfUvi7kYvv',
    }[env];
    return {
      key: key,
      image: 'https://3rdex.com/logo.png',
      locale: 'auto'
    };
  }

  static get stripeCheckoutConfiguration() {
    return {
      name: '3rdex.com',
      description: 'Next Generation Exchange',
      zipCode: true,
      amount: serviceFee,
      allowRememberMe: false
    };
  }

  static get serviceFee() {
    return `${serviceFee / 100} USD`;
  }

  static get accountResources() {
    return accountResources;
  }
}
