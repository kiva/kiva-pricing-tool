import React, { Component } from 'react'
import { Grid, PageHeader, Form, Row, Col } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Api, Variables } from './../utils'
import './../styles/app.css'
import { TextField, Button } from './'
import './../styles/button.css'
import axios from 'axios'
import PropTypes from 'prop-types'

class NewLoan extends Component {
  constructor(props) {
    super(props)
    const { formDataReducer } = this.props
    this.state = {
      partner_names: [],
      loan_themes: [],
      selectedPartnerName: formDataReducer.mfi,
      selectedLoanTheme: formDataReducer.loanType,
      selectedLoanProduct: formDataReducer.productType,

      // Error class handling for typeahead
      partnerClass: 'vertical-margin-item',
      loanClass: 'vertical-margin-item',

      // Error message class handling
      partnerErrorClass: 'typeahead-message-hidden',
      loanErrorClass: 'typeahead-message-hidden'
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { changedFormData } = this.props
    changedFormData('back', 'newloan')
    changedFormData('error', false)

    axios.get(Variables.flaskURL + 'partnerThemeLists').then(response => {
      console.log(response.data.result)
      this.setState({
        partner_names: response.data.result.partners.sort(),
        loan_themes: response.data.result.themes.sort()
      })
    })
  }

  inputsEntered() {
    const { formDataReducer } = this.props
    return (
      this.isValidMFI(formDataReducer.mfi) &&
      this.isValidTheme(formDataReducer.loanType) &&
      !this.isValidPT(formDataReducer.productType) &&
      !formDataReducer.error // no error
    )
  }

  // Method to check if MFI partner exists in queried partner list
  // Entry is valid if DB has corresponding name
  isValidMFI(input) {
    return this.state.partner_names.indexOf(input) !== -1
  }

  // Method to check if LT exists in queried LT list
  // Entry is valid if DB has corresponding name
  isValidTheme(input) {
    return this.state.loan_themes.indexOf(input) !== -1
  }

  isValidPT(input) {
    return !input || !input.length
  }

  render() {
    const { formDataReducer, changedFormData } = this.props
    return (
      <div className="page-body-grey">
        <Grid
          fluid
          className="query-form-center padded-element-shrink round-corners-large solid-background"
        >
          <Row>
            <Col sm={12} md={12} className="bs-center">
              <PageHeader className="page-header-montserrat">
                New Loan
              </PageHeader>
            </Col>
          </Row>
          <Row>
            <Form>
              <Typeahead
                className={this.state.partnerClass}
                label="mfi"
                options={this.state.partner_names}
                placeholder="Select Field Partner"
                limit={100}
                selected={
                  formDataReducer.mfi === '' ? [] : [formDataReducer.mfi]
                }
                onInputChange={e => {
                  changedFormData('mfi', e)

                  // Check if entered value is valid and switch classes
                  if (!this.isValidMFI(e)) {
                    this.setState({
                      partnerClass: 'vertical-margin-item typeahead-error',
                      partnerErrorClass: 'typeahead-message-show'
                    })
                  } else if (this.isValidMFI(e)) {
                    this.setState({
                      partnerClass: 'vertical-margin-item',
                      partnerErrorClass: 'typeahead-message-hidden'
                    })
                  }
                }}
              />
              <p className={this.state.partnerErrorClass}>
                Field Partner does not exist.
              </p>

              <Typeahead
                className={this.state.loanClass}
                label="loan"
                options={this.state.loan_themes}
                placeholder="Select Loan Theme"
                selected={
                  formDataReducer.loanType === ''
                    ? []
                    : [formDataReducer.loanType]
                }
                onInputChange={e => {
                  changedFormData('loanType', e)

                  // Check if entered value is valid and switch classes
                  if (!this.isValidTheme(e)) {
                    this.setState({
                      loanClass: 'vertical-margin-item typeahead-error',
                      loanErrorClass: 'typeahead-message-show'
                    })
                  } else if (this.isValidTheme(e)) {
                    this.setState({
                      loanClass: 'vertical-margin-item',
                      loanErrorClass: 'typeahead-message-hidden'
                    })
                  }
                }}
              />
              <p className={this.state.loanErrorClass}>
                Loan Theme does not exist.
              </p>

              <TextField
                className="vertical-margin-item"
                reduxId="productType"
                hint="Loan Product"
                typeVal="String"
                limit={100}
                onInputChange={e => {
                  changedFormData('productType', e)
                }}
                textBody={formDataReducer.productType}
              />
            </Form>

            <Row>
              <Col xs={6} sm={6} md={6} />
              <Col xs={6} sm={6} md={6} className="bs-button-right">
                <Button
                  className="button-fancy"
                  disable={!this.inputsEntered()}
                  name="Continue"
                  url="form1"
                  onClickHandler={() => {
                    Api.getVersionNum(
                      formDataReducer.mfi,
                      formDataReducer.loanType,
                      formDataReducer.productType
                    ).then(response => {
                      changedFormData(
                        'versionNum',
                        response['version'].toString()
                      )
                    })
                  }}
                />
              </Col>
            </Row>
          </Row>
        </Grid>
      </div>
    )
  }
}
export default NewLoan
