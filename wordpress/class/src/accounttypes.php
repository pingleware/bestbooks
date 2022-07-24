<?php

if (class_exists('SplEnum')) {
    class AccountTypes extends SplEnum {
        const __default = self::Unknown;

        const Unknown = "Unknown";
        const Asset = "Asset";
        const Liability = "Liability";
        const OwnersEquity = "OwnersEquity";
        const Revenue = "Revenue";
        const Expense = "Expense";
        const Withdrawals = "Withdrawals";
        const Journal = "Journal";
        const Bank = "Bank";
        const Cash = "Cash";
        const Credit = "Credit";
        const Investment = "Investment";

    }
} else {
    class AccountTypes {
        const __default = self::Unknown;

        const Unknown = "Unknown";
        const Asset = "Asset";
        const Liability = "Liability";
        const OwnersEquity = "OwnersEquity";
        const Revenue = "Revenue";
        const Expense = "Expense";
        const Withdrawals = "Withdrawals";
        const Journal = "Journal";
        const Bank = "Bank";
        const Cash = "Cash";
        const Credit = "Credit";
        const Investment = "Investment";

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