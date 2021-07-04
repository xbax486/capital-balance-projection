import { Component, Input } from '@angular/core';
import { CalculationDetails } from '../../interfaces/calculation.details';
import { DataProcessService } from 'src/app/services/data-process.service';

@Component({
  selector: 'app-details-table',
  templateUrl: './details-table.component.html',
  styleUrls: ['./details-table.component.css'],
})
export class DetailsTableComponent {
  @Input() details: CalculationDetails = {
    ages: [],
    startBalance: [],
    contributions: [],
    earnings: [],
    fees: [],
    tax: [],
    withdrawals: [],
    endBalance: [],
  };
  @Input() years: string[] = [];

  constructor(public dataProcessService: DataProcessService) {}
}

