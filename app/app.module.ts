import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule.forRoot(),
    TabsModule.forRoot(),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
