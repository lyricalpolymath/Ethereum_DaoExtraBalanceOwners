# DAO ExtraBalance Owners and Transactions Parser


## MOTIVATION AND HISTORY
this script parses the Ethereum Blockchain and extracts the **Addresses that have rights to the DAO ExtraBalance** because they bought DAO Tokens between May-15-2016 09:00:16 AM UTC and May 28th 9:00 AM UTC, the end of the DAO Token Creation period.

The aim of this script is to extract a **list of Address and their "Extra" ETH Balance** (that they sent after the price increase phase) 

The first date marks the starting of a "Price Increase Phase" in the value of DAO Tokens. 
Before May 15, people bought DAO Token at a rate of 1 ETH = 100 DAO Tokens.
After that the price increased progressively every day.

You can read more about [The DAO Creation Period Price Schedule](https://blog.daohub.org/the-dao-creation-period-price-schedule-4a8bc7a76e04)
 
As of July 21st 2016 (After the DAO Hack & the successfull Ethereum Hard Fork to solve it) 
there is only a [widthdraw contract](https://blog.slock.it/how-to-use-the-withdraw-contract-with-mist-de5d85a981c9#.bjvnkqkt7) for those that bought DAO Tokens at a rate of 1ETH :100 DAOTokens.

A [solution is on the way](http://ethereum.stackexchange.com/questions/7265/how-do-i-get-a-refund-for-the-amount-i-paid-in-excess-of-1-ether-to-100-the-dao), but I thought I'd get the chance to learn a bit about Ethereum and learn how to parse it's blockchain.


## RESULTS AND STATS
the script has to parse 78.344 Blocks and is therefore a bit slow. It could certainly be made faster.
It took my computer XXX hours to parse it.

The scripts finds 

- xxx Addresses
- xxx Transactions directed to the DAO (between the 2 dates)
- a total ETH balance of XXX ETH

you can see the results in the output folder but you should definitively run it yourself.


## ABOUT THE SCRIPT
This script parses the Ethereum Blockchain between
[block 1520861](https://etherscan.io/block/1520861) and [block 1599205](https://etherscan.io/block/1599205) (that's 78.344 blocks)
and stores al Transactions and Addresses between

- the first transaction that payed more than 1 ETH : 100 DAO Token (on May-15-2016 09:00:16 AM UTC) [0xb989cba5fad84d78e305909bf97605dc35b3cb6caf0e32a2009c3a2dda876003](https://etherscan.io/tx/0xb989cba5fad84d78e305909bf97605dc35b3cb6caf0e32a2009c3a2dda876003) 

- and the last transaction of the DAO Token Creation Period (on May 28th 9:00 AM UTC)
[0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da](https://etherscan.io/tx/0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da)

The script searches for all transactions directed TO the DAO Contract [0xbb9bc244d798123fde783fcc1c72d3bb8c189413](https://etherscan.io/address/0xbb9bc244d798123fde783fcc1c72d3bb8c189413)

it then
 
- **stores all these Transactions to the DAO in an array** that can be manipulated again
- and creates a new **List of all the Addresses** that have sent ETH to the DAO, **adding up all the ETH they've ever sent to it between the two dates** in one unique balance.

these values are available in the output folder if you don't want' to parse it yourself again.


### WARNINGS

- I've inferred the transactions by looking at the dates in Etherscan. All the transactions are visibile in DAO Transaction List between [ Etherscan page 2044](https://etherscan.io/txs?a=0xbb9bc244d798123fde783fcc1c72d3bb8c189413&p=2044) and [page 1467](https://etherscan.io/txs?a=0xbb9bc244d798123fde783fcc1c72d3bb8c189413&p=1467). This might mean that **I could have missed some older transactions (if the date is not right)**. As for the closing date, I'm preety confident that it is really the last transaction, because all transactions after that one are either 0 ETH or had problems. 
- This addresses **only show the balance of ETH sent AFTER May 15th**, but **if someone sent ETH to the DAO from the same account also BEFORE, those ETH will not appear in this output**. This script is only to have a parameter to know how much of the extrabalance each address has a right to (could be proportionally split for example).
- because of this reasons **it might be incomplete**




## HOW TO RUN

```
geth --exec 'loadScript("extraBalanceOwners.js")' attach
```

 




