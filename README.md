# DAO ExtraBalance Owners and Transactions Parser


## MOTIVATION AND HISTORY
this script parses the Ethereum Blockchain and extracts the **Addresses that have rights to the DAO ExtraBalance** because they bought DAO Tokens between May-15-2016 09:00:16 AM UTC and May 28th 9:00 AM UTC, the end of the DAO Token Creation period.

The aim of this script is to extract a **list of Address and their "Extra" ETH Balance** (that they sent after the price increase phase) ** but it can also be useful to understand how a generic Ethereum Blockchain parser can work**

The first date marks the starting of a "Price Increase Phase" in the value of DAO Tokens. 
Before May 15, people bought DAO Token at a rate of 1 ETH = 100 DAO Tokens.
After that date the price increased progressively every day.

You can read more about [The DAO Creation Period Price Schedule](https://blog.daohub.org/the-dao-creation-period-price-schedule-4a8bc7a76e04)



graph |  table 
------------ | ------------- 
![Pricing Schedule](https://cdn-images-1.medium.com/max/800/0*vevH7oUG_8KZDrTk.) | ![](https://cdn-images-1.medium.com/max/800/1*PgOcmSra1UjX4Yf9p6m1pw.png)  
 
As of July 21st 2016 (After the DAO Hack & the successfull Ethereum Hard Fork to solve it) 
there is only a [widthdraw contract](https://blog.slock.it/how-to-use-the-withdraw-contract-with-mist-de5d85a981c9#.bjvnkqkt7) for those that bought DAO Tokens at a rate of 1ETH :100 DAOTokens.

A [solution is on the way](http://ethereum.stackexchange.com/questions/7265/how-do-i-get-a-refund-for-the-amount-i-paid-in-excess-of-1-ether-to-100-the-dao), but I thought I'd get the chance to learn a bit about Ethereum and learn how to parse it's blockchain.

####The actors
- theDAO ExtraBalance: [0x807640a13483f8ac783c557fcdf27be11ea4ac7a](https://etherscan.io/address/0x807640a13483f8ac783c557fcdf27be11ea4ac7a)
- TheDAO Contract:    [0xbb9bc244d798123fde783fcc1c72d3bb8c189413](https://etherscan.io/address/0xbb9bc244d798123fde783fcc1c72d3bb8c189413)
- TheDao Curator: 	   [0xda4a4626d3e16e094de3225a751aab7128e96526](https://etherscan.io/address/0xda4a4626d3e16e094de3225a751aab7128e96526) (Holds all the eth after the Hard fork)


## RESULTS AND STATS

The parsing found:

- **11440 unique addresses** that own balance in the extraBalance
- **344917.57992346864402677 total ETH** of the Extrabalance owned by the addresses
- 22.608 transactions

you can **see the results in the output folder [output_01_full.txt](./02_outputs/output_01_full.txt)** 

These results match those of [other people](https://github.com/bokkypoobah/TheDAOData/blob/master/getTheDAOCreatedTokenEventsWithNonZeroExtraBalance_v3) with a very small difference in ETH balance (just 86360144 WEI or 0.000000000086360144 ETH) that is due only to a rounding problem in their script



## ABOUT THE SCRIPT - METHODOLOGY

There are other ways to get the same results. Check [Arachnid](https://github.com/Arachnid/extrabalance/blob/master/extrabalance.js) and [Bookypoobahs's](https://github.com/bokkypoobah/TheDAOData/blob/master/getTheDAOCreatedTokenEventsWithNonZeroExtraBalance_v3) script, which, although they have rounding issues in their balances, both use a simpler technique to retrieve the appropriate transactions: they listen to the DAO's "CreatedToken" events. 

Their technique implies that you must know the ABI of the smart contract and, more importantly, that the creator of the smart contract, does in fact store events and logs. But how would you go about to do it if you didn't know the ABI or the contract did not log any event, and you had to "forensically analyze" the Ethereum Blockchain?
You would have to **completely parse the blockchain, tracing every transaction and looking for the right data in the traced stack.**

This technique takes way longer but is the only deterministical way of telling what happened in the blockchain. **This script uses this deterministic approach** and it can teach you a lot about what you have to look for when parsing the blockchain. 

This script **parses 78.344 Blocks** of the Ethereum Blockchain between
[block 1520861](https://etherscan.io/block/1520861) and [block 1599205](https://etherscan.io/block/1599205)
and stores all *appropriate* Transactions and Addresses between

- the first transaction that payed more than 1 ETH : 100 DAO Token (on May-15-2016 09:00:16 AM UTC) [0xb989cba5fad84d78e305909bf97605dc35b3cb6caf0e32a2009c3a2dda876003](https://etherscan.io/tx/0xb989cba5fad84d78e305909bf97605dc35b3cb6caf0e32a2009c3a2dda876003) 

- and the last transaction of the DAO Token Creation Period (on May 28th 9:00 AM UTC)
[0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da](https://etherscan.io/tx/0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da)

The script searches mainly for all transactions directed TO the DAO Contract [0xbb9bc244d798123fde783fcc1c72d3bb8c189413](https://etherscan.io/address/0xbb9bc244d798123fde783fcc1c72d3bb8c189413)

- The script finds the right end owner, of both theDAO Tokens and the extrabalance, and the amount of extra balance they actually own, by tracing the stack, replaying every transaction and searching for the appropriate data in the Virtual Machine execution code. 

- the script looks for and manages these **5 types of transactions**. These are a good measure of what any parser should be on the lookout for.

 
  Tx type                     |  example    |  description |
---------------------------- | ------------- | -------------
 **1 - direct trasaction**        | [link](http://etherscan.io/tx/0x29f564543d22a5dd86c42cce039d071df89191f9a5dede211493372601e79a38) | the user sent eth to the Dao directly from his/her wallet
 **2 - proxied transaction**      | [link](http://etherscan.io/tx/0x0ad78201811a6dbe74f9e6510282f2b887f5c04201be559e073584842bec6360) | an intermediary such as an exchange (ie Poloniex) bought the eth for an end user and calls theDAO's `crateTokenProxy` function
 **3 - txs with input data**      | [link](http://etherscan.io/tx/0xeea3be70ab2204693fb0bc30a37ab09aa47f790bd61f058efd7c2be4fa64a66b) | direct or proxied transactions where there is also an input data passed onto the transaction
 **4 - txs from smart contract**  | [link](http://etherscan.io/tx/0x9b9cc86509f86070edea8761c6e36e704e988fb57962838716df6746d2031303) | addresses that don't belong to humans but to smart contracts that call theDAO smart contract
 **5 - out of gas**               | [link](http://etherscan.io/tx/0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1) | txs that dindn't go through but if you look at them in the simple way they still seem to have sent a value

- **the 140 Smart contract addresses**: in a previous version of this script I didn't consider the transactions of the 4th type (to smart contracts that then call theDAO) and there is no easy way to tell these apart of other transactions. The only way is to trace each and every transaction between the 2 blocks. That should be the way to really go. **By diffing my previous results with those of Arachnid or BokkyPoobah I extracted these special 140 addresses into the file** [/02_outputs/output_140KnownSmartContracts.txt](./02_outputs/output_140KnownSmartContracts.txt)
since these are "known addresses", that both Arachnid and BokkyPoobah found, for the sake of speed, instead of simply tracing every transaction on the blockchain, it simply checks if the transaction it is parsing is also TO one of these 140 smart contracts, and then it traces it like all other cases.

- the folder [03_outputAnalysisAndConverters](/03_outputAnalysisAndConverters) contains some of the converters that produced these results



### WARNINGS

- I've inferred the transactions "by hand", by looking at the dates in Etherscan. All the transactions are visibile in DAO Transaction List between [ Etherscan page 2044](https://etherscan.io/txs?a=0xbb9bc244d798123fde783fcc1c72d3bb8c189413&p=2044) and [page 1467](https://etherscan.io/txs?a=0xbb9bc244d798123fde783fcc1c72d3bb8c189413&p=1467). This might mean that **I could have missed some older transactions (if the date is not right)**. As for the closing date, I'm preety confident that it is really the last transaction, because all transactions after that one are either 0 ETH or had problems. 

- This addresses **only show the balance of ETH sent AFTER May 15th**, but **if someone sent ETH to the DAO ExtraBalance from the same account also BEFORE, those ETH will not appear in this output**. This script is only to have a parameter to know how much of the extrabalance each address has a right to 





## HOW TO RUN

There are 3 ways to run the script, from best to worst:

1. running a shell script that runs the geth console and saves the output to a text file
2. directly in the geth console
3. as a NodeJS Instance connected to geth via rpc

The script supports the 3 methods since I had to try them all to see which really worked.
the geth console (method 1 and 2) are way faster than Node (method 3) and, although Node can make simple queries to the running geth instance via rpc, it kept hanging for the very large set of 78K Blocks to parse.
Also method 2, froze the terminal due to the large output.

- All 3 methods require you to have [Geth already installed](https://github.com/ethereum/go-ethereum/wiki/Geth) in your system and running 
- if you run the whole 78K blocks it will take a long time (19h on my computer)

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



































 




