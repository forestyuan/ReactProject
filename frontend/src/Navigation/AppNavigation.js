import React, {Component} from 'react';
import {Route, Switch} from 'react-router';
import {ConnectedRouter} from 'connected-react-router';
import LandingScreen from '../Screens/LandingScreen';
import AccountScreen from '../Screens/AccountScreen';
import {AppStateActions} from '../Reducers/AppStateReducer';
import connect from 'react-redux/es/connect/connect';
import RamExchangeScreen from '../Screens/RamExchangeScreen';
import KeyGenScreen from '../Screens/Account/KeyGenScreen';
import PaymentScreen from '../Screens/Account/PaymentScreen';
import CheckStatusScreen from '../Screens/Account/CheckStatusScreen';
import CheckKeyStatusScreen from '../Screens/Account/CheckKeyStatusScreen';
import SetupScreen from '../Screens/Account/SetupScreen';
import MarketPairScreen from "../Screens/MarketPairScreen";
import ToolKitScreen from '../Screens/ToolKitScreen';

class Navigation extends Component {
  constructor(props) {
    super(props);
    const { init, initApi } = props;
    init();
    initApi();
  }

  render() {
    const { history } = this.props;
    return (
      <ConnectedRouter history={history}>
        <div>
          <Switch>
            <Route exact path="/" component={LandingScreen} />
            <Route path="/ram-eos" component={RamExchangeScreen} />
            <Route path="/eos-toolkit" component={ToolKitScreen} />
            {/*<Route path="/market/:marketPair?" component={MarketPairScreen} />*/}
            <Route path="/account/status" component={CheckStatusScreen} />
            <Route path="/account/status-by-key" component={CheckKeyStatusScreen} />
            <Route path="/account/key-gen" component={KeyGenScreen} />
            <Route path="/account/payment/:requestId?" component={PaymentScreen} />
            <Route path="/account/setup/:requestId?" component={SetupScreen} />
            <Route path="/account" component={AccountScreen} />
            {/*<Route path="/about" component={About}/>*/}
          </Switch>
        </div>
      </ConnectedRouter>
    );
  }
}


const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  init: () => dispatch(AppStateActions.init()),
  initApi: () => dispatch(AppStateActions.initApi()),
});

export const AppNavigation = connect(mapStateToProps, mapDispatchToProps)(Navigation);
