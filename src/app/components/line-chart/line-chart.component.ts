import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() balance: number[] = [];
  @Input() years: string[] = [];
  @ViewChild('myCanvas', { static: false })
  myCanvas!: ElementRef;

  public context!: CanvasRenderingContext2D;
  private borderColor: string = '#157DEC';
  private chart: any;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.balance = changes.balance.currentValue;
    this.years = changes.years.currentValue;
    if (this.balance.length > 0) {
      this.chart.destroy();
      this.drawChart();
    }
  }

  private drawChart() {
    this.chart = new Chart(this.context, {
      type: 'line',
      data: {
        labels: this.years,
        datasets: [
          {
            data: this.balance,
            fill: false,
            borderColor: this.borderColor,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        legend: {
          display: false,
        },
        title: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (label, index, labels) {
                  return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(+label);
                },
              }
            },
          ],
        },
        tooltips: {
          mode: 'point'
        }
      },
    })
  }
}
