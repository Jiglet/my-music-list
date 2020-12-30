import { NgModule } from '@angular/core';

// Mat Imports 
import { MatButtonModule } from '@angular/material/button';

const MaterialComponents = [
  MatButtonModule
]

@NgModule({
  imports: [MatButtonModule],
  exports: [MatButtonModule]
})
export class MaterialModule { }
