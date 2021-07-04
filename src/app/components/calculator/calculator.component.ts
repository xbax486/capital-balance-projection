import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../interfaces/user';
import { UserInputs } from './../../interfaces/user.inputs';
import { UserPrecondictions } from './../../interfaces/user.precondictions';
import { CalculationDetails } from './../../interfaces/calculation.details';
import { CalculatorFormDetails } from '../../interfaces/calculator.form.details';
import { DataProcessService } from './../../services/data-process.service';
import { DataFetchService } from "./../../services/data-fetch.service";
import { ToastService } from "./../../services/toast.service";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent implements OnInit{
  public details: CalculationDetails = {
    ages: [],
    startBalance: [],
    contributions: [],
    earnings: [],
    fees: [],
    tax: [],
    withdrawals: [],
    endBalance: []
  };
  public user: User = {
    precondictions: {
      startBalance: 0,
      firstYear: 0,
      lastYear: 0,
      ageOfFirstYear: 0,
      ageOfCurrentYear: 0
    },
    inputs: {
      salary: 0,
      contributionRate: 0,
      inflationRate: 0,
      earningsRate: 0,
      feesRate: 0,
      taxRate: 0,
      withdrawalRate: 0,
      retirementAge: 0
    },
    outputs: {
      startBalance: 0,
      contributions: 0,
      earnings: 0,
      fees: 0,
      tax: 0,
      withdrawals: 0,
      endBalance: 0,
    },
    calculationDetails: this.details
  };
  public balance: number[] = [];
  public years: string[] = [];
  public loadingPrecondictions = true;
  public loadingUserInputs = true;
  public calculationCompleted = false;

  constructor(
    public dataProcessService: DataProcessService, 
    private dataFetchService: DataFetchService, 
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.fetchUserPrecondictions();
    this.fetchUserInputs();
  }

  onSubmit(calculatorForm: NgForm) {
    this.resetAllDataArrays();
    this.calculate(calculatorForm.form.value);
    this.calculationCompleted = true;
  }

  getContributions(year: number, user: User) {
    user.outputs.contributions = user.precondictions.ageOfCurrentYear >= user.inputs.retirementAge ? 
      0 : user.inputs.salary * this.dataProcessService.toPercentage(user.inputs.contributionRate) * Math.pow(1 + this.dataProcessService.toPercentage(user.inputs.inflationRate), year - 1);
    return user.outputs.contributions;
  }

  getEarnings(year: number, user: User) {
    let startBalance = this.getStartBalance(year, user);
    user.outputs.earnings = (startBalance + user.outputs.contributions) * this.dataProcessService.toPercentage(user.inputs.earningsRate);
    return user.outputs.earnings;
  }

  getFees(year: number, user: User) {
    let startBalance = this.getStartBalance(year, user);
    user.outputs.fees = (startBalance + user.outputs.contributions + user.outputs.earnings) * this.dataProcessService.toPercentage(user.inputs.feesRate);
    return user.outputs.fees;
  }

  getTax(user: User) {
    user.outputs.tax = (user.outputs.contributions + user.outputs.earnings) * this.dataProcessService.toPercentage(user.inputs.taxRate);
    return user.outputs.tax;
  }

  getWithdrawals(year: number, user: User) {
    let startBalance = this.getStartBalance(year, user);
    user.outputs.withdrawals = this.user.precondictions.ageOfCurrentYear < this.user.inputs.retirementAge ? 
      0 : startBalance * this.dataProcessService.toPercentage(user.inputs.withdrawalRate);
    return user.outputs.withdrawals;
  }

  getEndBalance(year: number, user: User) {
    let startBalance = this.getStartBalance(year, user);
    user.outputs.endBalance = startBalance + user.outputs.contributions + user.outputs.earnings - user.outputs.fees - user.outputs.tax - user.outputs.withdrawals;
    user.outputs.startBalance = user.outputs.endBalance;
    return user.outputs.endBalance;
  }

  private getStartBalance(year: number, user: User) {
    return year == 1 ? user.precondictions.startBalance : user.outputs.startBalance;
  }

  private calculate(details: CalculatorFormDetails) {
    let startAge = details.precondictions.ageOfFirstYear;
    let endAge = details.precondictions.lastYear - details.precondictions.firstYear + details.precondictions.ageOfFirstYear;
    let currentStartBalance = 0;
    for(var index = startAge; index <= endAge; index++) {
      let year = index - startAge + 1;
      this.user.precondictions.ageOfCurrentYear = index;
      this.user.calculationDetails.ages.push(index);
      currentStartBalance = this.getStartBalance(year, this.user);
      this.balance.push(Math.round(currentStartBalance));
      this.years.push((details.precondictions.firstYear + year - 1).toString());
      this.user.calculationDetails.startBalance.push(Math.round(currentStartBalance));
      this.user.calculationDetails.contributions.push(Math.round(this.getContributions(year, this.user)));
      this.user.calculationDetails.earnings.push(Math.round(this.getEarnings(year, this.user)));
      this.user.calculationDetails.fees.push(Math.round(this.getFees(year, this.user)));
      this.user.calculationDetails.tax.push(Math.round(this.getTax(this.user)));
      this.user.calculationDetails.withdrawals.push(Math.round(this.getWithdrawals(year, this.user)));
      this.user.calculationDetails.endBalance.push(Math.round(this.getEndBalance(year, this.user)));
    }
  }

  private resetAllDataArrays() {
    this.balance = [];
    this.years = [];
    this.user.calculationDetails.ages = [];
    this.user.calculationDetails.startBalance = [];
    this.user.calculationDetails.contributions = [];
    this.user.calculationDetails.earnings = [];
    this.user.calculationDetails.fees = [];
    this.user.calculationDetails.tax = [];
    this.user.calculationDetails.withdrawals = [];
    this.user.calculationDetails.endBalance = [];
  }

  private fetchUserPrecondictions() {
    this.dataFetchService.userPrecondictions$.subscribe(
      (userPrecondictions: UserPrecondictions) => {
        this.loadingPrecondictions = false;
        this.user.precondictions = userPrecondictions;
      },
      (error) =>{
        this.toastService.onErrorCall('Fail to fetch precondictions. Please contact administrator.')
      }
    );
  }

  private fetchUserInputs() {
    this.dataFetchService.userInputs$.subscribe(
      (userInputs: UserInputs) => {
        this.loadingUserInputs = false;
        this.user.inputs = userInputs;
      },
      (error) =>{
        this.toastService.onErrorCall('Fail to fetch user inputs. Please contact administrator.')
      }
    );
  }
}

