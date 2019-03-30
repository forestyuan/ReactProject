import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import TransactionRow from './TransactionRow';
import {RamTransactionActions} from '../../Reducers/RamTransactionReducer';
import loadingImg from '../../Images/loading.gif';
import './UserTransaction.scss';


class UserTransactionModal extends Component {
  componentDidMount() {
    if (this.props.initFinish) this.props.init();
  }

  renderList() {
    const {t} = this.props;
    const {transactions} = this.props;
    if (transactions.length === 0) return (<div styleName='transaction-table'>
      {t('No RAM transaction history at this moment.')}
    </div>);
    return (<table styleName='transaction-table'>
      <thead>
      <tr className='font-12 semi-bold color-text-shallow'>
        <th>{t('time')}</th>
        <th>{t('bidAsk')}</th>
        <th>EOS</th>
        <th>RAM(KB)</th>
        <th>{t('price')}(EOS/KB)</th>
      </tr>
      </thead>
      <tbody>
      {transactions.map((trx, i) => {
        return <TransactionRow key={i} transaction={trx}/>;
      })}
      </tbody>
    </table>);
  }

  renderLoading() {
    const {loadingUser} = this.props;
    if (!loadingUser) return null;
    return (<div styleName="loading">
      <div className="loading">
        <img alt='loading' src={loadingImg}/>
      </div>
    </div>);
  }

  renderLoadMore() {
    const {loadingUser, userMarker, transactions, hasMore} = this.props;
    const {moreUserTransactions} = this.props;
    if (transactions.length === 0) return null;
    if (loadingUser) return null;
    if (hasMore) return (<div
      className='general-button-container' styleName="load-more"
      onClick={() => moreUserTransactions({userTransactions: transactions, userMarker})}
    >
      <span>LoadMore</span>
    </div>);
    return (<div styleName="no-more">
      <span>No more RAM transactions</span>
    </div>);
  }

  render() {
    const {t} = this.props;
    const {isModal, toggleUserTransaction} = this.props;
    return (
      <div styleName='transaction-container'>
        <div styleName='title'>{t('userTransactionTableTitle')}</div>
        {isModal && <i className="icon-cancel cursor-pointer font-24 color-text-blue"
                       styleName="icon-cancel"
                       onClick={toggleUserTransaction}/>}
        {this.renderList()}
        {this.renderLoading()}
        {this.renderLoadMore()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loadingUser: state.ramTransaction.loadingUser,
  initFinish: state.appState.initFinish,
  transactions: state.ramTransaction.userTransactions,
  userMarker: state.ramTransaction.userMarker,
  hasMore: state.ramTransaction.hasMoreUserTrans
});

const mapDispatchToProps = (dispatch) => ({
  init: async () => {
    dispatch(RamTransactionActions.changeUserTransactionLoading(true));
    dispatch(await RamTransactionActions.listUserTransactions());
    dispatch(RamTransactionActions.changeUserTransactionLoading(false));
  },
  toggleUserTransaction: async () => {
    dispatch(RamTransactionActions.changeIsShowUserTransaction(false));
  },
  moreUserTransactions: async ({userTransactions, userMarker}) => {
    dispatch(RamTransactionActions.changeUserTransactionLoading(true));
    await dispatch(RamTransactionActions.moreUserTransactions({userTransactions, userMarker}));
    dispatch(RamTransactionActions.changeUserTransactionLoading(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(UserTransactionModal));
