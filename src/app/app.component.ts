import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private fb = inject(FormBuilder)
  protected form!: FormGroup
  protected lineItems!: FormArray

  ngOnInit(): void {
    this.form = this.createForm()
  }
  private createForm(): FormGroup { 
    // Init lineItems FormArray
    this.lineItems = this.fb.array([]) 

    // Create form group & return it
    return this.fb.group({
      // Declare form controls & array & init them
      name: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      address: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      deliveryDate: this.fb.control<string>('', [Validators.required]),
      rush: this.fb.control<boolean>(false),
      lineItems: this.lineItems
    })
  }

  private createItem(): FormGroup {
    return this.fb.group({
      itemName: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      quantity: this.fb.control<number>(1, [Validators.required, Validators.min(1)]),
      price: this.fb.control<number>(0.1, [Validators.required, Validators.min(0.1)])
    })
  }
  protected addItem() {
    this.lineItems.push(this.createItem())
  }
  protected delItem(idx: number) {
    this.lineItems.removeAt(idx)
  }

  protected processForm() {
    const values: Order = this.form.value

    console.info('>>> values: ', values)

    this.form.reset()
  }

  // Validations
  // Overall validator for form
  protected invalidForm(): boolean {
    return this.form.invalid || this.lineItems.controls.length <= 0
  }

  protected invalid(ctrlName: string): boolean {
    return this.grpCtrlInvalid(this.form, ctrlName)
  }
  // Checks if form has been modified & control is invalid from a given formgroup 
  protected grpCtrlInvalid(grp: FormGroup | AbstractControl, ctrlName: string): boolean {
    const ctrl = grp.get(ctrlName)
    return !ctrl?.pristine && !!ctrl?.invalid
  }
}
