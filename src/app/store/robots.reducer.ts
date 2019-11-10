import {createReducer, on} from '@ngrx/store';
import {Robot} from '../models/Robot';
import {addRobot, deleteRobot, editRobot, loadRobots} from './robots.actions';

const _robotsReducer = createReducer([] as Robot[],
  on(loadRobots, (state, {robots}) => (robots)),
  on(addRobot, (state, {robot}) => ([...state, robot])),
  on(editRobot, (state, {robot}) => (state.map(r => r.id === robot.id ? robot : r))),
  on(deleteRobot, (state, {id}) => (state.filter(r => r.id !== id)))
);

export function robotsReducer(state, action) {
  return _robotsReducer(state, action);
}
