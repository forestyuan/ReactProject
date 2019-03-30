import React, {Component} from 'react';
import {translate} from 'react-i18next';
import './TransactionRow.scss';

function displayNumber(number, precision = 4) {
  const converted = Number(number);
  if (Number.isFinite(converted)) {
    return converted.toFixed(precision);
  }
  return '-';
}

class TransactionRow extends Component {
  render() {
    const {transaction} = this.props;
    const time = transaction.time;
    const date = transaction.date;
    const action = {
      sellram: 'SELL',
      buyrambytes: 'BUY',
      buyram: 'BUY'
    }[transaction.act.name];
    const colorClass = transaction.act.name === 'sellram' ? 'color-text-orange' : 'color-text-green';
    const kb = transaction.bytes / 1024;
    const eos = transaction.eos;
    const price = transaction.price;
    const approximateSymbol = {
      sellram: '',
      buyrambytes: '',
      buyram: '≈'
    }[transaction.act.name];

    return (<tr className='font-12 color-text-secondary' styleName='transaction-row'>
      <td>
        <div>{date}</div>
        <div>{time}</div>
      </td>
      <td className={colorClass}>{action}</td>
      <td>{eos}</td>
      <td>{approximateSymbol} {displayNumber(kb)}</td>
      <td>{approximateSymbol} {displayNumber(price)}</td>
    </tr>);
  }
}

export default translate('translations')(TransactionRow);
