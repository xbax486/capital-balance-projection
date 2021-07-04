import { Component, OnInit, Input } from '@angular/core';
import { CalculationDetails } from '../../interfaces/calculation.details';

@Component({
  selector: 'app-details-table',
  templateUrl: './details-table.component.html',
  styleUrls: ['./details-table.component.css'],
})
export class DetailsTableComponent implements OnInit {
  @Input() details: CalculationDetails = {
    ages: [],
    startBalance: [],
    contributions: [],
    earnings: [],
    fees: [],
    tax: [],
    withdrawals: [],
    endBalance: []
  };
  @Input() years: string[] = [];

  constructor() {}

  ngOnInit(): void {}
}
