import { createReducerSelectors } from 'normalized-reducers-utils';
import {
  NodeTransaction,
  NodeTransactionsReducer,
} from './nodeTransactions.types';
import { ReduxState } from '../../reducers.types';
import { nodeTransactionsReducerPath } from './nodeTransactions.reducerPath';

export const nodeTransactionsReducerSelectors = createReducerSelectors<
  NodeTransactionsReducer['metadata'],
  NodeTransaction,
  typeof nodeTransactionsReducerPath,
  ReduxState
>(nodeTransactionsReducerPath);

export const {
  selectRequests: selectNodeTransactionsRequests,
  selectMetadata: selectNodeTransactionsMetadata,
  selectData: selectNodeTransactionsData,
  selectConfig: selectNodeTransactionsConfig,
} = nodeTransactionsReducerSelectors;
