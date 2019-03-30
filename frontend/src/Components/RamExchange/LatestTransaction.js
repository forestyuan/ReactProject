import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {RamTransactionActions} from '../../Reducers/RamTransactionReducer';
import './LatestTransaction.scss';
import loadingImg from '../../Images/loading.gif';
import TransactionRow from "./TransactionRow";

class LatestTransaction extends Component {
  componentDidMount() {
    this.props.init();
  }

  renderList() {
    const {t} = this.props;
    const {transactions} = this.props;
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
    const {loadingMarket} = this.props;
    if (!loadingMarket) return null;
    return (<div className="loading" styleName="loading">
      <img alt='loading' src={loadingImg}/>
    </div>);
  }


  render() {
    const {t} = this.props;
    return (
      <div styleName='transaction-container'>
        <div className="font-20 bold color-text-primary" styleName='title'>{t('marketTransactionTableTitle')}</div>
        {this.renderList()}
        {this.renderLoading()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loadingMarket: state.ramTransaction.loadingMarket,
  initFinish: state.appState.initFinish,
  transactions: state.ramTransaction.marketTransactions,
});

const mapDispatchToProps = (dispatch) => ({
  init: async () => {
    dispatch(RamTransactionActions.changeMarketTransactionLoading(true));
    dispatch(await RamTransactionActions.listMarketTransactions());
    dispatch(RamTransactionActions.changeMarketTransactionLoading(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(LatestTransaction));

