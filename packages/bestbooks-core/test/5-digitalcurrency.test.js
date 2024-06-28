var ChartOfAccounts = require("../chartOfAccounts");
var AccountTypes = require("../accountTypes");
var Bitcoin = require("../bitcoin");
var Ether = require("../ether");

describe("testing digitial currency assets",function(){
    it("create new account for bitcoin",async function(){
        var coa = new ChartOfAccounts();
        await coa.add("Bitcoin",AccountTypes.DigitalCurrency,1);
    })
    it("create new account for ether",async function(){
        var coa = new ChartOfAccounts();
        await coa.add("Ethereum",AccountTypes.DigitalCurrency,1);
    })
    it("create an account for multiple ethereum wallets",async function(){
        var coa = new ChartOfAccounts();
        // Add the wallet address with the currency type
        await coa.add("Ethereum 0x50542cF0903152E1761cffF01d2928C6F229D678",AccountTypes.DigitalCurrency,1);
    })
    it("make a deposit to bitcoin",async function(){
        try {
            var bitcoin = new Bitcoin("1FjvkiYbcFiNJdM57z7Bj8LJcKRCjUqrM9") // Bitcoin Wallet Address with CashApp for the framework creator
            await bitcoin.addDebit("2021-10-24 18:24","CashApp Bitcoin Boost paid to 1FjvkiYbcFiNJdM57z7Bj8LJcKRCjUqrM9",1.15,1,1);
            await bitcoin.addDebit("2021-10-26 22:46","CashApp Bitcoin Boost paid to 1FjvkiYbcFiNJdM57z7Bj8LJcKRCjUqrM9",0.53,1,1);    
        } catch(error) {
            console.error(error)
        }
    })
    it("make a deposit to ether",async function(){
        var ethereum = new Ether("0x50542cF0903152E1761cffF01d2928C6F229D678"); // Ethereum wallet for the framework creator
        await ethereum.addDebit("2022-11-06 17:04:11","Transfer from Coinbase to 0x50542cF0903152E1761cffF01d2928C6F229D678",2.40)
        // verify on etherscan.io at https://etherscan.io/address/0x50542cF0903152E1761cffF01d2928C6F229D678
    })
})