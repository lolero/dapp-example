import {
  handleFail,
  handleRequest,
  handleSavePartialReducerMetadata,
} from 'normalized-reducers-utils';
import { StateMainReducer } from './stateMain.types';
import { stateMainInitialState } from './stateMain.initialState';
import {
  StateMainActionTypes,
  StateMainReducerHittingAction,
} from './stateMain.actionsTypes';

function stateMainReducer(
  // eslint-disable-next-line default-param-last
  state: StateMainReducer = stateMainInitialState,
  action: StateMainReducerHittingAction,
): StateMainReducer {
  switch (action.type) {
    case StateMainActionTypes.STATE_MAIN_UPDATE_PARTIAL_REDUCER_METADATA_REQUEST:
      return handleRequest(state, action);
    case StateMainActionTypes.STATE_MAIN_UPDATE_PARTIAL_REDUCER_METADATA_SUCCESS:
      return handleSavePartialReducerMetadata(state, action);
    case StateMainActionTypes.STATE_MAIN_UPDATE_PARTIAL_REDUCER_METADATA_FAIL:
      return handleFail(state, action);
    default:
      return state;
  }
}

export default stateMainReducer;
