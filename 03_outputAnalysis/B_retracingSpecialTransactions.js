//trace and analyze the special transactions that were not registered as either "direct" or "proxy" 

// run like this
// geth --exec "loadScript('B_retracingSpecialTransactions.js')" attach


var pathToLibs = "/usr/local/lib/node_modules"    //"/Users/b/Documents/01_Works/20160721_EthereumDaoExtraBalanceOwners/node_modules"
loadScript(pathToLibs + "/underscore/underscore-min.js");

var pathToOutput = "./../02_outputs/";
loadScript(pathToOutput + "output_7Transactions-special.txt"); //loads one variable txs_special

//load the ethParser script to use the extractExtraBalanceFromTXTrace(tx)
loadScript("./../01_Parse/ethTraceParser.js"); 

var txs_special_full = [];
      
function logAllInputData(){ 
	 for (i = 0; i< txs_special.length; i++) {
		 var txRef = txs_special[i].hash; 
		 var tx = web3.eth.getTransaction(txRef)
	}
}
       

function traceAllTransactions() {
   for (i = 0; i< txs_special.length; i++) {
	//for (i = 0; i< 2; i++) {
   	 var txRef = txs_special[i].hash; 
   	 var tx = web3.eth.getTransaction(txRef)
   	 //var txTrace = debug.traceTransaction(txRef)
   	 var tracedTX = extractExtraBalanceFromTXTrace(txRef);
     
 	 // add the reference for this special transaction
	 tracedTX.hash = txRef;
	
   	 if(tracedTX != undefined) {
		txs_special_full.push(tracedTX)
	 }
   }
}


 

//-------------------------- OUTPUTS
//console.log("\n\n------------------- TX INPUT DATA --------------- ");
//logAllInputData();


traceAllTransactions();
console.log("\n\n------------------- RETRACED SPECIAL TRANSACTIONS --------------- ");
console.log("txs_special_full = ", JSON.stringify(txs_special_full, null, 4));


  

/* BY HAND
var txIndex = 29
var txRef = txs_special[txIndex].hash				
var txo = web3.eth.getTransaction(txRef)
var txTrace = debug.traceTransaction(txRef)
var txCall = _.findWhere( txTrace.structLogs, {"op": "CALL"});
var s = txCall.stack 
var funcHash = s[0].substring(56);
      
if ((funcHash != "baac5300" || funcHash != "00000966") && (s[1] == "baac5300" || s[1] == "00000966") ) {
	s.shift();
	funcHash = s[0].substring(56);
	console.log("FOUND SPECIAL TX - funcHash: " + funcHash)
}

//FUNC is what is different
var address = "0x" + s[4].substring(24)    

*/
