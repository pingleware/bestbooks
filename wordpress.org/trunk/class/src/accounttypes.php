<?php
/**
 * The available account types.
 * 
 * @filesource
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc.
 */
if (class_exists('SplEnum')) {
    /**
     * AccountTypes defined when the base class SplENum exists.
     * 
     */
    class AccountTypes extends SplEnum {
        const __default = self::Unknown;

        const Unknown = "Unknown";
        const Asset = "Asset";
        const Liability = "Liability";
        const Equity = "Equity";
        const OwnersEquity = "OwnersEquity";
        const Revenue = "Revenue";
        const Expense = "Expense";
        const NonOperatingIncome = "NonOperatingIncome";
        const InterestDebtExpense = "InterestAndDebtExpense";
        const Withdrawals = "Withdrawals";
        const Journal = "Journal";
        const Bank = "Bank";
        const Cash = "Cash";
        const Credit = "Credit";
        const Investment = "Investment";
        const OtherTaxesOtherThanIncome = "OtherTaxesOtherThanIncome";
        const IncomeTaxExpense = "IncomeTaxExpense";
    }
} else {
    /**
     * AccountTypes class definition when SplEnum DOES NOT exist.
     */
    class AccountTypes {
        /**
         * @property-read __default The default account type setting
         */
        const __default = self::Unknown;
        /**
         * @property-read Unknown When the account type is not defined elsewhere
         */
        const Unknown = "Unknown";
        /**
         * @property-read Asset
         */
        const Asset = "Asset";
        /**
         * @property-read Liability
         */
        const Liability = "Liability";
        /**
         * @property-read OwnersEquity
         */
        const OwnersEquity = "OwnersEquity";
        const Equity = "Equity";
        /**
         * @property-read Revenue
         */
        const Revenue = "Revenue";
        /**
         * @property-read Expense
         */
        const Expense = "Expense";
        const NonOperatingIncome = "NonOperatingIncome";
        const InterestDebtExpense = "InterestAndDebtExpense";
        /**
         * @property-read Withdrawals
         */
        const Withdrawals = "Withdrawals";
        /**
         * @property-read Journal
         */
        const Journal = "Journal";
        /**
         * @property-read Bank
         */
        const Bank = "Bank";
        /**
         * @property-read Cash
         */
        const Cash = "Cash";
        /**
         * @property-read Credit
         */
        const Credit = "Credit";
        /**
         * @property-read Investment
         */
        const Investment = "Investment";
        /**
         * @property-read OtherTaxesOtherThanIncome
         */
        const OtherTaxesOtherThanIncome = "OtherTaxesOtherThanIncome";
        /**
         * @property-read IncomeTaxExpense
         */
        const IncomeTaxExpense = "IncomeTaxExpense";

        /**
         * Retrieves the list of Account Types.
         * 
         * @param boolean $include_default Whether to include default types [default to false]
         * @return mixed[] List of account types
         */
        static public function getConstList($include_default = false) {
            $oClass = new ReflectionClass(__CLASS__);
            if ($include_default) {
                return $oClass->getConstants();
            } else {
                $constants = $oClass->getConstants();
                unset($constants['__default']);
                return $constants;
            }
        }
    }
}

?>