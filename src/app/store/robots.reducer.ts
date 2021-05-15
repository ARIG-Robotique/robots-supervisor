import { createReducer, on } from '@ngrx/store';
import { Robot } from '../models/Robot';
import { addRobot, deleteRobot, editRobot, loadRobots, setMainRobot, toggleRobot } from './robots.actions';

const _robotsReducer = createReducer([] as Robot[],
  on(loadRobots, (state, { robots }) => (robots)),
  on(addRobot, (state, { robot }) => ([...state, robot])),
  on(editRobot, (state, { robot }) => (state.map(r => r.id === robot.id ? robot : r))),
  on(deleteRobot, (state, { id }) => (state.filter(r => r.id !== id)))
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
  on(deleteRobot, (state, { id }) => (state.filter(r => r.id !== id))),
);

export function robotsReducer(state, action) {
  return _robotsReducer(state, action);
}

export function selectedRobotsReducer(state, action) {
  return _selectedRobotsReducer(state, action);
}
