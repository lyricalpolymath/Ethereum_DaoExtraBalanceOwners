/**
* looking for the 39 missing transactions
* if you look at the stats of the output_2Stats.txt file you will see that there are 39 "missing" transactions
* that are neither direct nor proxied
* "transactions": 23848,
* "transactions_direct": 15657,
* "transactions_proxied": 8152,
*
* transactions_direct + transactions_proxied = 23.809   not 23.848  like transactions says
*
* this script parses theDAOExtraOwners that has all the transactions
* counts them, and looks for transactions that are neither direct nor proxied.
*
* SOLUTION: it turns out that in these 39 transactions the user added an inputData to the transaction
* that, when tracing it, would mess up the index of the stack in the CALL function stack.
* therefore the script could not exctract the variables such as the owner address, the wei value and the type of transaction (proxied or direct).
* If you scroll at the bottom of theDAOExtraOwners, you will see that there is an "undefined" addess key, that contains 39 transactions with only the hash, no address, nor eth, nor wei.
*
* unfortunately on the main script
* I didn't output to console theDAOExtraTransactions so I have to do it again now
*
* run like this
* geth --exec "loadScript('A_finding31MissingTransactions.js')" attach  
*   
*
*	EXAMPLE OF 1 FULL OWNER
*	
*	var theDAOExtraOwners = {
*		"0x0000000000015b23c7e20b0ea5ebd84c39dcbe60":
*			{
*	 		"address":"0x0000000000015b23c7e20b0ea5ebd84c39dcbe60",
*			"balanceTot":"1304347826086957",
*			"transactions":[
*	  			{
*				"ebWei":"1304347826086957",
*				"hash":"0x0ad78201811a6dbe74f9e6510282f2b887f5c04201be559e073584842bec6360",
*				"type":"proxy"
*				}
*			]
*			}
*	}
*/
  
var pathToLibs = "/usr/local/lib/node_modules"    //"/Users/b/Documents/01_Works/20160721_EthereumDaoExtraBalanceOwners/node_modules"
loadScript(pathToLibs + "/underscore/underscore-min.js");

var pathToOutput = "./../02_outputs/";
loadScript(pathToOutput + "output_4OwnersFull.txt");

var deo = theDAOExtraOwners 
var totOwners = Object.keys(theDAOExtraOwners).length 
console.log("totOwners = " + totOwners);

var txs = []; 
var txs_special = [];
var txs_proxy = [];
var txs_direct = [];

for (o in deo) {
	 var ow = deo[o]; 
	 ow.transactions.forEach(function(t) {
			// push the transaction hash
			txs.push(t.hash);
			
			//search for the special ones
			//if(t.type != "proxy" || t.type != "direct") {
			//	txs_special.push(t);
			//	console.log("\nfound special tx: " + JSON.stringify(t, null, 4))
			//}
			if (t.type == "proxy") txs_proxy.push(t.hash)
			else if (t.type == "direct") txs_direct.push(t.hash)
			else {
				//console.log("\nfound special tx: " + JSON.stringify(t, null, 4))
				txs_special.push(t);
			}
	 })
}
      

console.log("\n\n\n--------------------------------------- DONE ------------------------"); 
var totTxs   = txs.length;                     // 23848
var totDir 	 = txs_direct.length;              // 15657
var totProxy = txs_proxy.length;               // 8152
var totSpec	 = txs_special.length;             // 39
var totVerified = (totTxs == (totDir + totProxy + totSpec))	// should be TRUE

console.log("tot txs: " 	+ totTxs    )
console.log("direct txs: " 	+ totDir 	)
console.log("proxy txs: " 	+ totProxy  )
console.log("special txs: " + totSpec	)
console.log(" verifying tot == direct+proxy+special? : " + totVerified)



console.log("\n\n------------------ SPECIAL TRANSACTIONS - found: " + txs_special.length + "------------------ ");
//console.log("txs_special = " + JSON.stringify(txs_special, null, 4));
                        


console.log("\n\n------------------ ALL TRANSACTIONS - found: " + txs.length + "------------------ ");
//console.log("daoTransactions = " + JSON.stringify(txs, null, 0));        
























