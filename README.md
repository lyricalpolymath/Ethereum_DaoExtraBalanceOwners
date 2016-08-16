# DAO ExtraBalance Owners and Transactions Parser


## MOTIVATION AND HISTORY
this script parses the Ethereum Blockchain and extracts the **Addresses that have rights to the DAO ExtraBalance** because they bought DAO Tokens between May-15-2016 09:00:16 AM UTC and May 28th 9:00 AM UTC, the end of the DAO Token Creation period.

The aim of this script is to extract a **list of Address and their "Extra" ETH Balance** (that they sent after the price increase phase) ** but it can also be useful to understand how a generic Ethereum Blockchain parser can work**

The first date marks the starting of a "Price Increase Phase" in the value of DAO Tokens. 
Before May 15, people bought DAO Token at a rate of 1 ETH = 100 DAO Tokens.
After that the price increased progressively every day.

You can read more about [The DAO Creation Period Price Schedule](https://blog.daohub.org/the-dao-creation-period-price-schedule-4a8bc7a76e04)



graph |  table 
------------ | ------------- 
![Pricing Schedule](https://cdn-images-1.medium.com/max/800/0*vevH7oUG_8KZDrTk.) | ![](https://cdn-images-1.medium.com/max/800/1*PgOcmSra1UjX4Yf9p6m1pw.png)  
 
As of July 21st 2016 (After the DAO Hack & the successfull Ethereum Hard Fork to solve it) 
there is only a [widthdraw contract](https://blog.slock.it/how-to-use-the-withdraw-contract-with-mist-de5d85a981c9#.bjvnkqkt7) for those that bought DAO Tokens at a rate of 1ETH :100 DAOTokens.

A [solution is on the way](http://ethereum.stackexchange.com/questions/7265/how-do-i-get-a-refund-for-the-amount-i-paid-in-excess-of-1-ether-to-100-the-dao), but I thought I'd get the chance to learn a bit about Ethereum and learn how to parse it's blockchain.

The actors
theDAOExtraBalance: https://etherscan.io/address/0x807640a13483f8ac783c557fcdf27be11ea4ac7a 
TheDAO Contract:    https://etherscan.io/address/0xbb9bc244d798123fde783fcc1c72d3bb8c189413
TheDaoCurator: 		https://etherscan.io/address/0xda4a4626d3e16e094de3225a751aab7128e96526 (Holds all the eth after the Hard fork)


## RESULTS AND STATS

The parsing found that there are 10.335 unique addresses that own balance in the extrabalance, 
having bought DAO creation Tokens after the first Price Phase Increase
over 28.843 different transactions  

- 10.355 unique Addresses
- 28843 Transactions directed to the DAO (between the 2 dates)
- a total balance of 17157.23376000618746551331 ETH to be redistributed (but this value needs to be double checked by the actual managers of the ExtraBalance)

you can **see the results in the output folder** but you should definitively run it yourself.


#### WHAT's MISSING / TODO
For now the script only extracts owners of the extrabalance and adds up all the ETH they've payed (after the Price Increase Phase). **The Script doesn't yet tell you the "percentage" of ownership of the ExtraBalance they are entitled to**. 
Fortunately that can be further calculated parsing just the output of their transactions (output-ExtraBalanceOwners+Transactions.txt) and confronting the date with that of the Price Schedule.

- any thoughts? [drop me a line](mailto:b25zero1@gmail.com)


## ABOUT THE SCRIPT
This script parses 78.344 Blocks of the Ethereum Blockchain between
[block 1520861](https://etherscan.io/block/1520861) and [block 1599205](https://etherscan.io/block/1599205) (that's 78.344 blocks)
and stores al Transactions and Addresses between

- the first transaction that payed more than 1 ETH : 100 DAO Token (on May-15-2016 09:00:16 AM UTC) [0xb989cba5fad84d78e305909bf97605dc35b3cb6caf0e32a2009c3a2dda876003](https://etherscan.io/tx/0xb989cba5fad84d78e305909bf97605dc35b3cb6caf0e32a2009c3a2dda876003) 

- and the last transaction of the DAO Token Creation Period (on May 28th 9:00 AM UTC)
[0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da](https://etherscan.io/tx/0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da)

The script searches for all transactions directed TO the DAO Contract [0xbb9bc244d798123fde783fcc1c72d3bb8c189413](https://etherscan.io/address/0xbb9bc244d798123fde783fcc1c72d3bb8c189413)



- Then the script differentiates between direct and proxied transactions: direct transactions are those sent directly by the end user from his wallet directly to theDAO, while proxied transactions are sent by intermediaries, like exchanges, to theDAO, in the name of the end user who bought the DAO Tokens. 

- The script finds the right end owner, of both theDAO Tokens and the extrabalance, and the amount of extra balance they actually own, by tracing the stack, replaying every transaction and searching for the appropriate data in the Virtual Machine execution code. This is an interesting tool for anyone who wants to understand how to parse the Blockchain. 

- then the script simply                  


- **stores all these Transactions to the DAO in an array** that can be manipulated again
- and creates a new **List of all the Addresses** that have sent ETH to the DAO, **adding up all the ETH they've ever sent to it between the two dates** in one unique balance.

these values are available in the output folder if you don't want' to parse it yourself again.


### WARNINGS

- I've inferred the transactions "by hand", by looking at the dates in Etherscan. All the transactions are visibile in DAO Transaction List between [ Etherscan page 2044](https://etherscan.io/txs?a=0xbb9bc244d798123fde783fcc1c72d3bb8c189413&p=2044) and [page 1467](https://etherscan.io/txs?a=0xbb9bc244d798123fde783fcc1c72d3bb8c189413&p=1467). This might mean that **I could have missed some older transactions (if the date is not right)**. As for the closing date, I'm preety confident that it is really the last transaction, because all transactions after that one are either 0 ETH or had problems. 

- This addresses **only show the balance of ETH sent AFTER May 15th**, but **if someone sent ETH to the DAO from the same account also BEFORE, those ETH will not appear in this output**. This script is only to have a parameter to know how much of the extrabalance each address has a right to (could be proportionally split for example).

- It is INCOMPLETE because **it doesn't yet tell you the actual percentage of ownership of the ExtraBalance that each Address is entitled to** (each transaction was sent on different dates that had different values : ie, if you bought on the 15th of May, according to the [pricing Schedule](https://blog.daohub.org/the-dao-creation-period-price-schedule-4a8bc7a76e04) you had just pay 1.05 ETH for 100 DAOTokens, while if you bought them at the end you payed 1.5 ETH for 100 Tokens; **those that payed later "own" more extrabalance than those that payed early**).
Luckily as said before this can be easily calculated by parsing again the 




## HOW TO RUN

There are 3 ways to run the script, from best to worst:

1. running a shell script that runs the geth console and saves the output to a text file
2. directly in the geth console
3. as a NodeJS Instance connected to geth via rpc

The script supports the 3 methods since I had to try them all to see which really worked.
the geth console (method 1 and 2) are way faster than Node (method 3) and, although Node can make simple queries to the running geth instance via rpc, it kept hanging for the very large set of 78K Blocks to parse.
Also method 2, froze the terminal due to the large output.

- All 3 methods require you to have [Geth already installed](https://github.com/ethereum/go-ethereum/wiki/Geth) in your system and running 
- if you run the whole 78K blocks it will take a long time (2:09 h on my computer)

### METHOD 1 - Through the Shell Script
You can run it without parameters, which will parse all the 78K Bloks, 

```
	$ ./extraBalanceRunScript > output-file-name.txt 
```
or by telling it between which blocks you want it to parse (just 30 blocks between Block 1520861 and Block 1520891) 

```
	$ ./extraBalanceRunScript 1520861 1520891 > output-file-name.txt  
```

### METHOD 2 - Directly in the Geth console

```
$ geth --exec 'loadScript("extraBalanceOwners.js")' attach
```
this is good for quick tests and seeing the output directly in the running console, but I don't suggest it for very large sets like the 78K Blocks since your terminal is might crash (at least mine did 2 times and I had to start over)


### METHOD 3 - as a NodeJS script
for this method to work you must have previously started geth with the rpc option, to allow Node to communicate to geth.

```
$ geth --rpc
```
you might as well want to download all node packages, although they might be already imported by the geth console in itself

```
$ cd path/to/extraBalanceOwnser-folder
$ npm install
```

then, from the same folder, you can simply run

```
$ node extraBalanceOwners.js
```
**WARNING** this method is SLOW and will hang for medium sized parsing requirements (mine hanged after ≈1000 Blocks.)



































 




