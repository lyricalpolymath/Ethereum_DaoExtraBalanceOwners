/**
DAO EXTRA BALANCE OWNERS v2 (with trace transactions)
parses the Ethereum Blockchain and extracts the **Addresses that have rights to the DAO ExtraBalance** because they bought DAO Tokens between May-15-2016 09:00:16 AM UTC and May 28th 9:00 AM UTC, the end of the DAO Token Creation period.

read the README file file for the 3 ways in which you can run this script

    Copyright (C) 2016  Beltran Berrocal <b25zero1@gmail.com> <@lyricalpolymath>
    https://github.com/lyricalpolymath/Ethereum_DaoExtraBalanceOwners

    LICENCE (GNU AGPL)
    This file is part of extraBalanceOwners.

    extraBalanceOwners is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License (AGPL) as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    extraBalanceOwners is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU AGPL General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with extraBalanceOwners.  If not, see <https://www.gnu.org/licenses/agpl.txt>.

    If your software can interact with users remotely through a computer
    network, you should also make sure that it provides a way for users to
    get its source.  For example, if your program is a web application, its
    interface could display a "Source" link that leads users to an archive
    of the code.  There are many ways you could offer source, and different
    solutions will be better for different programs; see section 13 for the
    specific requirements.

      You should also get your employer (if you work as a programmer) or school,
    if any, to sign a "copyright disclaimer" for the program, if necessary.
    For more information on this, and how to apply and follow the GNU AGPL, see
    <http://www.gnu.org/licenses/>.
*/

console.log("STARTWORD");

var Web3 = require('web3');
var BigNumber = require('bignumber.js');

//detect if we are running in Node or in the geth console and conditionally change the behavior
var isNode = false;
if (typeof module !== 'undefined' && module.exports) {
  var fs = require('fs');
  isNode = true;
}

// solve if it's NOT a shell script
if(!INJECTEDPARAM_BLOCK1)    var INJECTEDPARAM_BLOCK1    = null;
if(!INJECTEDPARAM_BLOCKLAST) var INJECTEDPARAM_BLOCKLAST = null;
if(!INJECTEDPARAM_SHELLSCRIPT) var INJECTEDPARAM_SHELLSCRIPT = false;

var dbug = true;

// load the trace parser function
loadScript("./ethTraceParser.js")

//console.log("INJECTEDPARAM_BLOCK1: " + INJECTEDPARAM_BLOCK1)
//console.log("INJECTEDPARAM_BLOCKLAST: " + INJECTEDPARAM_BLOCKLAST)
//console.log("INJECTEDPARAM_SHELLSCRIPT: " + INJECTEDPARAM_SHELLSCRIPT)


//----------------------------------------------

// if parseAll = true it will parse all 78.344 blocks and it will take a long time
// set it to false and the max amount of Blocks you want to parse for development purposes
var parseAll = true;
var parseMaxNBlocks = 20;
var dbug = false;

var theDAO = "0xbb9bc244d798123fde783fcc1c72d3bb8c189413";
var theDAOExtraBalanceAddress = "0x807640a13483f8ac783c557fcdf27be11ea4ac7a"

// The first and last transactions that own extrabalance
// I've inferred them by looking by hand the dates in Etherscan
// and using the dates define in this post https://blog.daohub.org/the-dao-creation-period-price-schedule-4a8bc7a76e04
// first extrabalance transaction on May-15-2016 09:00:16 AM
// last transaction before DAO Token Creation expiry, before May 28th 9:00 AM UTC
// all transactions are visible in Etherescan between pages
//      https://etherscan.io/txs?a=0xbb9bc244d798123fde783fcc1c72d3bb8c189413&p=2044
// and  https://etherscan.io/txs?a=0xbb9bc244d798123fde783fcc1c72d3bb8c189413&p=1467
var higherCostTXOne = "0xb989cba5fad84d78e305909bf97605dc35b3cb6caf0e32a2009c3a2dda876003"
var higherCostTXLast = "0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da"

// The blocks that contain the first and last transaction that own extrabalance
// the injectedParams are passed by the shell script, but if no shell script is used we already have the default values
var firstExtraBalanceBlock = 1520861
var blockOne  = INJECTEDPARAM_BLOCK1 || 1520861               // https://etherscan.io/block/1520861
var blockLast = INJECTEDPARAM_BLOCKLAST || 1599205 //blockOne + parseMaxNBlocks; //1599205        // https://etherscan.io/block/1599205
var totBlocks = blockLast - blockOne                      //78.344 Blocks to parse

var theDAOExtraTransactions = []  // pure list of transactions that have generated extrabalance and that can be conveniently parsed again
var theDAOExtraOwners = {}        // a full object containing all the addresses of the extra balance owners + their transactions
var simpleOwners = []             // the owners reduced to the address and total eth they've put in across all transactions
var transactionsWithProblems = [] // contains a list of transactions caputered by the try catch system
var txsProxied = 0;                // simple counter of the proxied transactions
var txsDirect = 0;

var startTime, endTime, startBlock, endBlock;
var ethDivisor = 1e18; //100000000000000000000;




// WEB3 Initialization for Node
var web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}



// the magic > parse the Blockchain and extract the info you want
function parseExtraBalanceOwnersAndTransaction(_startBlock, _endBlock) {
    //you can pass the 2 parameters to search a smaller set of the blockchain for testing
    startBlock = _startBlock || blockOne;
    endBlock = _endBlock || blockLast;

    var foundTX1 = false;
    var foundTXLast = false;

    startTime = new Date();
    console.log("--------------------------------------------------------------------------")
    console.log("\tparse ExtraBalance Owners And Transaction STARTED \n\ton   " + startTime);
    console.log("\tthere are " + (endBlock - startBlock) + " Blocks to parse   (outputting only the meaningful ones)");
    console.log("--------------------------------------------------------------------------")

    // parse all blocks between the 2 specific blocks
    for (var i = startBlock; i <= endBlock; i++) {
        if(dbug) console.log("parsing block " + i);

        //retrieve the block - the "true" boolean will return all transactions as objects so that you can parse them
        // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetblock
        var block = web3.eth.getBlock(i, true);
        if (block != null && block.transactions != null) {

            //since it might take a long time, give yourself a feedback on the console at the end of each block
            var totOwners = Object.keys(theDAOExtraOwners).length;
            var totTransactions = theDAOExtraTransactions.length;

            //go through every transaction and look for those that have TO the DAO
            block.transactions.forEach(function(tx) {

                // start storing only from the first transaction
                // there might be some transactions to the DAO, before the one we are interested in, in the same block, so we discard them
                // also exclude all transactions after the last one
                if (!foundTX1 && (tx.hash == higherCostTXOne || i > firstExtraBalanceBlock)) foundTX1 = true;

                // this is a transaction to the DAO in the range of transactions that we want
                // also it is a non-zero transaction ( there are few of those that happen for example in the out of gas exemption like "0xc251af08134c0bfd92579c570e31e4af950d7e077d18d586108afb7e59365a94")
                if (tx.to == theDAO && tx.value != 0 && foundTX1 && !foundTXLast) {                          
					
					// exclude all transactions after the last one - put it here otherwise the code will skip the last transaction
					if (!foundTXLast && tx.hash == higherCostTXLast) foundTXLast = true;	
	
                    if(dbug) console.log("parsing tx: " + tx.hash);

                    // systematically trace the transaction > extract the CALL opcode > check if it is a proxied or direct creation
                    // and extract the final owner and real ExtraBalance value
                    // tracedTX = { address, ebWei, txType };
                    var tracedTX = extractExtraBalanceFromTXTrace(tx.hash);

                    // avoid transactions that have problems and halt the script
                    // record the problematic tx to review later and skip to next tx
                    if(tracedTX == undefined) {
                      transactionsWithProblems.push(tx.hash);
                      return true
                    }

                    //The transaction was to the DAO store it in the transaction list, save only the hash to save space
                    // theDAOExtraTransactions.push(tx.hash);
                    theDAOExtraTransactions.push(tracedTX) //store the whole object

                    // register for the stats
                    if (tracedTX.txType == "proxy")       txsProxied++;
                    else if (tracedTX.txType == "direct") txsDirect++;


                    //store the address and balance
                    //var from = tx.from;
                    var from = tracedTX.address;

                    //add the time directly to the transaction so you can read it directly both as timestamp and as a human readable date in UTC
                    //tx.time = transactionTimeStamp(block.timestamp)

                    if (!theDAOExtraOwners[from]) {

                        //first time we encounter this sending address,
                        //create an object and store it in the list of ExtraOwners
                        //+ store only some of the info of the transaction to save space
                        //+ Bignumber management in js https://github.com/ethereum/wiki/wiki/JavaScript-API#a-note-on-big-numbers-in-web3js
                        theDAOExtraOwners[from] = {
                            address: from,
                            balanceTot: web3.toBigNumber(tracedTX.ebWei),
                            transactions: [{
                                hash: tx.hash,
                                ebWei: tracedTX.ebWei,
                                type: tracedTX.txType,
                                //time: tx.time,
                            }]
                        }


                    } else {
                        // The owner is already recorded in the array
                        // simply add this transaction to his list and add the balance

                        // but first let's check that the balance math works and output an error if the sum doesn't work (there are problems using the ethDivisor)
                        var owner = theDAOExtraOwners[from];
                        var newValue = web3.toBigNumber(tracedTX.ebWei);
                        var oldBalance = owner.balanceTot; //it is already a BigNumber
                        var newBalance = oldBalance.plus(newValue);
                        //var test = newBalance.eq( oldBalance.plus(newValue) )
                        //console.log("typeof oldBalance " + typeof(oldBalance));
                        //console.log("\n\n---found a previous owner " + from + "\n oldBalance: " + oldBalance + " + " + newValue + " == newBalance: " + newBalance + " >>> " +  test);
                        //console.log("tx.value: " + tx.value + " BigNumber(tx.value): " + newValue);
                        //console.log("----\n")
                        //if (!test) console.log("\n\nBALANCE CALCULATION ERROR DETECTED For OWNER: " + from + " on TX: " + tx.hash + "\n\n");

                        // ACHTUNG: we are adding the eth balance but this number does not tell us when he bought it and in what increase step his tokens belong to
                        // this only tells us a total amount of ether that he has put in
                        owner.balanceTot = newBalance;
                        owner.transactions.push({
                            hash: tx.hash,
                            ebWei: tracedTX.ebWei,
                            type: tracedTX.txType,
                            //time: tx.time,
                        });

                    }

                }
            })
        }

        // finished parsing the block display the feedback (only if there was noteworthy info)
        // also output it only if there is no "INJECTEDPARAM_SHELLSCRIPT" which means that we are running as a standalone script and we need a visual feedback of the process
        if (!INJECTEDPARAM_SHELLSCRIPT) {
          var newTXs = theDAOExtraTransactions.length - totTransactions;
          var newOwners = Object.keys(theDAOExtraOwners).length - totOwners;
          if (newOwners > 0 || newTXs > 0)
              console.log("parsed block " + i + " / " + (endBlock-i) + " left  -  found new OWNERS: " + newOwners + " of " + Object.keys(theDAOExtraOwners).length + "  -  new TRANSACTIONS: " + newTXs + " of " + theDAOExtraTransactions.length);

        }

    }

    endTime = new Date();
    console.log("\n\n--------------------------------------------------------------------------")
    console.log("parse ExtraBalance Owners And Transaction DONE on   " + endTime);
    console.log("--------------------------------------------------------------------------")
}


// returns a clean time object to store along with the transaction
// with both the timestamp code (ie 1469021581) as well as a readable String formatted in UTC
function transactionTimeStamp(blockTimeStamp) {
    //blockTimeStamp = web3.eth.getBlock(blockN).timestamp;
    var d = new Date(blockTimeStamp * 1000); //x1000 to convert from seconds to milliseconds
    var s = d.toUTCString();
    s = (s.substring(0, s.lastIndexOf(" ")) + " UTC"); //change the confusing 'GMT' or 'CEST' to 'UTC'
    return {
        timestamp: blockTimeStamp,
        UTCdate: s
    }
}


// reduces theDAOExtraOwners to a simple list of  owner: balance
function getSimpleOwners() {
    var owners = Object.keys(theDAOExtraOwners)
        //console.log(owners.length + " owners: " + JSON.stringify(owners));
    var ownersSimple = []
    for (o in theDAOExtraOwners) {
        ownersSimple.push({
            address: theDAOExtraOwners[o].address,
            totETH: theDAOExtraOwners[o].balanceTot
        })
    }
    return ownersSimple;
}


//sums all ETH balances and returns one unique value
function getTotalETH() {
    var owners = Object.keys(theDAOExtraOwners)
    var totWEI = new BigNumber(0);
    for (o in theDAOExtraOwners) {
        totWEI = totWEI.plus(theDAOExtraOwners[o].balanceTot)
    }
    return totWEI.div(ethDivisor);
}

//retrieve statistics about the process so that you can save it to a file
function getStats() {
    return {
        addresses: Object.keys(theDAOExtraOwners).length,
        transactions: theDAOExtraTransactions.length,
        transactions_proxied: txsProxied,
        transactions_direct: txsDirect,
        totalEther: getTotalETH(),
        blocks_parsed: (endBlock - startBlock),
        block_start: blockOne,
        block_end: endBlock,
        time_start: startTime.toUTCString(),
        time_end: endTime.toUTCString(),
        time_duration: msToTime(endTime - startTime),
    }
}

// convert the duration for the stats
function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24),
        days = parseInt((duration / (1000 * 60 * 60 * 24)) % 365);

    var h = (hours < 10) ? "0" + hours : hours;
    var m = (minutes < 10) ? "0" + minutes : minutes;
    var s = (seconds < 10) ? "0" + seconds : seconds;

    return days + "d : " + hours + "h : " + minutes + "m : " + seconds + "s." + milliseconds;
}

/** utility to save a variable to an output file
// @param fileDirAndName    String - ie "outputs/simpleOwners.txt"
// @param objName           Object - any object to stringify into the file
// @param beautify          Boolean - default false which saves the string minified to save space. if true, it will save it with 4 indents
*/
function saveToFile(fileDirAndName, objName, beautify) {
    var indent = (beautify) ? 4 : 0
    fs.writeFile(fileDirAndName, JSON.stringify(objName, null, indent), function(err) {
        if (err) {
            console.log(fileDirAndName + " >> ERROR WRITING FILE!!  ");
            return console.log(err);
        }
        console.log(" >> FILE SAVED!! \t" + fileDirAndName);
    });
}



//------------------------------------
//      EXECUTE IT
//------------------------------------

if (parseAll) {
    // execute THE FULL PARSING
    try {
      parseExtraBalanceOwnersAndTransaction();
    } catch(err) {
      console.log("Problem in TX: " + theDAOExtraTransactions[theDAOExtraTransactions.length - 1] + " \nerror: " + err);
    }
} else {
  // FOR DEV PURPOSES - parse only N blocks
  parseExtraBalanceOwnersAndTransaction(blockOne, (blockOne + parseMaxNBlocks));
}






//Save the output and/or trace it to the console
console.log("\n\n------------------\n STATS \n------------------")
var stats = getStats()
console.log(JSON.stringify(stats, null, 8));


// recognizes if it's node and will save the files to the output folder
if (isNode) {
  console.log("\n\n------------------\n FILES \n------------------")
  saveToFile("outputs/stats.txt", stats, true);

  // most important file that will allow you to parse again each transaction timestamp
  saveToFile("outputs/ExtraBalanceOwners-full.txt", theDAOExtraOwners, true);

  simpleOwners = getSimpleOwners();
  saveToFile("outputs/ExtraBalanceOwners-simple.txt", simpleOwners, true);
  saveToFile("outputs/ExtraBalaceOwners-simple.min.txt", simpleOwners);

  saveToFile("outputs/ExtraBalanceTransactions.txt", theDAOExtraTransactions);

} else {
  //it's not Node output to the console
  console.log("\n\n------------------\n SIMPLE OWNERS \n------------------")
  simpleOwners = getSimpleOwners();
  console.log("Simplifief Owners and Balance: ", JSON.stringify(simpleOwners, null, 0));


  console.log("\n\n------------------\n FULL OWNERS + TRANSACTIONS \n------------------")
  //console.log("theDAOExtraOwners: ", JSON.stringify(theDAOExtraOwners, null, 4)) //beautified
    console.log("theDAOExtraOwners: ", JSON.stringify(theDAOExtraOwners, null, 0))

  console.log("\n\n------------------\n ALL TRANSACTIONS \n------------------")
  console.log("theDAOExtraTransactions: ", JSON.stringify(theDAOExtraTransactions, null, 0));


  if (transactionsWithProblems.length > 0) {
    console.log("\n\n------------------\n TRANSACTIONS WITH PROBLEMS \n------------------")
    console.log("transactionsWithProblems = ", JSON.stringify(transactionsWithProblems,null,0))
  }

  //console.log("\n\n------------------\n TRANSACTIONS \n------------------")
  //console.log("theDAOExtraTransactions: ", JSON.stringify(theDAOExtraTransactions));

  console.log("ENDWORD");
}
