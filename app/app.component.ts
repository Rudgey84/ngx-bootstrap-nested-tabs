import { Component, OnInit, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @Input() data;

  public form: FormGroup;
  public editing = false;
  public fields;
  public availableTabs: string[];
  public availablePills;
  public tabsAndPills: any;

  constructor(private formBuilder: FormBuilder) {}

  get fc() {
    this.form.controls;

    return this.form.controls;
  }

  public onEdit() {
    let editedForm = this.form.getRawValue();

    console.log('editedForm', editedForm);
    const EditedForm = this.fields.map((data) => {
      const val = '';
      if (data.displayLevel3) {
        return {
          ...data,
          value:
            editedForm.fields[data.displayLevel1][data.displayLevel2][
              data.displayLevel3
            ][data.name],
        };
      }
      if (data.displayLevel2) {
        return {
          ...data,
          value:
            editedForm.fields[data.displayLevel1][data.displayLevel2][
              data.name
            ],
        };
      }
      if (data.displayLevel1) {
        return {
          ...data,
          value: editedForm.fields[data.displayLevel1][data.name],
        };
      }
      return {
        ...data,
        value: editedForm.fields[data.name],
      };
    });

    this.handleInitialSetup(EditedForm);
  }

  // Converts the tabs and pills data into something we can use...
  private buildTabsAndPills(fields) {
    const data = {};

    // Loop the entity fields
    fields.forEach((filter) => {
      const {
        displayLevel1,
        displayLevel2,
        name,
        displayName,
        value,
        dataType,
        maxLength,
        isMandatory,
      } = filter;

      // Create level 1 obj (tabs)...
      if (!data[displayLevel1]) {
        data[displayLevel1] = {};
      }

      // Create level 2 obj (pills)...
      if (!data[displayLevel1][displayLevel2]) {
        data[displayLevel1][displayLevel2] = [];
      }

      data[displayLevel1][displayLevel2].push({
        name,
        displayName,
        value,
        dataType,
        maxLength,
        isMandatory,
      });
    });

    return data;
  }

  // Build the pills form group nested with in the tab form group...
  private buildPillsFormGroup(tabsAndPills, tab: string): FormGroup {
    const pills = Object.keys(tabsAndPills[tab]);
    const pillsFormGroup = {};

    pills.forEach((pill) => {
      const pillControls = {};
      const pillData = tabsAndPills[tab][pill];

      // Loop over the sections within the pills..
      pillData.forEach((pillControl) => {
        // Create the pill form controls..
        pillControls[pillControl.name] = new FormControl(pillControl.value);
      });

      // Create the pill form group...
      pillsFormGroup[pill] = new FormGroup(pillControls);
    });

    return new FormGroup(pillsFormGroup);
  }

  // Build the fields form group based on the tabs...
  private buildFieldsFormGroup(tabsAndPills): FormGroup {
    const formGroup = {};
    const tabs = Object.keys(tabsAndPills);

    // Loop over the tabs...
    tabs.forEach((tab) => {
      // Add the nested form groups to the tab form group...
      formGroup[tab] = this.buildPillsFormGroup(tabsAndPills, tab);
    });

    // Return the overall form group
    return new FormGroup(formGroup);
  }

  private createForm(tabsAndPills): FormGroup {
    // sourceRef.updateValueAndValidity();
    return this.formBuilder.group({
      fields: this.buildFieldsFormGroup(tabsAndPills),
    });
  }

  private handleInitialSetup(data): void {
    // Set the tabs and data...
    this.tabsAndPills = this.buildTabsAndPills(data);

    // Create the form...
    this.form = this.createForm(this.tabsAndPills);
    console.log(this.form);
    // Set all available tabs...
    this.availableTabs = Object.keys(this.tabsAndPills);

    // Set all available pills and data...
    const availablePillsObj = {};
    this.availableTabs.forEach((tab) => {
      availablePillsObj[tab] = Object.keys(this.tabsAndPills[tab]);
    });

    this.availablePills = availablePillsObj;
  }

  ngOnInit(): void {
    this.fields = this.data.entity.fields;
    this.handleInitialSetup(this.fields);
  }
}
