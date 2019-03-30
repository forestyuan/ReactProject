import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {LandingActions} from '../../Reducers/LandingReducer';
import './ContactUsSection.scss';

class ContactUsSection extends Component {
  render() {
    const {t, email, changeEmail} = this.props;
    return (<section styleName="contactus-section-container">
        <h2>{t('Contact Us')}</h2>
        <section styleName="content">
          <div id="mc_embed_signup">
            <form styleName="subscribe-form"
                  method="post"
                  target="_blank"
                  id="mc-embedded-subscribe-form"
                  name="mc-embedded-subscribe-form"
                  action="https://3rdex.us19.list-manage.com/subscribe/post?u=e9d3dc7254e3a00f67faa33de&amp;id=fa921cd4a1"
                  noValidate>
              <div id="mc_embed_signup_scroll" styleName="form__inner">
                <input type="email"
                       value={email}
                       onChange={(e) => changeEmail(e.target.value)}
                       name="EMAIL"
                       styleName="email"
                       id="mce-EMAIL"
                       placeholder={t('Leave us your email and stay updated with us')}
                       title={t('Leave us your email and stay updated with us')}
                       required />
                <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
                  <input type="text"
                         value=""
                         name="b_e9d3dc7254e3a00f67faa33de_fa921cd4a1"
                         tabIndex="-1" />
                </div>
                <input styleName="submit"
                       type="submit"
                       value="Subscribe"
                       name="subscribe"
                       id="mc-embedded-subscribe" />
              </div>
            </form>
          </div>
          {/*<div styleName="subscribe-form">*/}
          {/*<input placeholder={t('Leave us your email and stay updated with us')} title="enter your email address" />*/}
          {/*<div className="primary-button-container" styleName="submit">*/}
          {/*<span>{t('Subscribe')}</span>*/}
          {/*</div>*/}
          {/*</div>*/}
          <div styleName="email">
            <p styleName="hint">{t('Or Contact Us at')}</p>
            <a href="mailto:hi@3rdex.com" styleName="address">hi@3rdex.com</a>
          </div>
        </section>
      </section>
    );
  }
}


const mapStateToProps = (state) => ({email: state.landing.email});

const mapDispatchToProps = (dispatch) => ({
  changeEmail: (v) => dispatch(LandingActions.changeEmail(v))
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('landing')(ContactUsSection));
