import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';

export const SectionName = {
  POSTER: 'poster',
  FEATURES: 'features',
  ABOUT_3R_WALLET: 'about3rWallet',
  ABOUT_3RDEX: 'about3rdex',
  TIMELINE: 'timeline',
  CONTACT_US: 'contactus',
};

export const TopNavItems = [
  { to: SectionName.POSTER, label: 'poster' },
  { to: SectionName.FEATURES, label: 'Features' },
  { to: SectionName.ABOUT_3R_WALLET, label: 'About 3rWallet' },
  { to: SectionName.ABOUT_3RDEX, label: 'About 3rdex' },
  { to: SectionName.TIMELINE, label: 'Timeline' },
  { to: SectionName.CONTACT_US, label: 'Contact Us' }
];

/* ------------- Types and Action Creators ------------- */
const actions = {
  changeCurrentSection: ['currentSection'],
  changeEmail: ['email'],
  changeShowNavResponsive: ['showNavResponsive']
};

const { Types, Creators } = createActions(actions, { prefix: 'Landing.' });

export const LandingTypes: {
  CHANGE_CURRENT_SECTION: String;
  CHANGE_EMAIL: String;
  CHANGE_SHOW_NAV_RESPONSIVE: String;
} = Types;

export const LandingActions = Creators;

/* ------------- Initial State ------------- */

export const LandingInitialState = Immutable({
  currentSection: SectionName.POSTER,
  email: '',
  showNavResponsive: false,
});

/* ------------- Reducers ------------- */
const changeCurrentSection = (state: Object, { currentSection }) => {
  console.log(currentSection);
  return state.merge({ currentSection });
};
const changeEmail = (state: Object, { email }) => state.merge({ email });
const changeShowNavResponsive = (state: Object, { showNavResponsive }) => state.merge({ showNavResponsive });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(LandingInitialState, {
  [LandingTypes.CHANGE_CURRENT_SECTION]: changeCurrentSection,
  [LandingTypes.CHANGE_EMAIL]: changeEmail,
  [LandingTypes.CHANGE_SHOW_NAV_RESPONSIVE]: changeShowNavResponsive,
});


