import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Chart } from 'chart.js';
import { DataProcessService } from 'src/app/services/data-process.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnChanges {
  @Input() balance: number[] = [];
  @Input() years: string[] = [];
  @Input() calculationCompleted: boolean;

  @ViewChild('myCanvas', { static: false })
  myCanvas!: ElementRef;

  public context!: CanvasRenderingContext2D;
  private borderColor: string = '#157DEC';
  private chart: any;

  constructor(private dataProcessService: DataProcessService) {
    this.calculationCompleted = false;
  }

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.drawChart();
  }

  ngOnChanges(changes: any): void {
    this.balance = changes.balance.currentValue;
    this.years = changes.years.currentValue;
    if (this.balance.length > 0) {
      this.chart.destroy();
      this.drawChart();
    }
  }

  private drawChart() {
    let dataProcessService = this.dataProcessService;
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
                callback: function (label) {
                  return new Intl.NumberFormat(dataProcessService.LOCALE, {style: 'currency', currency: dataProcessService.CURRENCY, maximumFractionDigits: 0}).format(+label)
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
