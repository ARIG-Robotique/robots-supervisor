export const SensDeplacement = [
  'AVANT',
  'ARRIERE',
  'AUTO',
];

export const SensRotation = [
  'TRIGO',
  'HORAIRE',
  'AUTO',
];

export const Mouvements: any[] = [
  {
    name  : 'Aller à (path)',
    icon  : 'route',
    type  : 'path',
    fields: ['x', 'y'],
    select: { sens: SensDeplacement },
    values: { sens: 'AUTO' },
  },
  {
    name  : 'Aller à',
    icon  : ['far', 'dot-circle'],
    type  : 'position',
    fields: ['x', 'y'],
    select: { sens: SensDeplacement },
    values: { sens: 'AUTO' },
  },
  {
    name  : 'Faire face',
    icon  : ['fac', 'arrow-to-top'],
    type  : 'face',
    fields: ['x', 'y']
  },
  {
    name  : 'Faire dos',
    icon  : ['fac', 'arrow-from-top'],
    type  : 'dos',
    fields: ['x', 'y']
  },
  {
    name  : 'Orienter',
    icon  : ['far', 'compass'],
    type  : 'orientation',
    fields: ['angle'],
    select: { sens: SensRotation },
    values: { sens: 'AUTO' },
  },
  {
    name  : 'Tourner',
    icon  : 'redo-alt',
    type  : 'tourne',
    fields: ['angle']
  },
  {
    name  : 'Avancer',
    icon  : 'arrow-right',
    type  : 'avance',
    fields: ['distance']
  },
  {
    name  : 'Reculer',
    icon  : 'arrow-left',
    type  : 'recule',
    fields: ['distance']
  }
];
