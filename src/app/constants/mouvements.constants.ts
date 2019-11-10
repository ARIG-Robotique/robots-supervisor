export const Mouvements: any[] = [
  {
    name: 'Aller à (path)',
    icon: 'route',
    type: 'path',
    fields: ['x', 'y']
  },
  {
    name: 'Aller à',
    icon: ['far', 'dot-circle'],
    type: 'position',
    fields: ['x', 'y']
  },
  {
    name: 'Faire face',
    icon: ['fac', 'arrow-to-top'],
    type: 'face',
    fields: ['x', 'y']
  },
  {
    name: 'Faire dos',
    icon: ['fac', 'arrow-from-top'],
    type: 'dos',
    fields: ['x', 'y']
  },
  {
    name: 'Orienter',
    icon: ['far', 'compass'],
    type: 'orientation',
    fields: ['angle']
  },
  {
    name: 'Tourner',
    icon: 'redo-alt',
    type: 'tourne',
    fields: ['angle']
  },
  {
    name: 'Avancer',
    icon: 'arrow-right',
    type: 'avance',
    fields: ['distance']
  },
  {
    name: 'Reculer',
    icon: 'arrow-left',
    type: 'recule',
    fields: ['distance']
  }
];
