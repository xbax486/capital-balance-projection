import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { DetailsTableComponent } from './components/details-table/details-table.component';

@NgModule({
  declarations: [
    AppComponent,
    CalculatorComponent,
    LineChartComponent,
    DetailsTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
