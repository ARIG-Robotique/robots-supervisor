import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './points-calculator-modal.component.html',
  styleUrls  : ['./points-calculator-modal.component.scss'],
})
export class PointsCalculatorModalComponent {

  readonly actions = [
    {label: 'Bouées au port', pt: 1},
    {label: 'Chenal : bouée couleur', pt: 1},
    {label: 'Chenal : paire de bouées', pt: 2},
    {label: '1 manche à air', pt: 5},
    {label: '2 manches à air', pt: 15},
    {label: 'Bon port', pt: 20},
    {label: 'Mauvais port', pt: 6},
    {label: 'Pavillon hissé', pt: 10},
    {label: 'Phare : placé', pt: 2},
    {label: 'Phare : activé', pt: 3},
    {label: 'Phare : terminé', pt: 10},
  ];

  readonly rules = [
    {label: 'Bonus', pt: 5},
    {label: 'Pénalité', pt: -20},
  ];

  presets = [
    {
      label    : 'Zero',
      actions  : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      rules    : [0, 0],
      deletable: false,
    },
    {
      label    : 'Maximum',
      actions  : [31, 31, 15, 0, 1, 1, 0, 1, 1, 1, 1],
      rules    : [1, 0],
      deletable: false,
    },
  ];

  form = new FormGroup({
    actions   : new FormArray(this.actions.map(() => new FormControl(0))),
    rules     : new FormArray(this.rules.map(() => new FormControl(0))),
    evaluation: new FormControl(0),
  });

  get actionsForm(): FormArray {
    return this.form.get('actions') as FormArray;
  }

  get rulesForm(): FormArray {
    return this.form.get('rules') as FormArray;
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
    this.initListeners('actions');
    this.initListeners('rules');

    this.form.controls.evaluation.valueChanges
      .subscribe(() => this.compute());

    this.form.patchValue({
      actions: [0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1],
      rules  : [1, 0],
    });

    const presets = JSON.parse(localStorage.calculatorPresets || '[]');
    this.presets.splice(this.presets.length, 0, ...presets);
  }

  close() {
    this.modal.close();
  }

  applyPreset(preset) {
    this.form.patchValue({
      actions: preset.actions,
      rules  : preset.rules,
    });
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
        Object.assign(existing, {
          actions  : (this.form.controls.actions as FormArray).controls.map(c => c.value),
          rules    : (this.form.controls.rules as FormArray).controls.map(c => c.value),
        });
      } else {
        this.presets.push({
          label    : label,
          deletable: true,
          actions  : (this.form.controls.actions as FormArray).controls.map(c => c.value),
          rules    : (this.form.controls.rules as FormArray).controls.map(c => c.value),
        });
      }

      this.savePresets();
    }
  }

  savePresets() {
    localStorage.calculatorPresets = JSON.stringify(this.presets.filter(p => p.deletable));
  }

  private compute() {
    this.results.totalActions = this.results.actions.reduce((t, a) => t + a, 0);
    this.results.totalRules = this.results.rules.reduce((t, a) => t + a, 0);
    this.results.evaluation = Math.ceil(Math.max(
      0, 0.3 * this.results.totalActions - Math.abs(this.results.totalActions - this.form.controls.evaluation.value)
    ));
    this.results.total = this.results.totalActions + this.results.totalRules + this.results.evaluation;
  }

  private initListeners(category: string) {
    const controls = (this.form.controls[category] as FormArray).controls;

    controls.forEach((control, i) => {
      control.valueChanges
        .subscribe(quantity => {
          this.results[category][i] = quantity * this[category][i].pt;
          this.compute();
          this.form.controls.evaluation.setValue(this.results.totalActions);
        });
    });
  }

}
