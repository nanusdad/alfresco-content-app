/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, forwardRef, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { RuleSimpleCondition } from '../../model/rule-simple-condition.model';
import { comparatorHiddenForConditionFieldType, RuleConditionField, ruleConditionFields } from './rule-condition-fields';
import { RuleConditionComparator, ruleConditionComparators } from './rule-condition-comparators';
import { AppConfigService } from '@alfresco/adf-core';
import { MimeType } from './rule-mime-types';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  selector: 'aca-rule-simple-condition',
  templateUrl: './rule-simple-condition.ui-component.html',
  styleUrls: ['./rule-simple-condition.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-simple-condition' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RuleSimpleConditionUiComponent)
    }
  ]
})
export class RuleSimpleConditionUiComponent implements ControlValueAccessor, OnDestroy {
  readonly fields = ruleConditionFields;

  form = new FormGroup({
    field: new FormControl('cm:name'),
    comparator: new FormControl('equals'),
    parameter: new FormControl()
  });

  mimeTypes: MimeType[] = [];

  private _readOnly = false;
  @Input()
  get readOnly(): boolean {
    return this._readOnly;
  }
  set readOnly(isReadOnly: boolean) {
    this.setDisabledState(isReadOnly);
  }

  constructor(private config: AppConfigService) {
    this.mimeTypes = this.config.get<Array<MimeType>>('mimeTypes');
  }

  private formSubscription = this.form.valueChanges.subscribe((value: any) => {
    this.onChange(value);
    this.onTouch();
  });

  get isSelectedFieldKnown(): boolean {
    const selectedFieldName = this.form.get('field').value;
    return this.fields.findIndex((field: RuleConditionField) => selectedFieldName === field.name) > -1;
  }
  get selectedField(): RuleConditionField {
    const selectedFieldName = this.form.get('field').value;
    if (!this.isSelectedFieldKnown) {
      return {
        name: selectedFieldName,
        label: selectedFieldName,
        type: 'special'
      };
    }
    return this.fields.find((field) => field.name === selectedFieldName);
  }

  get selectedFieldComparators(): RuleConditionComparator[] {
    return ruleConditionComparators.filter((comparator) => Object.keys(comparator.labels).includes(this.selectedField.type));
  }
  get isComparatorHidden(): boolean {
    return comparatorHiddenForConditionFieldType.includes(this.selectedField?.type);
  }
  get comparatorControl(): AbstractControl {
    return this.form.get('comparator');
  }

  private get parameterControl(): AbstractControl<string> {
    return this.form.get('parameter');
  }

  onChange: (condition: RuleSimpleCondition) => void = () => undefined;
  onTouch: () => void = () => undefined;

  writeValue(value: RuleSimpleCondition) {
    this.form.setValue(value);
  }

  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this._readOnly = true;
      this.form.disable();
    } else {
      this._readOnly = false;
      this.form.enable();
    }
  }

  onChangeField() {
    if (!this.selectedFieldComparators.find((comparator) => comparator.name === this.comparatorControl.value)) {
      this.comparatorControl.setValue('equals');
    }
    if (!this.parameterControl.value && this.selectedField?.type === 'mimeType') {
      this.parameterControl.setValue(this.mimeTypes[0]?.value);
    } else if (this.parameterControl.value) {
      this.parameterControl.setValue('');
    }
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }
}
