import { createSelector } from '@ngrx/store';
import { SelectedRobot } from '../models/Robot';

export const selectRobots = (state) => state.robots;
export const selectSelectedRobotsState = (state) => state.selectedRobots;
export const selectRobotsStatusState = (state) => state.robotsStatus;

export const selectSelectedRobots = createSelector(selectRobots, selectSelectedRobotsState, (robots, selected) => {
  return selected.map(({ id, main }) => ({
    ...robots.find(r => r.id === id),
    main,
  } as SelectedRobot));
});

export const selectMainRobot = createSelector(selectRobots, selectSelectedRobotsState, (robots, selected) => {
  const id = selected.find(r => r.main)?.id;
  return id ? robots.find(r => r.id === id) : null;
});
