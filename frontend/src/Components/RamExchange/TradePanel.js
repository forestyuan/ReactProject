import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import classNames from 'classnames';
import {
  byteInputMin,
  byteInputStep,
  ByteUnits,
  ByteUnitToLabel,
  TradeRamActions,
  TradeType,
} from '../../Reducers/TradeRamReducer';
import {AccountInfoActions} from '../../Reducers/AccountInfoReducer';
import './TradePanel.scss';

class TradePanel extends Component {
  onClick() {
    const {
      tradeType,
      eos,
      bytes,
      byteUnit,
    } = this.props;
    const {
      buyRam,
      sellRam
    } = this.props;
    const isBuyRam = tradeType !== TradeType.SELL_RAM;
    const disable = bytes === 0;
    if (disable) return;
    isBuyRam ?
      buyRam({eos, bytes: bytes * byteUnit, tradeType}) :
      sellRam({bytes: bytes * byteUnit});
  }

  render() {
    const {t} = this.props;
    const {
      account,
      initFinish,
      inputMode,
      tradeType,
      fee = 0,
      eos,
      bytes,
      byteUnit,
      unitSelecting,
      byteInputMin,
      byteInputStep,
    } = this.props;
    const {
      changeTradeType,
      changeInputMode,
      changeEos,
      changeBytes,
      changeByteUnit,
      toggleUnitSelector,
      calcByEos,
      calcByBytes,
    } = this.props;
    const isBuyRam = tradeType !== TradeType.SELL_RAM;
    let ramInput = bytes;
    if (!inputMode) {
      if (byteUnit === ByteUnits['Kilo Bytes']) {
        ramInput = parseFloat(bytes).toFixed(2);
      } else if (byteUnit === ByteUnits['Mega Bytes']) {
        ramInput = parseFloat(bytes).toFixed(4);
      }
    }
    const eosInput = inputMode ? eos : parseFloat(eos).toFixed(4);
    const disable = bytes === 0;
    return (
      <section styleName="trade-panel">
        <div styleName="trade-panel-inputs">
          <div styleName="trade-panel-input">
            <p className="font-14 color-text-shallow bold">{t(
              isBuyRam ? 'buyRamInputLabel' : 'sellRamInputLabel'
            )}</p>
            <input
              min={byteInputMin}
              value={ramInput}
              onFocus={() => {
                if (tradeType !== TradeType.SELL_RAM) changeTradeType({tradeType: TradeType.BUY_RAM_BYTES});
                changeInputMode({inputMode: true});
              }}
              onBlur={() => {
                calcByBytes(ramInput, byteUnit);
                changeInputMode({inputMode: false});
              }}
              onChange={({target: {value}}) => changeBytes(value)}
              type="number"
              step={byteInputStep}
            />
            <div styleName="unit-selector">
              <p onClick={toggleUnitSelector}
                 className="font-18 color-text-primary bold cursor-pointer">RAM({ByteUnitToLabel[byteUnit]}) ▾</p>
              {unitSelecting && <ul styleName="units" onMouseLeave={toggleUnitSelector}>
                {Object.keys(ByteUnits)
                  .map((k) => {
                    const active = ByteUnits[k] === byteUnit;
                    return (<li
                      styleName="unit"
                      onClick={() => changeByteUnit({byteUnit: ByteUnits[k]})}
                      key={k}>
                      <p style={{
                        color: active ? '#4e7df5' : 'rgba(8, 33, 59, 0.87)'
                      }}>{k}</p>
                      {active && <i className="icon-ok" styleName="icon-ok"/>}
                    </li>);
                  })
                }
              </ul>}
            </div>
          </div>
          <div><span className="color-text-shallow font-32">=</span></div>
          <div styleName="trade-panel-input">
            <p className="font-14 color-text-shallow bold">{t(
              isBuyRam ? 'payInputLabel' : 'sellInputLabel'
            )}</p>
            <input
              min={0.0000}
              value={eosInput}
              onFocus={() => {
                if (tradeType !== TradeType.SELL_RAM) changeTradeType({tradeType: TradeType.BUY_RAM});
                changeInputMode({inputMode: true});
              }}
              onBlur={() => {
                calcByEos(eos, byteUnit);
                changeInputMode({inputMode: false});
              }}
              onChange={changeEos}
              type="number"
              step="0.0001"
            />
            <p className='font-18 color-text-primary bold'>EOS</p>
          </div>
        </div>
        <div className='font-12 color-text-shallow' styleName='trade-panel-detail'>
          <div>
            <div className='bold' styleName='title'>{t('otherCosts')} <i className='icon-info'/></div>
            <div>{t('Fee')} (0.5%) <span styleName="number">{fee.toFixed(4)} EOS</span></div>
          </div>
        </div>
        {initFinish && account &&
        <div onClick={() => this.onClick()} styleName={classNames('trade-panel-action', {
          'disabled': disable,
          'buy': isBuyRam && !disable,
          'sell': !isBuyRam && !disable,
        })}>
          <span>{t(isBuyRam ? 'buy' : 'sell')}</span>
          <i className="icon-right"/>
        </div>}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  tradeType: state.tradeRam.tradeType,
  inputMode: state.tradeRam.inputMode,
  fee: state.tradeRam.fee,
  eos: state.tradeRam.eos,
  bytes: state.tradeRam.bytes,
  byteUnit: state.tradeRam.byteUnit,
  unitSelecting: state.tradeRam.unitSelecting,
  initFinish: state.appState.initFinish,
  account: state.accountInfo.account,
  byteInputMin: byteInputMin(state.tradeRam),
  byteInputStep: byteInputStep(state.tradeRam)
});

const mapDispatchToProps = (dispatch) => ({
  changeInputMode: ({inputMode}) => dispatch(TradeRamActions.changeInputMode(inputMode)),
  changeTradeType: ({tradeType}) => dispatch(TradeRamActions.changeTradeType(tradeType)),
  changeEos: ({target: {value}}) => dispatch(TradeRamActions.changeEos(value)),
  changeBytes: (value) => dispatch(TradeRamActions.changeBytes(value)),
  toggleUnitSelector: () => dispatch(TradeRamActions.toggleUnitSelector()),
  changeByteUnit: ({byteUnit}) => {
    dispatch(TradeRamActions.setByteUnit({byteUnit}));
    dispatch(TradeRamActions.toggleUnitSelector());
  },
  calcByEos: (eos, byteUnit) => dispatch(TradeRamActions.calcByEos({eos, byteUnit})),
  calcByBytes: (bytes, byteUnit) => dispatch(TradeRamActions.calcByBytes({bytes, byteUnit})),
  buyRam: async ({eos, bytes, tradeType}) => {
    dispatch(await TradeRamActions.buyRam({eos, bytes, tradeType}));
    let timer = setTimeout(() => {
      dispatch(AccountInfoActions.syncAccount());
      clearTimeout(timer);
      timer = null;
    }, 300);
  },
  sellRam: async ({bytes}) => {
    dispatch(await TradeRamActions.sellRam({bytes}));
    let timer = setTimeout(() => {
      dispatch(AccountInfoActions.syncAccount());
      clearTimeout(timer);
      timer = null;
    }, 300);
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(TradePanel));
