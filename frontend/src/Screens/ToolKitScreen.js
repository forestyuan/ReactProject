import React, { Component } from 'react';
import './ToolKitScreen.scss';
import SyncScatter from '../Components/RamExchange/SyncScatter';
import InputRange from 'react-input-range';
import connect from 'react-redux/es/connect/connect';
import { translate } from 'react-i18next';
import { AccountInfoActions } from '../Reducers/AccountInfoReducer';

class ToolKitScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val: 0
    };
  }

  async componentDidMount() {
    const { fetchBP } = this.props;
    await fetchBP();
  }

  render() {
    const { eosQuota, eosStaked, eosBean } = this.props;
    const { stake, vote } = this.props;
    return (
      <div>
        <section styleName="scatter-container">
          <SyncScatter/>
        </section>
        <section>
          <div styleName="voting-power">
            <div styleName="slider">
              <InputRange
                maxValue={eosQuota}
                minValue={0}
                value={this.state.val}
                onChange={val => this.setState({ val })}/>
            </div>
            <div className="primary-button-container active" onClick={() => stake({ net: 0, cpu: this.state.val })}>
              SET VOTING POWER
            </div>
          </div>
          <div>
            <table styleName="table-container">
              <thead>
              <tr className="font-14 color-text-secondary color-text-white" styleName="thead">
                <th>#</th>
                <th>Account</th>
                <th>Location</th>
                <th>Votes#</th>
                <th>URL</th>
                <th></th>
              </tr>
              </thead>
              <tbody styleName="tbody">
              <tr styleName="row">
                <td>{eosBean.rank}</td>
                <td>{eosBean.owner}</td>
                <td>Boston</td>
                <td>{eosBean.vote_eos}</td>
                <td><a href={eosBean.url}>{eosBean.url}</a></td>
                <td>
                  <div className="primary-button-container active" onClick={vote}>
                    VOTE
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  eosStaked: state.accountInfo.eosStaked,
  eosQuota: state.accountInfo.eosQuota,
  eosBean: state.accountInfo.eosBean,
});

const mapDispatchToProps = (dispatch) => ({
  stake: async ({ net, cpu }) => {
    await AccountInfoActions.stakeEOS({ net, cpu });
    dispatch(await AccountInfoActions.syncAccount());
  },
  vote: async () => {
    await AccountInfoActions.vote();
  },
  fetchBP: async () => {
    dispatch(await AccountInfoActions.fetchBP());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(ToolKitScreen));
