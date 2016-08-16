// verifying that all 141 addresses that Nick has and BB doesn't are in fact contract Addresses

// run like this
// geth --exec "loadScript('G_analyzingNicks141ContractAddresses.js')" attach       



var pathToLibs = "/usr/local/lib/node_modules"    //"/Users/b/Documents/01_Works/20160721_EthereumDaoExtraBalanceOwners/node_modules"
loadScript(pathToLibs + "/underscore/underscore-min.js");

//loading the differences
var pathToOutput = "./../02_outputs/";


// ----------------------- STEP 1  - DETEMINE WHICH ARE CONTRACTS
/* after running this script we will understand that of the 141 addresses there is 1 that is NOT a contract: http://etherscan.io/address/0x99b743d1d9eff90d9a1934b4db21d519d89b4a38
// it's transaction to TheDAO was http://etherscan.io/tx/0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da on the last block
// and it represents the LAST valid transaction to theDAO during token creation period
// due to a small conditional misplacement in extraBalanceOwners.js it DID NOT INCLUDE IT,
// the best thing is to include its values by hand in theDAOExtraBalanceOwners object, but I'm letting STEP 2 calculate those values

//example normal address
// web3.eth.getCode("0x0015d5329a67e22ec78cca840e0a160fa0dc17b8")
//returns "0x"
// example contract address  
// web3.eth.getCode("0x01861c6dfab20bae0fa4ee698912630697d78ce4")
// returns: "0x3660008037602060003660003473273930d21e01ee25e4c219b63259d214872220a261235a5a03f21560015760206000f3"
// Warning: there is one case of a contract address that returns "0x" like it was not  http://etherscan.io/address/0x2b3ab2fdb0b9111d25ebd6724bd1b56c04b80796
function isContract(address) { 
	var code = web3.eth.getCode(address);
	return (code != "0x");
}


// 		contract,                                     //correctly not a contract                     //wrongly not a contract - but it is a contract
//var n141 = [["0x01861c6dfab20bae0fa4ee698912630697d78ce4", "1ETH"], ["0x99b743d1d9eff90d9a1934b4db21d519d89b4a38", "2ETH"], ["0x2b3ab2fdb0b9111d25ebd6724bd1b56c04b80796", "3ETH"] ]

 loadScript(pathToOutput + "ouptut_10_ComparingWithNick.txt");
 var n141 = addressesNickHas_BBDoesnt_full; 		//Array of Arrays [["0x01861c6dfab20bae0fa4ee698912630697d78ce4","280000000000000000001"],[...]]
 var n141AB = {} 	// will contain the balance and the transactions that produced that balance

 //load the EthParser
 loadScript("./../01_Parse/ethTraceParser.js")


function getNick140ContractAddresses() {
	for (var i = 0; i < n141.length; i++) {
		var a   = n141[i][0];
		var eth = n141[i][1];
		//console.log(i + " addr: " + a + " \t- isContract: " + isContract(a) + "\t- eth: " + eth );

		//since we know that 0x99b743d1d9eff90d9a1934b4db21d519d89b4a38 is not a contract and we are adding it by hand - skip this if you find it
		if (a == "0x99b743d1d9eff90d9a1934b4db21d519d89b4a38") continue;

		// create a version of this address and it's balance that is compatible with the Object Structure of my theDAOExtraOwners
		 n141AB[a] = {  
			address: a,
			totEth: eth,
			isContract: isContract(a)
		}
		// add the field .isContract if it is
		// IMPORTANT: among the 141 addresses there are 2 that the script doesn't classify as contracts
		// one is in fact NOT a contract, but the other it is, if you look at it in Etherscan         
		// for this unique case we are adding by hand the isContract variable because we know it is one (from Etherscan)
	   	// n141[82] = 0x99b743d1d9eff90d9a1934b4db21d519d89b4a38  // correctly NOT a contract   		http://etherscan.io/address/0x99b743d1d9eff90d9a1934b4db21d519d89b4a38
		// n141[29] = 0x2b3ab2fdb0b9111d25ebd6724bd1b56c04b80796  // false negative, it IS a contract  	http://etherscan.io/address/0x2b3ab2fdb0b9111d25ebd6724bd1b56c04b80796
		if ( a == "0x2b3ab2fdb0b9111d25ebd6724bd1b56c04b80796" && (n141AB[a].isContract == false) ) n141AB[a].isContract = true;
	}
}

// RUN IT
//getNick140ContractAddresses()

// originally found 2 addresses that are NOT contracts
//console.log(" verify >> 0x2b3ab2fdb0b9111d25ebd6724bd1b56c04b80796 should be a contract - isContract: " + (n141AB["0x2b3ab2fdb0b9111d25ebd6724bd1b56c04b80796"].isContract || false) )
//console.log(" verify >> 0x99b743d1d9eff90d9a1934b4db21d519d89b4a38 should NOT be a contract - isContract: " + (n141AB["0x99b743d1d9eff90d9a1934b4db21d519d89b4a38"].isContract || false) ) 
//console.log("verify problematic contract address: ", JSON.stringify( n141["0x2b3ab2fdb0b9111d25ebd6724bd1b56c04b80796"], null, 4))
  

//console.log("\n\n------------------\n nick141Addresses - with Nick balances \n------------------")
//console.log("var nick141Addresses = ", JSON.stringify(n141AB, null, 4))

*/  



//------------------------ STEP 2  - TRACE THE LAST TRANSACTION
/*// and extract the values that we can copy paste into theDAOExtraBalanceOwners full and simpleOwners
// we know the address http://etherscan.io/address/0x99b743d1d9eff90d9a1934b4db21d519d89b4a38 
// and the transaction http://etherscan.io/tx/0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da

var address = "0x99b743d1d9eff90d9a1934b4db21d519d89b4a38"
var txRef = "0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da";
var tx = web3.eth.getTransaction(txRef);
var tracedTX = extractExtraBalanceFromTXTrace(txRef); //use our own transaction parser parser 

// we know it's a new address so we copy paste what we do in extraBalanceOwners
var newDaoExtraOwner = {}
newDaoExtraOwner[address] = {
    address: address,
    balanceTot: web3.toBigNumber(tracedTX.ebWei),
    transactions: [{
        hash: txRef,
        ebWei: tracedTX.ebWei,
        type: tracedTX.txType,
        //time: tx.time,
    }]
} 
//create also the simpleOwners version  ie {"address":"0xbad9ab5fd55aff4a8aec47166e1a2894d68cc473","totETH":"6380952380952380953"}
var newSimpleOwner = {
	address: address,
	totETH: web3.toBigNumber(tracedTX.ebWei)   
}


console.log("\n\n------------------\n NEW NON-CONTRACT ADDRESS \n------------------") 
console.log("append these by hand in the proper files")
console.log(" newSimpleOwner - compact: " + JSON.stringify(newSimpleOwner,null,0)) 
console.log(" \n\nnewDaoExtraOwner - compact: " + JSON.stringify(newDaoExtraOwner,null,0))
console.log(" \n\nnewDaoExtraOwner - readable: " + JSON.stringify(newDaoExtraOwner,null,4))


/*------------------ OUTPUT PRODUCED BY STEP 2
newSimpleOwner - compact: {"address":"0x99b743d1d9eff90d9a1934b4db21d519d89b4a38","totETH":"8333333333333333334"}

newDaoExtraOwner - compact: {"0x99b743d1d9eff90d9a1934b4db21d519d89b4a38":{"address":"0x99b743d1d9eff90d9a1934b4db21d519d89b4a38","balanceTot":"8333333333333333334","transactions":[{"ebWei":"8333333333333333334","hash":"0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da","type":"direct"}]}}

newDaoExtraOwner - readable: {
    "0x99b743d1d9eff90d9a1934b4db21d519d89b4a38": {
        "address": "0x99b743d1d9eff90d9a1934b4db21d519d89b4a38",
        "balanceTot": "8333333333333333334",
        "transactions": [
            {
                "ebWei": "8333333333333333334",
                "hash": "0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da",
                "type": "direct"
            }
        ]
    }
}
*/
//*/




// ----------------------- STEP 3  - EXTRACT TRANSACTIONS FOR THE 140 ADDRESSES
// To extract the transactions from the 140 addresses
// we are going to use Nicks Method (retrieving all the DAO CreatedToken envents)
// https://github.com/Arachnid/extrabalance/blob/master/extrabalance.js
// also similar to BookyPoobahs https://github.com/bokkypoobah/TheDAOData/blob/master/getTheDAOCreatedTokenEventsWithNonZeroExtraBalance_v3
// with the difference that BPH is "watching" the contract and tracing the logs
// we could directly trace the transactions like we do in extraBalanceOwners, but here we want ONLY to find which transactions are to theDAO from those addresseses
// we will analyze those in another script or running the main extraBalanceOwners against those transactions too

///*------------------------------ STRUCTURE OF THE daoLogs
// 	daoLogs:  {
//		"requestManager": {
//			"provider": {
//				"host": "http://localhost:8545"
//			},
//			"polls": {},
//			"timeout": null
//		},
//		"options": {
//			"topics": [
//				"0xdbccb92686efceafb9bb7e0394df7f58f71b954061b81afb57109bf247d3d75a",
//				null
//			],
//				"address": "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
//				"fromBlock": "0x15ce2e",
//				"toBlock": "0x15ce38"
//		},
//		"implementation": {},
//		"filterId": null,
//			"callbacks": [],
//			"getLogsCallbacks": [],
//			"pollFilters": []
//}

////------------------------------ STRUCTURE OF each event you "get"
//results: [
//	{
//		"address": "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
//		"blockHash": "0x031d5bac6154ca7616ac62e966da2b50a0aaa1b3bc24958ed9cb52d8c8fc1e2f",
//		"blockNumber": 1429038,
//		"logIndex": 3,
//		"transactionHash": "0xc96b0f95a1e7e8c07cd488a05f20f9e8d4003fe8eea0ec7f7f4bf199af3198e1",
//		"transactionIndex": 9,
//		"event": "CreatedToken",
//		"args": {
//			"to": "0xb504e60998c6f354a0794abd91d85e8bc8436211",
//			"amount": "30000000000000000"
//		}
//	}
//]
//*/

loadScript(pathToOutput + "output_13_Nick140ContractAddresses.js"); // imports variable nick140Addresses
var n140 = nick140Addresses;
var extraLogs = []; //if the logs find addresses that are not in n140 we will store them here

//console.log("n140 flatten: " + JSON.stringify( Object.keys(n140),null,0));

// start and end blocks that generated extraBalance
var block1 = 1520861;
var blockLast =  1599205;

// some stats to see how much time it takes
var startTime, endtime, duration;
startTime = new Date();
var txCount = 0;

// convert the duration for the stats
function msToTime(duration) {
	var milliseconds = parseInt((duration % 1000) / 100),
		seconds = parseInt((duration / 1000) % 60),
		minutes = parseInt((duration / (1000 * 60)) % 60),
		hours = parseInt((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}


// we create the DAO contract
var abiArray = [{"constant":true,"inputs":[],"name":"extraBalance","outputs":[{"name":"","type":"address"}],"type":"function"}, {"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"CreatedToken","type":"event"}]
var daoAddress = '0xbb9bc244d798123fde783fcc1c72d3bb8c189413';
var theDao = web3.eth.contract(abiArray).at(daoAddress);

//log all "CreatedToken" events (which is a custom event made available by the ABI) between the 2 blocks
// it uses the contract.myEvent API https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events
// and the filters api to select only events beloging to the specific addresses https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter
// address: String - An address or a list of addresses to only get logs from particular account(s).
// the more blocks you put the longer it takes

// FOR DEV WE ARE GOING TO TRY ONLY 1 ADDRESS and it's unique TX
// that was done in block 1560028
//"0x01861c6dfab20bae0fa4ee698912630697d78ce4": {
//	"address": "0x01861c6dfab20bae0fa4ee698912630697d78ce4",
//		"balanceTot": "800000000000000000000",
//		"transactions": [
//		"0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3"
//	]
//},//

// unfortunately the filter API isn't working properly https://github.com/ethereum/web3.js/issues/332 - doesn't filter for single addresses
//var filterDev  = eth.filter({ fromBlock: 1560028,   toBlock: 1560029,      address: "0x01861c6dfab20bae0fa4ee698912630697d78ce4" })
//var filterFull = eth.filter({ fromBlock: block1,    toBlock: blockLast,    address: Object.keys(n140) });										
//var daoLogs = theDao.CreatedToken({}, { fromBlock: 1560028,   toBlock: 1560029,      address: "0x01861c6dfab20bae0fa4ee698912630697d78ce4" } );     //DEV
var daoLogs = theDao.CreatedToken({}, { fromBlock: block1,    toBlock: blockLast,    address: Object.keys(n140) } );   							// FULL
//console.log("\n\ndaoLogs: " + JSON.stringify(daoLogs, null, 4)); // to see the structure of an event log
   

// to get all past logs again we use the myEvent.get method
// uses the web3.eth.filter api for events https://github.com/ethereum/wiki/wiki/JavaScript-API#example-52
daoLogs.get(function(error,results) {
		if(error) {
			console.log("error: " + JSON.stringify(error))
		} else {
			//console.log("results: " + JSON.stringify(results, null, 4));//
			//found logs belonging to these addresses
			// store them in the n140 array
			// for now we are NOT interested in the amount since we will have to trace that transaction and extract from there the right values
			//console.log("---found " + results.length + " LOGS/Transactions - parsing them now ");
			results.forEach(function(r) {
				var a = r.args.to;
				//var wei = r.args.amount;
				var tx = r.transactionHash;
                 
				// unfortunately the filter API isn't working properly https://github.com/ethereum/web3.js/issues/332
				// it doesn't filter addresses, so we have to do it by hand to see if it's one of the 140 addresses
				if(n140[a] != undefined) {
					//it is of a known address - save the tx hash
					if (!n140[a].transactions)  n140[a].transactions = [];
					n140[a].transactions.push({ hash: r.transactionHash });
					txCount++;
				}
				/*	
				if(!n140[a]) {
					// it's a new address and a new transaction - store it in the other array
					// to see the differences and if the get() method retrieves things that don't belong to the address list passed as a filter
					extraLogs[a] = {
						address: a,
						//balanceTot: web3.toBigNumber(r.args.amount),
						transactions:[{ hash: r.transactionHash }]
					};

				} else {
					//it is of a known address - save the tx hash
					if (!n140[a].transactions)  n140[a].transactions = [];
					n140[a].transactions.push({ hash: r.transactionHash });
				} 
				*/
			});  
			 
			//PROCESS COMPLETE - output some stats
			endTime = new Date();
			duration = msToTime(endTime - startTime);
			var totN140Addresses = Object.keys(n140).length;
			console.log("\n\n------------------\n LOGS DONE \n------------------");
			console.log("RESULT - num of events logged: " + results.length + " - duration: " + duration);
			console.log("RESULT - num of Transactions belonging to the 140 addresses: " + txCount);
			//console.log("RESULT - num of previously known Addresses found: " + totN140Addresses);
			//console.log("RESULT - num of NEW addresses found: " + Object.keys(extraLogs).length);
		}
});

console.log("\n\n------------------\n 140 KNOWN SMART CONTRACT ADDRESSES  \n------------------");
console.log("var nick140Addresses = ", JSON.stringify(nick140Addresses, null, 4));

//console.log("\n\n------------------\n NEW FOUND ADDRESSES  \n------------------ " + Object.keys(extraLogs).length);
//console.log("var nickNewAddresses = ", JSON.stringify(extraLogs, null, 4));
















