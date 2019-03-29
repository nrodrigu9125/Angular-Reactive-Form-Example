import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import * as int from "./auth";
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
            ReactiveFormsModule, // Brings in Reactive Forms
            HttpClientModule], // Make HTTP services available to the application
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: int.WinAuthInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
