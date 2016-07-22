/**
execute it like this
OLD VERSION WITHOUT NODE $ geth --exec 'loadScript("path/to/extraBalanceOwners.js")' attach
NEW NODE VERSION
1 - install all dependencies
	$ npm install
2- ensure you've run the geth node with rpc active like so
	$ geth --rpc
3- run the script in node
   $ node path/to/extraBalanceOwners.js
*/


var Web3 = require('web3');
var BigNumber = require('bignumber.js');
var fs = require('fs');


//----------------------------------------------

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
var blockOne  = 1520861  				// https://etherscan.io/block/1520861
var blockLast = 1599205  				// https://etherscan.io/block/1599205
var totBlocks = blockLast - blockOne  	//78.344 Blocks to parse

var theDAOExtraTransactions = []    	// pure list of transactions that have generated extrabalance and that can be conveniently parsed again
var theDAOExtraOwners = {}				// a full object containing all the addresses of the extra balance owners + their transactions

var startTime, endTime, startBlock, endBlock;

var ethDivisor = 100000000000000000000;


// WEB3 Initialization for Node
var web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}



// the magic > parse the Blockchain and extract the info you want
function parseExtraBalanceOwnersAndTransaction( startBlock, endBlock) {
	//you can pass the 2 parameters to search a smaller set of the blockchain for testing
	startBlock = startBlock || blockOne;
	endBlock =  endBlock || blockLast;

	var foundTX1 = false;
	var foundTXLast = false;

  startTime = new Date();
	console.log("--------------------------------------------------------------------------")
	console.log("\tparse ExtraBalance Owners And Transaction STARTED \n\ton   " + startTime);
	console.log("\tthere are " + (endBlock - startBlock) + " Blocks to parse");
	console.log("--------------------------------------------------------------------------")

// parse all blocks between the 2 specific blocks
  for (var i = startBlock; i <= endBlock; i++) {

    //retrieve the block - the "true" boolean will return all transactions as objects so that you can parse them
	// https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetblock
    var block = web3.eth.getBlock(i, true);

	//go through every transaction and look for those that have TO the DAO
	if (block != null && block.transactions != null) {

	  //since it might take a long time, give yourself a feedback on the console
	  var totOwners 	  = Object.keys(theDAOExtraOwners).length;
	  var totTransactions = theDAOExtraTransactions.length;

      block.transactions.forEach( function(tx) {

		//start storing only from the first transaction
		// there might be some transactions to the DAO, before the one we are interested in, in the same block, so we discard them
		// also exclude all transactions after the last one
		if (!foundTX1 && tx.hash == higherCostTXOne) 	 foundTX1 = true;
		if (!foundTXLast && tx.hash == higherCostTXLast) foundTXLast = true;

		// this is a transaction to the DAO in the range of transactions that we want
		if (tx.to == theDAO && foundTX1 && !foundTXLast) {

			//The transaction was to the DAO store it in the transaction list, save only the hash to save space
			theDAOExtraTransactions.push(tx.hash);

			//store the address and balance
			var from = tx.from;
			//add the time directly to the transaction so you can read it directly both as timestamp and as a human readable date in UTC
			tx.time = transactionTimeStamp(block.timestamp)

			if (!theDAOExtraOwners[from]) {

				//first time we encounter this sending address,
				//create an object and store it in the list of ExtraOwners
				//+ store only some of the info of the transaction to save space
				//+ Bignumber management in js https://github.com/ethereum/wiki/wiki/JavaScript-API#a-note-on-big-numbers-in-web3js
				var newAddress = {
					address: tx.from,
					balanceTot: new BigNumber(tx.value),
					transactions: [{
						hash: tx.hash,
						time: tx.time,
						value: tx.value,
						}]
				}
				theDAOExtraOwners[from] = newAddress;

			} else {
				// The owner is already recorded in the array
				// simply add this transaction to his list and add the balance

				// but first let's check that the balance math works and output an error if the sum doesn't work (there are problems using the ethDivisor)
				var newValue = new BigNumber(tx.value);
				var oldBalance = theDAOExtraOwners[from].balanceTot;  		//it is already a BigNumber
				var newBalance = oldBalance.plus(newValue);
				//var test = newBalance.eq( oldBalance.plus(newValue) )
				//console.log("typeof oldBalance " + typeof(oldBalance));
				//console.log("\n\n---found a previous owner " + from + "\n oldBalance: " + oldBalance + " + " + newValue + " == newBalance: " + newBalance + " >>> " +  test);
				//console.log("tx.value: " + tx.value + " BigNumber(tx.value): " + newValue);
				//console.log("----\n")
				//if (!test) console.log("\n\nBALANCE CALCULATION ERROR DETECTED For OWNER: " + from + " on TX: " + tx.hash + "\n\n");

				// ACHTUNG: we are adding the eth balance but this number does not tell us when he bought it and in what increase step his tokens belong to
				// this only tells us a total amount of ether that he has put in
				theDAOExtraOwners[from].balanceTot = newBalance;
				theDAOExtraOwners[from].transactions.push({
						hash: tx.hash,
					 	time: tx.time,
				        value: tx.value,
						});

			}

		  }
	  })
	}

	// finished parsing the block display the feedback (only if there was noteworthy info)
	var newTXs    = theDAOExtraTransactions.length - totTransactions;
	var newOwners = Object.keys(theDAOExtraOwners).length - totOwners;
	if (newOwners > 0 || newTXs > 0)
		console.log("parsed block " + i + " - new OWNERS found: " + newOwners + " of " + Object.keys(theDAOExtraOwners).length + "  -  new TRANSACTIONS: " + newTXs + " of " + theDAOExtraTransactions.length);

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
	var d = new Date(blockTimeStamp * 1000); 		  //x1000 to convert from seconds to milliseconds
	var s = d.toUTCString();
	s = (s.substring(0,s.lastIndexOf(" ")) + " UTC"); //change the confusing 'GMT' or 'CEST' to 'UTC'
	return {
		timestamp: blockTimeStamp,
		UTCdate: s
	}
}


// reduces theDAOExtraOwners to a simple list of  owner: balance
function getSimpleOwners(){
	var owners = Object.keys(theDAOExtraOwners)
	//console.log(owners.length + " owners: " + JSON.stringify(owners));
	var ownersSimple = []
	for (o in theDAOExtraOwners) {
		ownersSimple.push({
			address: theDAOExtraOwners[o].address,
			totETH:  theDAOExtraOwners[o].balanceTot
		})
	}
	return ownersSimple;
}


//sums all ETH balances and returns one unique value
function getTotalETH () {
	var owners = Object.keys(theDAOExtraOwners)
	var totWEI = new BigNumber(0);
	for (o in theDAOExtraOwners) {
		totWEI = totWEI.plus(theDAOExtraOwners[o].balanceTot)
	}
	return totWEI.div(ethDivisor);
}

//retrieve statistics about the process so that you can save it to a file
function getStats () {
  return {
    addresses:      Object.keys(theDAOExtraOwners).length,
    transactions:   theDAOExtraTransactions.length,
    totalEther:     getTotalETH(),
    parsedBlocks:   (endBlock - startBlock),
    startTime:    startTime.toUTCString(),
    endTime:      endTime.toUTCString(),
    duration:     msToTime(endTime - startTime),
  }
}

// convert the duration for the stats
function msToTime(duration) {
        var milliseconds = parseInt((duration%1000)/100)
            , seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }

/** utility to save a variable to an output file
// @param fileDirAndName    String - ie "outputs/simpleOwners.txt"
// @param objName           Object - any object to stringify into the file
// @param beautify          Boolean - default false which saves the string minified to save space. if true, it will save it with 4 indents
*/
function saveToFile (fileDirAndName, objName, beautify) {
  var indent = (beautify) ? 4 : 0
  fs.writeFile( fileDirAndName, JSON.stringify(objName, null, indent), function(err) {
      if(err) {
          console.log(fileDirAndName + " >> ERROR WRITING FILE!!  ");
          return console.log(err);
      }
      console.log(" >> FILE SAVED!! \t" + fileDirAndName );
  });
}



//------------------------------------
//      EXECUTE IT
//------------------------------------


// FOR DEV PURPOSES - parse only N blocks
parseExtraBalanceOwnersAndTransaction(blockOne, (blockOne+20))

// execute THE FULL PARSING
//parseExtraBalanceOwnersAndTransaction()



//Save the output and/or trace it to the console
console.log("\n\n------------------\n STATS \n------------------")
var stats = getStats()
console.log(JSON.stringify(stats, null, 8));
saveToFile("outputs/stats.txt", stats, true);

//console.log("\t >> "+ Object.keys(theDAOExtraOwners).length + " Addresses");
//console.log("\t >> "+ theDAOExtraTransactions.length + " Transactions");
//console.log("\t >> "+ getTotalETH() + " total ETH across All transactions and Addresses");


console.log("\n\n------------------\n SIMPLE OWNERS \n------------------")
var simpleOwners = getSimpleOwners();
//console.log("Simplifief Owners and Balance: ", JSON.stringify(simpleOwners, null, 0));
saveToFile("outputs/simpleOwners.txt", simpleOwners, true);
saveToFile("outputs/simpleOwners.min.txt", simpleOwners);






//console.log("\n\n------------------\n FULL OWNERS \n------------------")
//console.log("theDAOExtraOwners: ", JSON.stringify(theDAOExtraOwners, null, 0))
//console.log("theDAOExtraOwners: ", JSON.stringify(theDAOExtraOwners, null, 4)) //beautified

//console.log("\n\n------------------\n TRANSACTIONS \n------------------")
//console.log("theDAOExtraTransactions: ", JSON.stringify(theDAOExtraTransactions))
