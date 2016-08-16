// probably the 62 extra transactions that BB has and that Nick doesn't are caused by OutOfGas exeption
// this script parses, and traces all transactions of these addresses to see if they are in fact out of gas.
// then it eliminates them from the full list and from the simple owners
                                         
// there is currently no simple way to get if the transaction went out of gas, unless you trace it and read the last entry in the trace.structLogs

// Warning - there might be OTHER Addresses that are not in the 62 list, that have transactions with the out of gas exception
// so the main extraBalanceOwners.js script should incorporate a check for these cases and eliminate them, AGAIN

// run like this
// geth --exec "loadScript('E1_analyzingBBextraAddressesForOutOfGas.js')" attach


var pathToLibs = "/usr/local/lib/node_modules"    //"/Users/b/Documents/01_Works/20160721_EthereumDaoExtraBalanceOwners/node_modules"
loadScript(pathToLibs + "/underscore/underscore-min.js");

//loading the differences
var patToOutput = "./../02_outputs/";
loadScript(patToOutput + "ouptut_10_ComparingWithNick.txt");
var bbAddressesToVerify = addressesBBHas_NickDoesnt; // or addressesBBHas_NickDoesnt_full 

//loading my full owners
loadScript(patToOutput + "output_9-CORRECT3_OwnersFull.txt"); // imports the var theDAOExtraOwners




/* conveniente wrapper to define if it is out of gas or not
* it can accept the string of the transaction hash OR directly the trace object
*
* //testing with a string  0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1
* var test1 = isOutOfGas("0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1")
* console.log("test1 - string: " + test1) 
* 
* //testing with a Tx Traced
* var txTrace = debug.traceTransaction("0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1")
* var test2 = isOutOfGas(txTrace); 
* console.log("test2 - object: " + test2)
*/
function isOutOfGas(tx) {
	//console.log("typeof tx " + typeof(tx))
	var sl;
	if (typeof(tx) == "string") {
		//it' a string - then you need to trace the transaction
		var txTrace = debug.traceTransaction(tx);
		sl = txTrace.structLogs
	
	} else if (typeof(tx) == "object" && tx.structLogs != undefined) {
		//it already a trace transaction - simply check the last 
		sl = tx.structLogs
	}
	var lastLog = sl[ sl.length -1 ];
	var test =  (lastLog.error == "Out of gas")
	//console.log("tx " + tx + " is OUT OF GAS " + test);
	return test
}  



// parses the main theDaoExtraTransactions once and outputs the totals 
// total eth and  total transactions count
// as well as reduces theDAOExtraOwners to a simple list of  owner: balance 
function getTotals(){
	var owners = Object.keys(theDAOExtraOwners);
	var ownersSimple = [];
	var totETH = web3.toBigNumber(0);
	var totTXs = 0;
	for (o in theDAOExtraOwners) {
	   //create the simple owner version of this address
		ownersSimple.push({
            address: theDAOExtraOwners[o].address,
            totETH: theDAOExtraOwners[o].balanceTot
        })
		//add it's value to totETH
		totETH = totETH.add( web3.toBigNumber( theDAOExtraOwners[o].balanceTot) )
		// add the transaction count
		totTXs +=  theDAOExtraOwners[o].transactions.length;
	} 
	return {
		simpleOwners: ownersSimple,
		eth: totETH.div(1e18),            
		transactions: totTXs,
		addresses: Object.keys(theDAOExtraOwners).length,
	}
}



//---------------- RUN ------------------
// loop through the 62 addresses that BB has and Nick hasn't
// and determine if all of it's transactions are out of gas ,if they are, eliminate them from the output theDAOExtraOwners 
var bbAddressesToVerifyAndTxs = []
function getOutOfGas(){
	for (var i = bbAddressesToVerify.length-1; i >= 0; i-- ) {  //we are splicing > start from the last element
	//for (var i=2; i < 4; i++) {   
		var a = bbAddressesToVerify[i]; 
		var txs = theDAOExtraOwners[a].transactions;
		//console.log("\n a: " +a + " - txs: " + txs.length);
		for (var t = txs.length-1; t >= 0; t--) {
			var tx = txs[t].hash;
			//console.log(t + " -  tx: " + tx)
			if ( isOutOfGas(tx) ) {	
				//console.log(t + " -  tx: " + tx + "   - OUT OF GAS");
				//remove it from the transactions array
				txs.splice(t, 1)
			}
		} 
		//console.log("tx left: " + txs.length)
		//TODO - if the txs is empty - remove the address altogether
		if (txs.length == 0) {
			//console.log("delete address 1 theDaoExtraOwners: " + Object.keys(theDAOExtraOwners).length + "  bbAddressesToVerify: " + bbAddressesToVerify.length) 
		    delete theDAOExtraOwners[a]   
			bbAddressesToVerify.splice(i, 1);
			//console.log("delete address 2 theDaoExtraOwners: " + Object.keys(theDAOExtraOwners).length + "  bbAddressesToVerify: " + bbAddressesToVerify.length)
		} else {
			// there is still a transaction - record the AddresstoVerify with it's own transaction
			//console.log("--- Still some transactions - adding them to bbAddressesToVerifyAndTxs"); 
			bbAddressesToVerifyAndTxs.push (theDAOExtraOwners[a]);
		}
	}
}



getOutOfGas()

var totals = getTotals();
console.log("\n\n------------------\n STATS \n------------------");
console.log("after having removed all out of gas transactions we are left with: ");
console.log("tot Addresses:    " + totals.addresses);
console.log("tot ETH:          " + totals.eth);
console.log("tot transactions: " + totals.transactions);


console.log("\n\n//------------------\n// addresses left in bbAddressesToVerify: " + bbAddressesToVerify.length + "\n//------------------");
console.log("var bbAddressesToVerify = " + JSON.stringify(bbAddressesToVerify, null, 0)); 
console.log("\n\nvar bbAddressesToVerifyAndTxs = " + JSON.stringify(bbAddressesToVerifyAndTxs, null, 4));



console.log("\n\n------------------\n SIMPLE OWNERS \n------------------")
console.log("var simpleOwners = ", JSON.stringify(totals.simpleOwners, null, 0)); 
     

console.log("\n\n------------------\n FULL OWNERS + TRANSACTIONS \n------------------")
console.log("var theDAOExtraOwners = ", JSON.stringify(theDAOExtraOwners, null, 0))











