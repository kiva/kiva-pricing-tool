// @flow
import React, { Component } from 'react'
import { Dropdown, Button, TextField } from './'
import { Grid, PageHeader, Row, Col } from 'react-bootstrap'
import './../styles/app.scss'
import { Api } from '../utils'

class APRInputs extends Component {
  constructor(props) {
    super(props)
    const { formDataReducer } = this.props
    this.state = {
      aprRate: '',
      saveData: {},
      back: formDataReducer.back
    }
  }

  componentDidMount() {
    const { changedFormData } = this.props
    changedFormData('error', false)
  }

  handleTextChange = (name, value) => {
    const { changedFormData } = this.props
    changedFormData([name], value)
  }

  /**
   * Checks whether proper inputs have been entered.
   */
  inputsEntered() {
    const { formDataReducer } = this.props
    return (
      !this.isNullOrEmpty(formDataReducer.mfi) &&
      !this.isNullOrEmpty(formDataReducer.loanType) &&
      !this.isNullOrEmpty(formDataReducer.productType) &&
      !this.isNullOrEmpty(formDataReducer.versionNum) &&
      !this.isNullOrEmpty(formDataReducer.startName) && // required
      !this.isNullOrEmpty(formDataReducer.installmentTimePeriod) && // required
      !this.isNullOrEmpty(formDataReducer.repaymentType) && // required
      !this.isNullOrEmpty(formDataReducer.interestTimePeriod) && // required
      !this.isNullOrEmpty(formDataReducer.interestPaymentType) && // required
      !this.isNullOrEmpty(formDataReducer.interestCalculationType) && //
      !this.isNullOrEmpty(formDataReducer.loanAmount) && // required
      !this.isNullOrEmpty(formDataReducer.installment) && // required
      !this.isNullOrEmpty(formDataReducer.nominalInterestRate) // required
    )
  }

  isNullOrEmpty(input) {
    return !input || input.length === 0
  }

  zeroOrInput(input) {
    if (!input) {
      return 0
    } else {
      return input
    }
  }

  /**
   * Sends inputs to backend to calculate initial APR rate and repayment
   * schedule.
   */
  postData() {
    const { formDataReducer, changedFormData } = this.props
    this.inputsEntered() &&
      Api.calAPR(formDataReducer).then(r => {
        changedFormData('nominalApr', r.apr)
        const matrix = r.matrix
        let reformatted_matrix = []
        let user_matrix = []
        let calc_matrix = []
        if (matrix != null) {
          for (let i = 0; i < matrix[0].length; i++) {
            reformatted_matrix.push({
              period_num: matrix[0][i],
              payment_due_date: matrix[1][i],
              days: matrix[2][i],
              amount_due: matrix[3][i],
              principal_payment: matrix[4][i],
              balance: matrix[5][i],
              interest: matrix[6][i],
              fees: matrix[7][i],
              insurance: matrix[8][i],
              taxes: matrix[9][i],
              security_deposit: matrix[10][i],
              security_interest_paid: matrix[11][i],
              deposit_withdrawal: matrix[12][i],
              deposit_balance: matrix[13][i],
              total_cashflow: matrix[14][i]
            })
            user_matrix.push({
              period_num: null,
              payment_due_date: null,
              days: null,
              amount_due: null,
              principal_payment: null,
              balance: null,
              interest: null,
              fees: null,
              insurance: null,
              taxes: null,
              security_deposit: null,
              security_interest_paid: null,
              deposit_withdrawal: null,
              deposit_balance: null,
              total_cashflow: null
            })
            calc_matrix.push({
              period_num: matrix[0][i],
              payment_due_date: matrix[1][i],
              days: matrix[2][i],
              amount_due: matrix[3][i],
              principal_payment: matrix[4][i],
              balance: matrix[5][i],
              interest: matrix[6][i],
              fees: matrix[7][i],
              insurance: matrix[8][i],
              taxes: matrix[9][i],
              security_deposit: matrix[10][i],
              security_interest_paid: matrix[11][i],
              deposit_withdrawal: matrix[12][i],
              deposit_balance: matrix[13][i],
              total_cashflow: matrix[14][i]
            })
          }
          reformatted_matrix.push({
            period_num: null,
            payment_due_date: null,
            days: null,
            amount_due: null,
            principal_payment: null,
            balance: null,
            interest: null,
            fees: null,
            insurance: null,
            taxes: null,
            security_deposit: null,
            security_interest_paid: null,
            deposit_withdrawal: null,
            deposit_balance: null,
            total_cashflow: null
          })
          user_matrix.push({
            period_num: null,
            payment_due_date: null,
            days: null,
            amount_due: null,
            principal_payment: null,
            balance: null,
            interest: null,
            fees: null,
            insurance: null,
            taxes: null,
            security_deposit: null,
            security_interest_paid: null,
            deposit_withdrawal: null,
            deposit_balance: null,
            total_cashflow: null
          })
          calc_matrix.push({
            period_num: 'Total',
            payment_due_date: ' ',
            days: 0,
            amount_due: 0,
            principal_payment: 0,
            balance: ' ',
            interest: 0,
            fees: 0,
            insurance: 0,
            taxes: 0,
            security_deposit: 0,
            security_interest_paid: 0,
            deposit_withdrawal: 0,
            deposit_balance: ' ',
            total_cashflow: 0
          })
          let last = calc_matrix.length - 1
          for (let i = 0; i < last; i++) {
            calc_matrix[last]['days'] += calc_matrix[i]['days']
            calc_matrix[last]['amount_due'] += calc_matrix[i]['amount_due']
            calc_matrix[last]['principal_payment'] +=
              calc_matrix[i]['principal_payment']
            calc_matrix[last]['interest'] += calc_matrix[i]['interest']
            calc_matrix[last]['fees'] += calc_matrix[i]['fees']
            calc_matrix[last]['insurance'] += calc_matrix[i]['insurance']
            calc_matrix[last]['taxes'] += calc_matrix[i]['taxes']
            calc_matrix[last]['security_deposit'] +=
              calc_matrix[i]['security_deposit']
            calc_matrix[last]['security_interest_paid'] +=
              calc_matrix[i]['security_interest_paid']
            calc_matrix[last]['deposit_withdrawal'] +=
              calc_matrix[i]['deposit_withdrawal']
            calc_matrix[last]['total_cashflow'] +=
              calc_matrix[i]['total_cashflow']
          }
          calc_matrix[last]['principal_payment'] = calc_matrix[last][
            'principal_payment'
          ].toFixed(2)
          calc_matrix[last]['interest'] = calc_matrix[last]['interest'].toFixed(
            2
          )
          calc_matrix[last]['fees'] = calc_matrix[last]['fees'].toFixed(2)
          calc_matrix[last]['insurance'] = calc_matrix[last][
            'insurance'
          ].toFixed(2)
          calc_matrix[last]['taxes'] = calc_matrix[last]['taxes'].toFixed(2)
          calc_matrix[last]['security_deposit'] = calc_matrix[last][
            'security_deposit'
          ].toFixed(2)
          calc_matrix[last]['security_interest_paid'] = calc_matrix[last][
            'security_interest_paid'
          ].toFixed(2)
          calc_matrix[last]['deposit_withdrawal'] = calc_matrix[last][
            'deposit_withdrawal'
          ].toFixed(2)
          calc_matrix[last]['total_cashflow'] = calc_matrix[last][
            'total_cashflow'
          ].toFixed(2)
        }
        reformatted_matrix[0]['period_num'] = 'Disbursement'
        calc_matrix[0]['period_num'] = 'Disbursement'
        changedFormData('original_repayment_schedule', reformatted_matrix)
        changedFormData('user_repayment_schedule', user_matrix)
        changedFormData('calc_repayment_schedule', calc_matrix)
        changedFormData('new_repayment_schedule', matrix)
        changedFormData('back', 'form1')
      })
  }

  render() {
    const { formDataReducer } = this.props
    return (
      <div className="page-body-grey padded-element-vertical overpad-shrink">
        <Grid
          fluid
          className="screen-horizontal-centered screen-vertical-centered-grid padded-element-all round-corners-large solid-background"
        >
          <Row>
            <Col sm={12} md={12} className="bs-center">
              <PageHeader className="page-header-montserrat bs-center">
                <small>
                  {formDataReducer.mfi} | {formDataReducer.loanType} |{' '}
                  {formDataReducer.productType} | Version{' '}
                  {formDataReducer.versionNum}
                </small>
              </PageHeader>
            </Col>
          </Row>
          <Row>
            <Row>
              <Col sm={12} md={12}>
                <PageHeader>Reporter Information</PageHeader>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12}>
                <TextField
                  className="inline-textfield"
                  id="Full Name"
                  reduxId="startName"
                  hint="ex. John"
                  typeVal="String"
                  limit="100"
                  requiredField={true}
                  // textBody={formDataReducer.startName}
                  onTextInputChange={this.handleTextChange}
                  //doesn't allow spaces ** need to fix
                />
              </Col>
            </Row>
          </Row>

          <Row>
            <Row>
              <Col sm={12} md={12}>
                <PageHeader>Basic Loan Conditions</PageHeader>
              </Col>
            </Row>
            <Row>
              <Col sm={4} md={4} className="bs-center">
                <Dropdown
                  title="Repayment Type"
                  reduxId="repaymentType"
                  requiredField={true}
                  items={[
                    //must match backend! IMPORTANT
                    { id: '1', value: 'equal principal payments' },
                    { id: '2', value: 'equal installments (amortized)' },
                    { id: '3', value: 'single end-term principal payment' }
                  ]}
                />
              </Col>
              <Col sm={4} md={4} className="bs-center">
                <Dropdown
                  title="Interest Payment"
                  reduxId="interestPaymentType"
                  requiredField={true}
                  items={[
                    { id: '1', value: 'Multiple Installments' },
                    { id: '2', value: 'Single End-Term Payments' }
                  ]}
                />
              </Col>
              <Col sm={4} md={4} className="bs-center">
                <Dropdown
                  title="Interest Calculation"
                  reduxId="interestCalculationType"
                  requiredField={true}
                  items={[
                    { id: '1', value: 'initial amount or flat' },
                    { id: '2', value: 'declining balance' }
                  ]}
                />
              </Col>
            </Row>
            <Row className="vertical-margin-item flex-align-center">
              <Col sm={4} md={4}>
                <TextField
                  id="Loan Amount"
                  reduxId="loanAmount"
                  hint="ex. 5000"
                  typeVal="float"
                  limit="900000000"
                  requiredField={true}
                  // textBody={formDataReducer.loanAmount}
                  className=""
                />
              </Col>
              <Col sm={2} md={2} className="bs-center">
                <div>
                  <p className="vertical-margin-item">Paid Over: </p>
                </div>
              </Col>
              <Col sm={4} md={4}>
                <TextField
                  id="Number of Installments"
                  reduxId="installment"
                  hint="ex. 12"
                  typeVal="int"
                  limit="180"
                  requiredField={true}
                  // textBody={formDataReducer.installment}
                  className=""
                />
              </Col>
              <Col sm={2} md={2} className="bs-center">
                <Dropdown
                  title="Time Period"
                  requiredField={true}
                  reduxId="installmentTimePeriod"
                  items={[
                    { id: '1', value: 'days' },
                    { id: '7', value: 'weeks' },
                    { id: '14', value: 'two-weeks' },
                    { id: '15', value: '15 days' },
                    { id: '28', value: '4 weeks' },
                    { id: '30', value: 'months' },
                    { id: '90', value: 'quarters' },
                    { id: '180', value: 'half-years' },
                    { id: '365', value: 'years' }
                  ]}
                />
              </Col>
            </Row>
            <Row className="vertical-margin-item flex-align-center">
              <Col sm={6} md={6}>
                <TextField
                  id="Nominal Interest Rate*"
                  reduxId="nominalInterestRate"
                  hint="ex. 12"
                  typeVal="float"
                  limit="100"
                  requiredField={true}
                  // textBody={formDataReducer.nominalInterestRate}
                />
              </Col>
              <Col sm={2} md={2} className="bs-center">
                <div>
                  <p className="vertical-margin-item">Every: </p>
                </div>
              </Col>
              <Col sm={4} md={4}>
                <Dropdown
                  title="Time Period"
                  requiredField={true}
                  reduxId="interestTimePeriod"
                  items={[
                    { id: '0', value: 'day' },
                    { id: '1', value: 'week' },
                    { id: '2', value: 'two-weeks' },
                    { id: '3', value: '15 days' },
                    { id: '4', value: '4 weeks' },
                    { id: '5', value: 'month' },
                    { id: '6', value: 'quarter' },
                    { id: '7', value: 'half-year' },
                    { id: '8', value: 'year' }
                  ]}
                />
              </Col>
            </Row>

            <Row className="vertical-margin-item">
              <Col sm={3} md={3}>
                <TextField
                  id="Grace and Prepay"
                  reduxId="gracePeriodPrincipal"
                  hint="Capital"
                  typeVal="float"
                  limit={formDataReducer.installment - 1}
                  textBody={formDataReducer.gracePeriodPrincipal}
                />
              </Col>
              <Col sm={3} md={3}>
                <TextField
                  className="preserve-id"
                  id=""
                  reduxId="gracePeriodInterestPay"
                  hint="Int Pmt"
                  typeVal="float"
                  limit={formDataReducer.installment - 1}
                  textBody={formDataReducer.gracePeriodInterestPay}
                />
              </Col>
              <Col sm={3} md={3}>
                <TextField
                  className="preserve-id"
                  id=""
                  reduxId="gracePeriodInterestCalculate"
                  hint="Int Calc"
                  typeVal="float"
                  limit={formDataReducer.installment - 1}
                  textBody={formDataReducer.gracePeriodInterestCalculate}
                />
              </Col>
              <Col sm={3} md={3}>
                <TextField
                  className="preserve-id"
                  id=""
                  reduxId="gracePeriodBalloon"
                  hint="Balloon"
                  typeVal="float"
                  limit={formDataReducer.installment - 1}
                  textBody={formDataReducer.gracePeriodBalloon}
                />
              </Col>
            </Row>
          </Row>
          <Row>
            <Row>
              <Col sm={12} md={12}>
                <PageHeader>Fees</PageHeader>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield"
                  id="Fee%"
                  reduxId="feePercentUpfront"
                  hint="Upfront"
                  typeVal="float"
                  limit="180"
                  textBody={formDataReducer.feePercentUpfront}
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="feePercentOngoing"
                  hint="Ongoing"
                  typeVal="float"
                  limit="180"
                  textBody={formDataReducer.feePercentOngoing}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield"
                  id="Fee (fixed amt)"
                  reduxId="feeFixedUpfront"
                  hint="Upfront"
                  typeVal="float"
                  limit="100000000"
                  textBody={formDataReducer.feeFixedUpfront}
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="feeFixedOngoing"
                  hint="Ongoing"
                  typeVal="float"
                  limit="100000000"
                  textBody={formDataReducer.feeFixedOngoing}
                />
              </Col>
            </Row>
          </Row>
          <Row>
            <Row>
              <Col sm={12} md={12}>
                <PageHeader>Taxes</PageHeader>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield placeholder-textfield"
                  id="On Fees"
                  hint="PLACEHOLDER"
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  hint="Ongoing %"
                  reduxId="taxPercentFees"
                  typeVal="float"
                  limit="100"
                  textBody={formDataReducer.taxPercentFees}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield placeholder-textfield"
                  id="On Interest"
                  hint="PLACEHOLDER"
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  hint="Ongoing %"
                  reduxId="taxPercentInterest"
                  typeVal="float"
                  limit="100"
                  textBody={formDataReducer.taxPercentInterest}
                />
              </Col>
            </Row>
          </Row>

          <Row>
            <Row>
              <Col sm={12} md={12}>
                <PageHeader>Insurance</PageHeader>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield"
                  id="Insurance %"
                  reduxId="insurancePercentUpfront"
                  hint="Upfront"
                  typeVal="float"
                  limit="100"
                  textBody={formDataReducer.insurancePercentUpfront}
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="insurancePercentOngoing"
                  hint="Ongoing"
                  typeVal="float"
                  limit="100"
                  textBody={formDataReducer.insurancePercentOngoing}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield"
                  id="Insurance (fixed amt)"
                  reduxId="insuranceFixedUpfront"
                  hint="Upfront"
                  typeVal="float"
                  limit="900000000"
                  textBody={formDataReducer.insuranceFixedUpfront}
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="insuranceFixedOngoing"
                  hint="Ongoing"
                  typeVal="float"
                  limit="900000000"
                  textBody={formDataReducer.insuranceFixedOngoing}
                />
              </Col>
            </Row>
          </Row>

          <Row>
            <Row>
              <Col sm={12} md={12}>
                <PageHeader>Security Deposit</PageHeader>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield"
                  id="Security Deposit %"
                  reduxId="securityDepositPercentUpfront"
                  hint="Upfront"
                  typeVal="float"
                  limit="100"
                  textBody={formDataReducer.securityDepositPercentUpfront}
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="securityDepositPercentOngoing"
                  hint="Ongoing"
                  typeVal="float"
                  limit="100"
                  textBody={formDataReducer.securityDepositPercentOngoing}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield"
                  id="Security Deposit (fixed amt)"
                  reduxId="securityDepositFixedUpfront"
                  hint="Upfront"
                  typeVal="float"
                  limit="900000000"
                  textBody={formDataReducer.securityDepositFixedUpfront}
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="securityDepositFixedOngoing"
                  hint="Ongoing"
                  typeVal="float"
                  limit="900000000"
                  textBody={formDataReducer.securityDepositFixedOngoing}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield placeholder-textfield"
                  // reduxId="interestPaidOnDepositPercent"
                  id="Interest Paid on Deposit"
                  hint="PLACEHOLDER"
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="interestPaidOnDepositPercent"
                  hint="Ongoing %"
                  typeVal="float"
                  limit="900000000"
                  textBody={formDataReducer.interestPaidOnDepositPercent}
                />
              </Col>
            </Row>
          </Row>

          <Row className="vertical-margin-item">
            <Col xs={6} sm={6} md={6}>
              <Button
                className="button-fancy"
                name="Back"
                url={this.state.back}
              />
            </Col>
            <Col xs={6} sm={6} md={6} className="bs-button-right">
              <Button
                className="button-fancy"
                name="Next"
                disable={!this.inputsEntered()}
                url={'output'}
                onClickHandler={e => {
                  this.postData()
                }}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default APRInputs
