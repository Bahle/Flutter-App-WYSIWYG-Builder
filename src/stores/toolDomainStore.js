import { action, computed, observable } from "mobx"

class ToolDomainStore {
	@observable text = 0

	@action setText (input) {
		this.text = input
	}

	/*@computed get calculatedTaxPercentage () {
		return this.incomeBeforeTax < 20000 ? 10 : 20
	}

	@computed get calculatedIncomeAfterTax () {
		if (this.incomeBeforeTax < 20000) {
		  return this.incomeBeforeTax * 0.9
		}
		
		return this.incomeBeforeTax * 0.8
	}*/
}

export default ToolDomainStore