import { createReducer, on } from '@ngrx/store';
import { Robot } from '../models/Robot';
import {
  loadRobots,
  setMainRobot,
  setRobotStatus,
  toggleRobot
} from './robots.actions';

const _robotsReducer = createReducer([] as Robot[],
  on(loadRobots, (state, { robots }) => (robots)),
);

const _selectedRobotsReducer = createReducer([] as { id: number, main: boolean }[],
  on(setMainRobot, (state, { id }) => {
    return [...state.filter(r => r.id !== id).map(r => ({ id: r.id, main: false })), { id, main: true }];
  }),
  on(toggleRobot, (state, { id }) => {
    const selected = state.find(r => r.id === id);
    if (selected) {
      return state.filter(r => r.id !== id);
    } else {
      const hasMain = state.find(r => r.main);
      return [...state, { id, main: !hasMain }];
    }
  }),
);

const _robotsStatusReducer = createReducer([] as { id: number, status: boolean }[],
  on(loadRobots, (state, { robots }) => (robots.map(r => ({ id: r.id, status: false })))),
  on(setRobotStatus, (state, { id, status }) => state.map(r => r.id === id ? { id, status } : r)),
);

export function robotsReducer(state, action) {
  return _robotsReducer(state, action);
}

export function selectedRobotsReducer(state, action) {
  return _selectedRobotsReducer(state, action);
}

export function robotsStatusReducer(state, action) {
  return _robotsStatusReducer(state, action);
}
