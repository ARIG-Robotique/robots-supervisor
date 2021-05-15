import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface Action {
  id: string;
  label: string;
  hint: string;
  type: 'number' | 'boolean';
  compute: (value: number | boolean, deuxRobots: boolean) => number;
}

@Component({
  templateUrl: './points-calculator-modal.component.html',
  styleUrls  : ['./points-calculator-modal.component.scss'],
})
export class PointsCalculatorModalComponent {

  readonly actions: Action[] = [
    {
      id     : 'boueePort',
      label  : 'Bouées au port',
      hint   : '1',
      type   : 'number',
      compute: (nb: number) => nb,
    },
    {
      id     : 'boueeChenal',
      label  : 'Chenal : bouée couleur',
      hint   : '1',
      type   : 'number',
      compute: (nb: number) => nb,
    },
    {
      id     : 'boueePaire',
      label  : 'Chenal : paire de bouées',
      hint   : '2',
      type   : 'number',
      compute: (nb: number) => nb * 2,
    },
    {
      id     : 'mancheAir',
      label  : 'Manches à air',
      hint   : '5/15',
      type   : 'number',
      compute: (nb: number) => !nb ? 0 : nb === 1 ? 5 : 15,
    },
    {
      id     : 'portBon',
      label  : 'Bon port',
      hint   : '10/20',
      type   : 'number',
      compute: (nb: number, deuxRobots) => (deuxRobots ? 10 : 20) * Math.min(nb, deuxRobots ? 2 : 1),
    },
    {
      id     : 'portMauvais',
      label  : 'Mauvais port',
      hint   : '3/6',
      type   : 'number',
      compute: (nb: number, deuxRobots) => (deuxRobots ? 3 : 6) * Math.min(nb, deuxRobots ? 2 : 1),
    },
    {
      id     : 'pavillon',
      label  : 'Pavillon hissé',
      hint   : '10',
      type   : 'boolean',
      compute: (ok: boolean) => ok ? 10 : 0,
    },
    {
      id     : 'pharePlace',
      label  : 'Phare : placé',
      hint   : '2',
      type   : 'boolean',
      compute: (ok: boolean) => ok ? 2 : 0,
    },
    {
      id     : 'phareActive',
      label  : 'Phare : activé',
      hint   : '3',
      type   : 'boolean',
      compute: (ok: boolean) => ok ? 3 : 0,
    },
    {
      id     : 'phareTermine',
      label  : 'Phare : terminé',
      hint   : '10',
      type   : 'boolean',
      compute: (ok: boolean) => ok ? 10 : 0,
    },
  ];

  readonly rules: Action[] = [
    {
      id     : 'bonus',
      label  : 'Bonus',
      hint   : '5',
      type   : 'boolean',
      compute: (ok: boolean) => ok ? 5 : 0,
    },
    {
      id     : 'penablite',
      label  : 'Pénalité',
      hint   : '-20',
      type   : 'number',
      compute: (nb: number) => -20 * nb,
    },
  ];

  presets = [
    {
      label     : 'Base',
      deletable : false,
      deuxRobots: true,
      actions   : [
        0,
        0,
        0,
        2,
        2,
        0,
        true,
        true,
        true,
        true
      ],
      rules     : [
        true,
        0
      ],
      evaluation: 60
    },
    {
      label     : 'Zero',
      deletable : false,
      deuxRobots: false,
      actions   : [
        0,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false
      ],
      rules     : [
        false,
        0
      ],
      evaluation: 0
    },
    {
      label     : 'Maximum',
      deletable : false,
      deuxRobots: false,
      actions   : [
        31,
        31,
        15,
        2,
        1,
        0,
        true,
        true,
        true,
        true
      ],
      rules     : [
        true,
        0
      ],
      evaluation: 152
    }
  ];

  form = new FormGroup({
    deuxRobots: new FormControl(false),
    actions   : new FormArray(this.actions.map((a) => new FormControl(a.type === 'number' ? 0 : false))),
    rules     : new FormArray(this.rules.map((a) => new FormControl(a.type === 'number' ? 0 : false))),
    evaluation: new FormControl(0),
  });

  get actionsForm(): FormArray {
    return this.form.get('actions') as FormArray;
  }

  get rulesForm(): FormArray {
    return this.form.get('rules') as FormArray;
  }

  get deuxRobots(): boolean {
    return this.form.get('deuxRobots').value as boolean;
  }

  results = {
    actions     : this.actions.map(() => 0),
    rules       : this.rules.map(() => 0),
    totalActions: 0,
    totalRules  : 0,
    evaluation  : 0,
    total       : 0,
  };

  constructor(private modal: NgbActiveModal) {
    this.form.valueChanges
      .subscribe(() => this.compute());

    this.applyPreset(this.presets[0]);

    const presets = JSON.parse(localStorage.arigCalculatorPresets || '[]');
    this.presets.splice(this.presets.length, 0, ...presets);
  }

  close() {
    this.modal.close();
  }

  applyPreset(preset) {
    this.form.patchValue(preset);
  }

  deletePreset(preset) {
    this.presets.splice(this.presets.indexOf(preset), 1);
    this.savePresets();
  }

  addPreset() {
    const label = prompt('Nom');

    if (label) {
      const existing = this.presets.find(p => p.deletable && p.label.toLocaleLowerCase() === label.toLocaleLowerCase());

      if (existing) {
        Object.assign(existing, this.form.value);
      } else {
        this.presets.push({
          label    : label,
          deletable: true,
          ...this.form.value,
        } as any);
      }

      this.savePresets();
    }
  }

  savePresets() {
    localStorage.arigCalculatorPresets = JSON.stringify(this.presets.filter(p => p.deletable));
  }

  private compute() {
    this.actionsForm.controls.forEach((control, i) => {
      this.results.actions[i] = this.actions[i].compute(control.value, this.deuxRobots);
    });
    this.rulesForm.controls.forEach((control, i) => {
      this.results.rules[i] = this.rules[i].compute(control.value, this.deuxRobots);
    });

    this.results.totalActions = this.results.actions.reduce((t, a) => t + a, 0);
    this.results.totalRules = this.results.rules.reduce((t, a) => t + a, 0);
    this.results.evaluation = Math.ceil(Math.max(
      0, 0.3 * this.results.totalActions - Math.abs(this.results.totalActions - this.form.controls.evaluation.value)
    ));
    this.results.total = this.results.totalActions + this.results.totalRules + this.results.evaluation;
  }

}
