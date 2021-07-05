# CapitalBalanceProjection

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.1.

## Development server

Run `cd capital-balance-projection` to get into the folder 'CapitalBalanceProjection/capital-balance-projection' where the package.json is located. Run `ng install` to install all packages required. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Project structure

This project is created via the Angular CLI commands and the most important parts are the three major components. The first one is the **CalculatorComponent** where the algorithm details are kept. The second one is the **LineChartComponent** which is to draw the line chart using ChartJS. The final one is the **DetailsTableComponent** that is to create the table to show all the details during calculation.

In addition, there are some other parts that are involved as well. For example, the **LoadingSpinnerComponent** is to create a loading spinner which is shown when the data for calculations are still loading. Moreover, I have some interfaces for the data types as well as some custom services such as **DataFetchService** and **DataProcessService** for fetching and data formatting, which I will cover more later.

To keep the structure clear, I have three folders under the original app folders, which are "components", "interfaces" and "services". As you could tell from their names, all components are in "components" folder, all interfaces are in "interfaces" folder and all services are in "services" folder.

Last but not least, the **CalculatorComponent** template contains **LineChartComponent** **DetailsTableComponent**, which means **CalculatorComponent** is the parent component of the other two. It simply the data sharing with the help of @Input() decorator. Please feel free to separate them so they are not in a simple parent-child relationship and you might need other helps like @Output() decorator to share data.

## Third party libraries

This simple Angular app consists of other third party libraries, including [Bootstrap](https://getbootstrap.com/) for responsiveness handling and basic styles for form and table, [ChartJS](https://www.chartjs.org/) for line chart creation as well as [Angular 2 Toasty](https://www.npmjs.com/package/ng2-toasty) for show toasty notification based on the fetch result of preconditions and defalut inputs. In addition, there is a library called [rxjs-compat](https://www.npmjs.com/package/rxjs-compat) which is to fix the RxJS compatibility issues with modern Angular such as Angular 6 and higher. Last but not least, there might be a chance to see some strange bugs while using these libraries if you want to build the same thing with the same libraies on your existing Angular app, please make sure that you review the package.json file for each version of the library. There might be a chance when you need to downgrade the version of the library. For example, Angular 12 seems to have some issues trying to work with the latest ChartJS 3.4.1.

Since I use Bootstrap and ChartJs, please also make sure the "node_modules/bootstrap/dist/css/bootstrap.min.css" are in the styles array and the "chart.js" and "rxjs" are in the "allowedCommonJsDependencies" array. Please notice that you might run into some strange issues if you do not have these configurations and use the following code block as an example.

    "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/capital-balance-projection",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": [
              "node_modules/bootstrap/dist/css/bootstrap.min.css",
              "node_modules/ng2-toasty/bundles/style-bootstrap.css",
              "src/styles.css"
            ],
            "scripts": [],
            "allowedCommonJsDependencies": ["chart.js", "rxjs"]
          },
        },
        ...
      }

## Components

To follow the single responsibility principle, each component only has one role. To be more specific, the **CalculatorComponent** is for capital balance calculation only while the **LineChartComponent** is only for creating a line chart with the data passed from CalculatorComponent. Lastly, the **DetailsTableComponent** is only for showing a table with the calculation details from CalculatorComponent. Let's dive into the details of each component.

### CalculatorComponent

This is the most essential component because it is a smart component, which means it fetch data from the outside and process the data it receives. I assume the data is fetched via API because I do not want to keep any data inside this component. With different data, the component could give me different calculation results.

#### Define user property

To complete the calculation, we need four parts, which are preconditions, default inputs, outputs and details. The uses of these four are listed below:

1. Preconditions: the basic details of the user, including
   1. Start balance of the first year, for example $300,000.
   2. The age of the user in the first year of calculation, for example 45.
   3. The first year when the calculation starts, for example 2020.
   4. The first year when the calculation ends, for example 2070.
2. Default inputs: inputs of other details of the user, including
   1. Salary, for example $100,000.
   2. Contribution Rate, for example 9.5%.
   3. Inflation Rate, for example 3%.
   4. Earnings Rate, for example 7.5%.
   5. Fees Rate, for example 2%.
   6. Tax Rate, for example 15%.
   7. Withdrawal Rate, for example 5%.
3. Outputs: calculation outputs of the current year. For example, in the first year, it includes
   1. Start balance of the current year after calculation, for example $300,000.
   2. Contributions of the current year after calculation, for example $9,500.
   3. Earnings of the current year after calculation, for example $23,213.
   4. Fees of the current year after calculation, for example $4,991.
   5. Tax of the current year after calculation, for example $4,907.
   6. Withdrawals of the current year after calculation, for example 0.
   7. End balance of the current year after calculation, for example $322,815.
4. Calculation details: calculation outputs of the all years. For example, including
   1. Start balance of the all years after calculation, which is an array of number.
   2. Contributions of the all years after calculation, which is an array of number.
   3. Earnings of the all years after calculation, which is an array of number.
   4. Fees of the all years after calculation, which is an array of number.
   5. Tax of the all years after calculation, which is an array of number.
   6. Withdrawals of the all years after calculation, which is an array of number.
   7. End balance of the all years after calculation, which is an array of number.

To keep all of these, I have a property called **user** with these four attributes inside. In addition, each of these four attributes match to an interface. For example, the interface UserPreconditions are for the Preconditions. The main reason why I define an interface for each of these is to keep the **user** property always work with the correct type of attributes. Another reason is to enable intellisense while coding.

#### Fetch preconditions and an default inputs

To fetch preconditions and an default inputs, I use the two functions to fetch them, which are **fetchUserPreconditions()** and **fetchUserInputs()**. These two functions get the data via the subscriptions to the two Observables, which are declared in DataFetchService.

Take the data flow of preconditions as an example. Since **userPreconditions** is a ReplaySubject with size 1, it would always emit one value to its subscribers. Once it does so, the new preconditions would be store inside the **user** property and same rules apply to default inputs, which is done via another ReplaySubject **userInputs**.

#### Work on the calculation

Once we have preconditions and an default inputs, we could start on the calculation. In order to get each output, I have the following functions.

1.  **getContributions()**

    The contribution(C) is the easiest part because it is only based on the start balance(SB) of the current year, the contribution rate(CR)as well as the inflation rate(IR). So the contributions fomula for each year would be something like:

        Year 1: C = SB * CR = SB * CR * (1 + IR)<sup>0</sup>

        Year 2: C = (SB * CR) * (1 + IR) = SB * CR * (1 + IR)<sup>1</sup>

        Year 3: C = ((SB * CR) * (1 + IR)) * (1 + IR) = SB * CR * (1 + IR)<sup>2</sup>

        .
        .
        .

        Year N: C = SB * CR * (1 + IR)<sup>N-1</sup>

        Please notice that we have the retirement age as one of the inputs, so the contribution would be 0 when the year is the one when retirement starts and it would continue to be 0 after that.

2.  **getEarnings()**

    The earnings(E) is based on the current start balance, which is also the end balance of last year, so we need to get it via the **user** output startBalance property. Also, we also need the contributions(C) and the earnings rate(ER) for this. So, the fomula for the current year would be something like:

        E = (SB + C) * ER

3.  **getFees()**

    Similar to earnings(E), the fees(F) is based on the current start balance as well, so we need to get it via the **user** output startBalance property. Also, we also need the contributions(C) and the fees rate(FR) for this. So, the fomula for the current year would be something like:

        F = (SB + C + E) * FR

4.  **getTax()**

    Unlike earnings(E) and fees(F), the tax(T) is based on the the contributions(C), earnings(E) and the tax rate(TR) only. So, the fomula for the current year would be something like:

        T = (C + E) * TR

5.  **getWithdrawals()**

    Similar to earnings(E), the withdrawals(W) is based on the current start balance as well, so we need to get it via the **user** output startBalance property. Also, we also need the withdrawals rate(WR) for this. So, the fomula for the current year would be something like:

        W = SB * WR

        Please notice that we have the retirement age as one of the inputs, so the withdrawals would be 0 when the year is before the one when retirement starts. When the retirement starts, the withdrawals are calculated with the formula above.

6.  **getEndBalance()**

    The end balance(EB) is based on several things including start balance(SB), contributions(C), earnings(E), fees(F), the tax(T) and withdrawals(W). So, the fomula for the current year would be something like:

        EB = SB + C + E - F - T - W

With the help of functions above, we could use a loop(e.g. for loop) to do the calculation for each year and store the data in **user**. The biggest benefits of this approach is to avoid duplicate calculation which has been done before. Since there are several functions depending on the start balance of the current year and it is the end balance of the last year, except for the first year, we could store such value in **user**. If we do this in another way, for example, with recursion, we would end up with slow calculation very quickly since we are foreced to calculate the start balance again and again. Therefore, we should not use recursion, even though the code might look simple.

Finally, when all calculation is done, we will need to send two things, which are start balance array and years array, to the **LineChartComponent** for it to create the line chart. For the **DetailsTableComponent**, we will send the details object, which contains all the calculation details for all years as well as the years so that it could create the table.

Last but not least, I also have a simple function **resetAllDataArrays()**, which is to clear all arrays each time the calculation starts.

### LineChartComponent

This is the pure component, which only receives data from **CalculatorComponent**. Since **CalculatorComponent** also passes **calculationCompleted** which indicate whether the preconditions and default inputs fetching are done, **LineChartComponent** would not show up until the fetching are completed.

The most important function is **drawChart()** which calls the **Chart()** function to create the line chart with passed data. Also, please be aware of the life cycle functions **ngAfterViewInit** and **ngOnChanges**.

The only reason why **drawChart()** is called inside **ngAfterViewInit** is to make sure that every time it creates the chart, it always destroy the old one. If we do not do so, then after you update the inputs and hit the submit button is clicked, a new chart would be created while the old chart exists. Although you might not be able to see it since there is always one chart on the page, you would notice both the chart and the data change when your mouse hover over the points inside the chart. I have tried to use **chart.update()** according to the ChartJS library, but sometimes it still happens. In order to avoid this bug, I have to call the function **drawChart()** to create a chart the first time. Since there is no data passed at the moment, the chart would not appear.

**ngOnChanges** is just to make sure the chart is destroyed and recreated when the data passed from **CalculatorComponent** are updated.

### DetailsTableComponent

This is the pure component, which only receives data from **CalculatorComponent**. Since **CalculatorComponent** also passes **calculationCompleted** which indicate whether the preconditions and default inputs fetching are done, **LineChartComponent** would not show up until the fetching are completed.

## HTML And CSS

To keep things simple, I choose Bootstrap 5 for the markup handling so the entire app is fully responsive. Please try to view it on different sizes of browser. The are only a few custom styles in the css file I need for each component since most of the styles are handled by Boostrap and ChartJS, I create the Angular app with option CSS for styling. If you have a lot of different styles, please feel free to use other CSS preprocessors like SASS or LESS.

## Inputs Form

Again, another reason to use Bootstrap cause it could provide you with a beautiful style for basic form. In terms of input checking, I do have the basic ones with error message showing. So I choose template driven form method because I do not need complex validations. If you think you need some custom validations or async validations, please feel free to use reactive forms method. In addition, I also have an interface **CalculatorFormDetails** related to the form. Please check the **CalculatorComponent** to see how it is used.

## Services

There are three services in the services folder, **DataFetchService** , **DataProcessService** and **ToastService**.

**DataFetchService** is for fetching preconditions as well as default inputs. Sicne most of the time we will call the API to fetch the data and it might take some time for it to complete, I use a timer and only broadcast these data after 3 seconds. To keep things simple, I use built-in function **setTimeout()** instead of creating an Observable. If you are going to work with a real API which will returns an Observable, please feel free to use **HttpClient** and you might need to update the code so that it matches the requirements of reactive programming, which create great user experience.

**DataProcessService** is a service where the data processing functions like formatting and configurations such as the locale and currency are stored. With the help of this service, I could reuse the formatting functions in both **LineChartComponent** and **DetailsTableComponent**.

Finally, **ToastService** is a service where the functions to create toasty notifcations are kept. In my app, I use it to show the result of the fetching of both the preconditions and the default inputs. With the help of these notifications, the user would better understand the current status of the app when the fetching is either successful or not.

## Unit tests

Since time limitation, I only write a few tests in the app, which target the essential functions in **CalculatorFormDetails** and **DataProcessService**. For **LineChartComponent** and **DetailsTableComponent** as well as other parts like the services, please feel free to complete the unit tests.
