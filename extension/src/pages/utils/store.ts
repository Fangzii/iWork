import { createStore, Action } from 'redux';

interface AppState {
  myInfo: any;
  template: any;
}

const initialState: AppState = {
  myInfo: {},
  template: {},
};

interface UpdateNameAction extends Action {
  type: 'UPDATE_MYINFO' | 'UPDATE_TEMPLATE';
  payload: any;
}

type MyInfoAction = UpdateNameAction;

const reducer = (state = initialState, action: MyInfoAction): AppState => {
  switch (action.type) {
    case 'UPDATE_MYINFO':
      return { ...state, myInfo: action.payload };
    case 'UPDATE_TEMPLATE':
      return { ...state, template: action.payload };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
