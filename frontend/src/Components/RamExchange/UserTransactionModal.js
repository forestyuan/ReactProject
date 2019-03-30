import React, {Component} from 'react';
import {connect} from 'react-redux';
import UserTransaction from './UserTransaction';
import './UserTransactionModal.scss';


class UserTransactionModal extends Component {

  render() {
    const {visible} = this.props;
    if (!visible) return null;
    return (
      <div styleName="mask"><UserTransaction isModal={true}/></div>
    );
  }
}

const mapStateToProps = state => ({
  visible: state.ramTransaction.isShowUserTransaction
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserTransactionModal);
