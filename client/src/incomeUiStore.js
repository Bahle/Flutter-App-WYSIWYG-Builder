import { action, observable } from "mobx"

class IncomeUiStore {
  @observable shouldShowCalculations

  @action showCalculation () {
    this.shouldShowCalculations = true
  }
}

export default IncomeUiStore