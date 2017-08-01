export const Mouvements: any[] = [
  {
    name: 'Aller à (path)',
    type: 'path',
    fields: ['x', 'y']
  },
  {
    name: 'Aller à',
    type: 'position',
    fields: ['x', 'y']
  },
  {
    name: 'Faire face',
    type: 'face',
    fields: ['x', 'y']
  },
  {
    name: 'Faire dos',
    type: 'dos',
    fields: ['x', 'y']
  },
  {
    name: 'Orienter',
    type: 'orientation',
    fields: ['angle']
  },
  {
    name: 'Tourner',
    type: 'tourne',
    fields: ['angle']
  },
  {
    name: 'Avancer',
    type: 'avance',
    fields: ['distance']
  },
  {
    name: 'Reculer',
    type: 'recule',
    fields: ['distance']
  }
];
