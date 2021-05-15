import {createAction, props} from '@ngrx/store';
import {Robot} from '../models/Robot';

export const loadRobots = createAction('Load robots', props<{ robots: Robot[] }>());
export const addRobot = createAction('Add robot', props<{ robot: Robot }>());
export const editRobot = createAction('Edit robot', props<{ robot: Robot }>());
export const deleteRobot = createAction('Delete robot', props<{ id: number }>());
export const toggleRobot = createAction('Toggle robot', props<{ id: number }>());
export const setMainRobot = createAction('Set main robot', props<{id: number}>());
