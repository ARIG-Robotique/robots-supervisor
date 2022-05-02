import { createAction, props } from '@ngrx/store';
import { Robot } from '../models/Robot';

export const loadRobots = createAction('Load robots', props<{ robots: Robot[] }>());
export const toggleRobot = createAction('Toggle robot', props<{ id: number }>());
export const setMainRobot = createAction('Set main robot', props<{id: number}>());
export const setRobotStatus = createAction('Set robot status', props<{id: number, status: boolean}>());
