import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../interfaces/user';
import { CalculatorFormDetails } from '../../interfaces/calculator.form.details';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent implements OnInit {
  public user: User = {
    precondictions: {
      startBalance: 300000,
      firstYear: 2020,
      lastYear: 2020,
      ageOfFirstYear: 45
    },
    inputs: {
      salary: 100000,
      contributionRate: 9.5,
      inflationRate: 3,
      earningsRate: 7.5,
      feesRate: 1.5,
      taxRate: 15,
      withdrawalRate: 5,
    },
    outputs: {
      startBalance: 0,
      contributions: 0,
      earnings: 0,
      fees: 0,
      tax: 0,
      withdrawals: 0,
      endBalance: 0,
    }
  };
  public balance: number[] = [];
  public years: string[] = [];

  private readonly RATE_PERCENTAGE = 100;

  constructor() {}

  ngOnInit(): void {}

  onSubmit(calculatorForm: NgForm) {
    this.balance = [];
    this.years = [];
    this.calCulate(calculatorForm.form.value);
    console.log('balance', this.balance);
    console.log('years', this.years);
  }

  getContributions(year: number, user: User) {
    user.outputs.contributions = year >= 22 ? 0 : user.inputs.salary * this.toPercentage(user.inputs.contributionRate) * Math.pow(1 + this.toPercentage(user.inputs.inflationRate), year - 1);
    return user.outputs.contributions;
  }

  getEarnings(year: number, user: User) {
    let startBalance = this.getStartBalance(year, user);
    user.outputs.earnings = (startBalance + user.outputs.contributions) * this.toPercentage(user.inputs.earningsRate);
    return user.outputs.earnings;
  }

  getFees(year: number, user: User) {
    let startBalance = this.getStartBalance(year, user);
    user.outputs.fees = (startBalance + user.outputs.contributions + user.outputs.earnings) * this.toPercentage(user.inputs.feesRate);
    return user.outputs.fees;
  }

  getTax(user: User) {
    user.outputs.tax = (user.outputs.contributions + user.outputs.earnings) * this.toPercentage(user.inputs.taxRate);
    return user.outputs.tax;
  }

  getWithdrawals(year: number, user: User) {
    let startBalance = this.getStartBalance(year, user);
    user.outputs.withdrawals = year <= 21 ? 0 : startBalance * this.toPercentage(user.inputs.withdrawalRate);
    return user.outputs.withdrawals;
  }

  getEndBalance(year: number, user: User) {
    let startBalance = this.getStartBalance(year, user);
    user.outputs.endBalance = startBalance + user.outputs.contributions + user.outputs.earnings - user.outputs.fees - user.outputs.tax - user.outputs.withdrawals;
    user.outputs.startBalance = user.outputs.endBalance;
    return user.outputs.endBalance;
  }

  private toPercentage(rate: number) {
    return rate / this.RATE_PERCENTAGE;
  }

  private getStartBalance(year: number, user: User) {
    return year == 1 ? user.precondictions.startBalance : user.outputs.startBalance;
  }

  private calCulate(details: CalculatorFormDetails) {
    let startAge = details.precondictions.ageOfFirstYear;
    let endAge = details.precondictions.lastYear - details.precondictions.firstYear + details.precondictions.ageOfFirstYear;
    for(var index = startAge; index <= endAge; index++) {
      let year = index - 44;
      this.getStartBalance(year, this.user);
      this.getContributions(year, this.user);
      this.getEarnings(year, this.user);
      this.getFees(year, this.user);
      this.getTax(this.user);
      this.getWithdrawals(year, this.user);
      this.getEndBalance(year, this.user);
      this.balance.push(Math.round(this.user.outputs.startBalance));
      this.years.push((details.precondictions.firstYear + year - 1).toString());
    }
  }
}

