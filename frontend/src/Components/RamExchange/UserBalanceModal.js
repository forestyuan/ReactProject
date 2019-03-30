import React, {Component} from 'react';
import SyncScatter from './SyncScatter';
import UserTransaction from './UserTransaction';

class UserBalanceModal extends Component {
  render() {
    return (<div>
      <SyncScatter/>
      <UserTransaction/>
    </div>);
  }
}

export default UserBalanceModal;
