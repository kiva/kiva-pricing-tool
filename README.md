# Kiva Pricing Tool
An open source web application that calculates an APR Nominal rate for a loan with different attributes, then displays the Repayment Schedule and Loan Payment Visualization.

[How to Setup App Locally](/docs/setup.md) <br>
[Integrating App With Heroku](/docs/heroku.md)

## Product Resources
* [Product Requirements Document](https://docs.google.com/document/d/1Rw6Q8YMIpvYFXR3eStdTVT4iZXMpR7En3_yg677VgjE/edit?usp=sharing)
* [Specs](https://docs.google.com/document/d/1zMf_uEDGpe6eoqfaJvVP6mnb-Vbvo_sfcE4FaL2NWB8/edit?usp=sharing)

## Design Resources
* [Figma for Mockups](https://www.figma.com/file/0jmf44vrazZ8C2vkTCwnroMF/Kiva)

## Backend Resources
* [Database Schema](/docs/api_docs.md)
* [Repo with XIRR function that we used for our calculations](https://github.com/peliot/XIRR-and-XNPV)

## Excel Tool Calculation Differences
Our calculator functions differently, and more accurately, than the original excel tool that we based our implementation off of.

You can download the original APR tool we based our calculator off of [here](/docs/APR_Excel_Tool.xlsm). The functionality our tool replicates is all under the "Pricing - Advanced" and "Rep Schedule - Advanced" sheets. We use the exact same inputs, but a few of our calculations are different. They are as following.

* Repayment Schedule Editing
    * On the excel sheet, a user must enter manual mode and make changes on parallel columns
    * Our implementation allows a user to edit the table directly, which changes indicated by highlights

* Period 0
    * On the excel sheet, the initial period is labeled period 0
    * Our implementation instead labels the initial period "Disbursement Date"

* Security Deposit Interest Paid
    * On the excel sheet, if a balloon payment exists, the security deposit continues to accumulate interest, even though the loan has been paid off
    * Our calculations prevent interest from accumulating on the security deposit once the entire loan has been paid off

* Security Deposit Override
    * On the excel sheet, overriding the security deposit overrides both the security deposit and interest paid for that period
    * Our calculations will only override the security deposit column, and not affect the interest paid column

* Security Deposit Withdrawals
    * On the excel sheet, security deposit withdrawals are allocated to the last cashflow, even if a balloon payment occurs
    * Our calculations will lump the security deposit withdrawal with the final payment if a balloon payment occurs

* Cash Flows
    * On the excel sheet, there are cashflow indicators after each expense (interest, fees, taxes, security deposit)
    * Our implementation instead displays the overall final cash flows in each period once

## Our Workarounds
Over the course of the 3 months we had to build out this tool, we accumulated some technical debt which, with some additional resources and time, can be re-implemented with better practices.

* Admin Tools
    * Field Partners and Loan Themes are never deleted from the database, only marked "active" or "inactive"
    * This way we can still query the database for previously entered loans even if the Field Partners or Loan Themes are no longer active
    * Editing a Field Partner and changing its name to another Field Partner is not allowed and will be rejected. I.e. having Microsoft and Google as Field Partners, then editing Microsoft and changing it to Google as well.
    * However, the frontend will still display that there are two Google's. Refreshing the page will pull the correct info from the database and display Microsoft and Google.

* Save Loan Endpoint
    * Our endpoint for saving a loan is the same regardless of whether or not we are editing an existing loan or creating a new one
    * We query the database with the identification parameters, then delete any existing loan with the same data and post the current loan into the database
    * This way we are effectively "editing" a loan, and if no existing loan is found, we can save a new loan to the database with one endpoint

* Input Page
    * If any of the inputs are not valid, you will not be able to progress onto the output page. You are still able to click "Next", but nothing would happen. Should grey out buttons and not allow any clicking.
    * In order to align the textfields in the Input Page, we created hidden textfields to better realign/format the page

* Loan Repayment Visualization
    * In order to load the chart, a user has to hit "Generate Chart"
    * We put the button there because the data need to populate the chart doesn't load instantly when we render the page, so no chart data would be displayed otherwise

* User Information - Name
    * This is placed in the input form page
    * A better UX would be to place that at the beginning of both the New Loan and the Find Loan sequences, so that the backend can more easily differentiate an initial user and a user who is updating the loan. The UX would also be more straightforward.

* URL's
    * All our URL's are accessible, even if no prior data has been entered
    * Refreshing the page empties whatever is currently in our redux store, leaving some pages useless if refreshed
    * Some sort of validation/error page would be good
