// convert theDAOExtraOwners to a list of transactions and Blocks
// the output of this file is 

// this is a preliminary step for script outputAnalysis_04_extraBalanceBlockBalance.js
// which calculated the balance of the ExtraBalance at each block and confronts the sum with our values to find what blocks create the differences


// run like this
// geth --exec "loadScript('outputConverter_03_ExtraOwnersToTXandBlock.js')" attach > ./../02_outputs/output_03_extraBalancePerBlockSorted_new.txt

loadScript("/usr/local/lib/node_modules/underscore/underscore-min.js");                                        
loadScript("./../02_outputs/output_01_full.txt")	//theDAOExtraOwners

var extraBalance = "0x807640a13483f8ac783c557fcdf27be11ea4ac7a"
      

//----------------------------------  STEP 1
//			CONVERT MY OUTPUT
//convert my output to a list of transactions and sort per Block
// the array will look like this, sorted by Block Number 
// var theDAOExtraOwnersBlocks = [
// {"block":1520861,"tx":"0xb989cba5...876003","wei":"6380952380952380953"},
// {"block":1520866,"tx":"0xf34ead2d...6a26bf","wei":"1904761904761904762"},


function convertDaoExtraOwnersToTXAndBlock(){ 
	var blockTxs = [];
	for(o in theDAOExtraOwners) {
		
		var txs =  theDAOExtraOwners[o].transactions 
		txs.forEach(function(txo){
			var tx = web3.eth.getTransaction(txo.hash);
			var block = tx.blockNumber
			blockTxs.push({
				"block": block,
				"tx": txo.hash,
				"wei": txo.ebWei
			}) 
		})		 
	}
	return blockTxs;
}

//var convertedOutput = convertDaoExtraOwnersToTXAndBlock();
            
//SORT BY BLOCK NUMBER
//var sorted = _.sortBy(convertedOutput, "block");
//var theDAOExtraOwnersBlocks = sorted;
//
//console.log("\n\n//---------------------\n// BB Output to list of Blocks & Transactions \n//---------------------");
//console.log("//theDAOExtraOwnersBlocks should be 22.608 lines: " + (theDAOExtraOwnersBlocks.length == 22608));
//console.log("\nvar theDAOExtraOwnersBlocks = [");
//for (i in sorted) console.log(JSON.stringify(sorted[i],null,0) + ",");
//console.log("]");


 
            

// ------------------------ STEP 2 - NOW CONVERT IT TO AN ARRAY LIKE THIS  (group transactions by Block)
//[ 
//	{ block: 599023
//	  blockWeiSum: "xxxx", 			// sum of the ExtraBalance for this block > calculated by adding up al transaction values in this Block
//	  blockWeiEB:  "xxxx", 			// the EB balance AT THE END of this block > retrieved with eth.getBalance found by eth.getBalance("0x807640a13483f8ac783c557fcdf27be11ea4ac7a", 1599205).toString(10) 
//    blockWeiSumEB: "xxx"			// sum of all extrabalance wei values from the beginning to the end 
//	  transactions:[ 
//		{hash: "0x2f689a181655fc432afdf0f61d48e6855c3baf62a33cce7e4fd944086e577d75","wei":"2666666666666666667"},
//		{hash: "other value","wei":"500000000000000000"}
//	  ]
//	}, 
//	{...}
//] 
 
//swtich between test values and the whole output file
var test = false;

if (test) {
	// TESTING SUBSET - First elements 
	var theDAOExtraOwnersBlocks = [
		{"block":1520861,"tx":"0xb989cba5fad84d78e305909bf97605dc35b3cb6caf0e32a2009c3a2dda876003","wei":"6380952380952380953"},
		{"block":1520866,"tx":"0xf34ead2d5b1886e1b428082ff621aa2145e0f77b001011d1db99b15d356a26bf","wei":"1904761904761904762"},
		{"block":1520866,"tx":"0xafee9c83d41dd151b970f8241e27796db2aceaaace73bf1ecdc2dcc0f53a288f","wei":"47619047619047620"},
		{"block":1520870,"tx":"0xaeca3a70346d726ac77ad598cc5e819acb644317a0bf33c81d2b6c3c8acdcc1a","wei":"5238095238095238096"},
		{"block":1520870,"tx":"0xcc146aeea6d229dce6edd463c6d80fdd4e88af0a407ca6e9d72da31775eeb043","wei":"476190476190477"},
	];

} else {
   	//load the previously exported file
	loadScript("./../02_outputs/output_03_extraBalancePerBlockSorted.txt")   //imports theDAOExtraOwnersBlocks
}
               

//  WARNING - on Block 1520860 (1 before the beginning) The extrabalance already had 0.34 ETH
//	startWei = eth.getBalance(extraBalance, 1520860)   348802680031212160 WEI   or   0.34880268003121216 ETH
//  therefore we ALWAYS get the value of startWei from the balance of the ExtraBalance contract on the block before the one we will start testing 
//  looking at etherscan there doesn't seem to be an earlier "internal" transaction with balance sent to the ExtrABalance 
//  https://etherscan.io/txsInternal?a=0x807640a13483f8ac783c557fcdf27be11ea4ac7a&p=453  
//  https://etherscan.io/txsInternal?a=0x807640a13483f8ac783c557fcdf27be11ea4ac7a&&zero=true&&valid=true&p=452 (filtered out zeros, you'll see it starts from the first we know of)
//  but if you look at the direct transactions
// TheExtraBalance received 3 direct transactions with ETH, as if someone donated directly to the EB
// these txs can be seen in https://etherscan.io/txs?a=0x807640a13483f8ac783c557fcdf27be11ea4ac7a   (click view all and look at the last 3 at the bottom)
// only one was done before the ExtraBalance period started
// on Block: 1463307   >  TX https://etherscan.io/txs?a=0x807640a13483f8ac783c557fcdf27be11ea4ac7a  > received 0.34880268003121216 ETH 
// these 0.34 Eth are exactly equal (minus 1Wei) to Nick's actual difference Nick-EB   WEI: -348802680031212115     	 ETH: -0.348802680031212115
var startWei = eth.getBalance(extraBalance, (theDAOExtraOwnersBlocks[0].block-1))	//1520860 > get the balance before the first one in our test array
//console.log("startWei: " + startWei)


function groupTransactionsByBlockAndAddEBBalance(){
	var converted = [];
	//var totWEI = web3.toBigNumber("132765630169728133861019"); // xDEV - value at block 1565379 (right before the test one) 
	var totWEI = startWei
	for(i in theDAOExtraOwnersBlocks) {
		var b = theDAOExtraOwnersBlocks[i];
		var indx = _.findIndex(converted, {"block": b.block});

		var txo = { 
			hash: b.tx, 
			ebWei: b.wei
		}
		 
		
		totWEI = totWEI.add( web3.toBigNumber( b.wei ));
		 
		
		//there is no index, so it's the first time we find this block - add the object
		if (indx == -1) {
			//console.log("\nnew Block: " + b.block)
			//console.log("add " + b.wei)
			//console.log("totWEI: " + totWEI);
			 
			var ebBalanceAtBlock = eth.getBalance(extraBalance, b.block);
			 converted.push({
				block: b.block,
				bw1EBBal: 		ebBalanceAtBlock.toString(10),  	   						// the EB balance AT THE END of this block > retrieved with eth.getBalance
				bw2EBSum:  		totWEI.toString(10),                             			// the EB balance of this block > retrieved by adding all wei of previous blocks
				bw3Match:  		(totWEI.toString(10) == ebBalanceAtBlock.toString(10)),  	// verifies if the 2 previous values are the same
				bw4Diffr: 		ebBalanceAtBlock.minus(totWEI).toString(10), 				// how much our EBSum is off 
				bw5BlockSum: 	web3.toBigNumber(b.wei).toString(10),  						// sum of the ExtraBalance for this block > calculated by adding up al transaction values in this Block				     			
  				transactions: [txo]
			})

		} else {
			// there is already this block, add the transaction 
			//console.log("existing Block: " + b.block + " add wei: " + b.wei)
			//console.log("currentTotal: " + totWEI)
			with( converted[indx] ) {
				transactions.push(txo);               
				bw5BlockSum   = web3.toBigNumber( bw5BlockSum ).add( web3.toBigNumber( b.wei )).toString(10);
				bw2EBSum = totWEI.toString(10);
				bw3Match = ( totWEI.toString(10) == web3.toBigNumber( bw1EBBal ).toString(10));
				bw4Diffr = web3.toBigNumber( bw1EBBal ).minus( totWEI ).toString(10)
				
			}
		}
	}
	return converted;
}                                       

     
var transactionsByBlock = groupTransactionsByBlockAndAddEBBalance();
var tLast =  transactionsByBlock[ transactionsByBlock.length-1];
console.log("// this file is the output of /03_outputAnalysisAndConverters/outputConverter_03_ExtraOwnersToTXandBlock.js");
console.log("\n\n//---------------------\n// Transaction grouped BY BLOCK \n//---------------------");
console.log("// The extraBalance started on Block 1520860 (1 before the beginning) with already " + startWei + " WEI   or "+ web3.fromWei(startWei) + " ETH");
console.log("// at the end of the process on block " +  tLast.block + " the values were: ")
console.log("//                                   WEI\t\t\t\tETH")
console.log("// ExtraBalance extracted  balance:  " + tLast.bw1EBBal    + "\t\t" + web3.fromWei( tLast.bw1EBBal    ));
console.log("// ExtraBalance calculated balance:  " + tLast.bw2EBSum + "\t\t" + web3.fromWei( tLast.bw2EBSum ));
console.log("// ExtraBalance balance difference:  " + tLast.bw4Diffr  + "\t\t" + web3.fromWei( tLast.bw4Diffr  )); 

var firstProblem =  _.findWhere(transactionsByBlock, { "bw3Match": false })
console.log("\n//*** First Block that didn't match:  ", JSON.stringify(firstProblem,null,4) );

console.log("\n\nvar transactionsByBlock = [");
for (i in transactionsByBlock) console.log(JSON.stringify(transactionsByBlock[i],null,4) + ",");
console.log("]");  





















