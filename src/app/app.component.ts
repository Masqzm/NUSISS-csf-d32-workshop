import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  protected invalid(): boolean {
    return this.form.invalid || this.lineItems.controls.length <= 0
  }

  // Checks if form control is invalid if it has been modified
  protected isCtrlInvalid(ctrlName: string): boolean {
    console.info(ctrlName, ' invalid: ',  (!!this.form.get(ctrlName)?.invalid && !!this.form.get(ctrlName)?.dirty) )
    return !!this.form.get(ctrlName)?.invalid && !!this.form.get(ctrlName)?.dirty
  }
}
