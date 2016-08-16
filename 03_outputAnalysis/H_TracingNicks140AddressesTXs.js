// after having extracted the transactions for each of the 140 addresses into the file output_14_140SmartContractsWithTXS.txt
// we now proceed to trace all of them and extract the right balance that went to the extraBalance.

// we are doing this step in another file, rather than in the same script that retrieves the event logs, because we want to analyze by hand the transaction stacks
// for that reason, run it like this, so that at the end of the process you have an interactive console to play with the results and save the results by hand
//	$ geth attach
//and inside the geth console
//	> loadScript("H_TracingNicks140AddressesTXs.js"); 

//or - for the non interactive version
// geth --exec "loadScript('H_TracingNicks140AddressesTXs.js')" attach	 
	
	
// all CALL functions that are not to TheDAO, no matter what transaction have hashfunction == "b61d27f6" 
// which from this gist https://gist.github.com/CJentzsch/f28933cd47a2696a57f1 
// appears to be the hash of the execute function 
// b61d27f6: execute(address,uint256,bytes)
// we can check it like this in 
// web3.sha3('execute(address,uint256,bytes)').substring(0,10) 
// as pointed out by Bokkypoobah https://github.com/bokkypoobah/TheDAOData/issues/1
// "is the amount that is transferred by the wallet contract execute(...) function." 
	
	
var pathToLibs = "/usr/local/lib/node_modules"    //"/Users/b/Documents/01_Works/20160721_EthereumDaoExtraBalanceOwners/node_modules"
loadScript(pathToLibs + "/underscore/underscore-min.js");

	
//load the Addresses and the transactions
var pathToOutputs = "./../02_outputs/";
loadScript(pathToOutputs + "output_14_140SmartContractsWithTXS.txt") 	// imports variable nick140Addresses   
var n140 = nick140Addresses;
                  
// interactive object to read the traces in the console
var txTraces = {}
var txCalls = {}                                      

//* dev purposes only
var n140 = {
"0x050f81ae80a07542a70bb52f15895e347164f867": {
    "address": "0x050f81ae80a07542a70bb52f15895e347164f867",
    "isContract": true,
    "nickEth": "18666666666666666667",
    "transactions": [
        {
            "hash": "0x694d35e8cacd209636e042e09681491ee82f15424e55db1e23fe7146af2337ad"
        }
    ]
},
"0x05a8f364c1748b248c6e170d131bed179382e037": {
    "address": "0x05a8f364c1748b248c6e170d131bed179382e037",
    "isContract": true,
    "nickEth": "1850000000000000001",
    "transactions": [
        {
            "hash": "0xe232cb770649b64ed6bcd689f397bd2cebb8f21db5e07f1dee505f982d03c705"
        },
        {
            "hash": "0x2df462694c1d54a5d6b7c97ca0a8d3e14fa6fb608f494526805c9e81e687f846"
        },
        {
            "hash": "0x5af9314571577cba996c57ea3a1500d6272a87695e13654dd2bef50291fc984b"
        }
    ]
},
} 
//*/

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
    
/*
if the address is a smart contract it might have more than one call function
one is the smart contract's own function and the second is the one to theDAO.
Also, if the user passes an input data the first element of the stack will be that inputData and all function hashes will be moved down the stack 1 index
so this function searches through all CALL functions and selects the right one to theDAO and returns it
if it finds also an inputData it will return that too at the index 0
*/
function getDaoCall(txTrace) {
	//find all CALL functions - since these are smart contracts they will have more than one
	// one call to the smart contract's own function, and another to the DAOs smart contract createToken function
	var txCallsArr = _.where( txTrace.structLogs, {"op": "CALL"});
	console.log("found " + txCallsArr.length + " CALL functions")
	
	var returnCall;  
	
	txCallsArr.forEach(function (c) { 
   		var s = c.stack;
   		var s0 = s[0].substring(56);
   		var s1 = s[1].substring(56);
   		
   		// the 2 func hashes to find
		// they can be at index 0 or index 1 if the user has passed an input data
   		var f1 = "baac5300";
   		var f2 = "00000966";

		//a way to automatically select the right index -but it's useless if we don't use it later
   		//var selS0 = (s0 == f1 || s0 == f2 ) ? 0 : undefined;
   		//var selS1 = (s1 == f1 || s1 == f2 ) ? 1 : undefined;
   		//var selIndx = (selS0 != undefined) ? selS0 : selS1;
   		//console.log(t + " s0: " + s0 + " \ts1: " + s1 + " \tselIndx: " + selIndx);
   		//if(selIndx != undefined) {  
		 
		//if either one of the func hashes we are looking is either in the first or second stack position
		//this CALL is the right one - return it with also the inputData if there is one
   		if ((s0 == f1 || s0 == f2 ) || (s1 == f1 || s1 == f2 ) ){ 
	  	    //console.log("returning C: " + JSON.stringify(c, null,4))
   			returnCall = c     			
   		} 
     });  
		return returnCall
}
    
// uses getDaoCallStack
function trace140Addresses_v2() {
	 //loop through each owner
	for (o in n140) {
		var txs = n140[o].transactions
		console.log("\n\no: " + o + " txs: " + txs.length);	

		//loop through each transaction of that owner
		for (var t = txs.length-1; t >= 0; t--) {
			//trace the transaction + store it in an object that you can interactively query 
			var txHash = txs[t].hash
			var txTrace = debug.traceTransaction( txHash );
			txTraces[ txHash ] = txTrace;
			txCalls[ txHash ] = [];
			//console.log("txTraces[t.hash]: " + JSON.stringify(txTraces[t.hash],null,4))

			// if it's an outof gas remove it from the list and go onto the next
			if (isOutOfGas( txTrace )) {
				console.log("tx " + txHash + " is OUT OF GAS")
				txs.splice(t, 1);
				continue
			}
            
			//there might be more than one CALL function - find the one that has the appropriate funcHashes
			var c = getDaoCall(txTrace);
			//console.log("c: " + JSON.stringify(c, null, 4));
			

			// loop through all of the CALL function to find the ones that are to the dao
			// by looking at the the DAO known func hashes either in the first s0 or second s1 position of the stack 
			// == "baac5300" (proxy) or "00000966" (direct)
			//txCallsArr.forEach(function (c) {
            if(c != undefined) {
	
				// record this Transaction Call in the interactive array				
				txCalls[ txHash ].push(c);

				//var s = c.stack;
				//var s0 = s[0].substring(56);
				//var s1 = s[1].substring(56);
                //
				//// the 2 func hashes to find and a way to automatically select the right index
				//var f1 = "baac5300";
				//var f2 = "00000966";
				//var selS0 = (s0 == f1 || s0 == f2 ) ? 0 : undefined;
				//var selS1 = (s1 == f1 || s1 == f2 ) ? 1 : undefined;
				//var selIndx = (selS0 != undefined) ? selS0 : selS1;
				//console.log(t + " s0: " + s0 + " \ts1: " + s1 + " \tselIndx: " + selIndx);
                                 

				var selIndx = getFuncHashIndex(c, ["baac5300", "00000966"])

				if(selIndx != undefined) {
					//we found a DAO function at c.stack[selIndx] - now record it's values
					var funcHash = s[selIndx].substring(56);
					console.log("funcHash: " + funcHash);

					var address, weiToExtraBalance, creationType;
					if (funcHash == "baac5300") {
				       //************* PROXIED TRANSACTION > VARIABLE POSITIONS IN THE stack (determined empirically) ******************
				       // funcHash            = stack[0].substring(56);                     // baac5300
				       // END_USER_ADDRESS    = "0x" + stack[2].substring(24);              // e300e1c3af964cf3ed089c7171c6145db05ea199
				       // WEI_TO_EXTRABALANCE = web3.toBigNumber(stack[6]);                 // 91db92276747f5556
				       // EXTRABAL_ADDRESS    = "0x" + stack[stack.length-2].substring(24); // 807640a13483f8ac783c557fcdf27be11ea4ac7a
				          creationType = "proxy";
				          address = "0x" + s[2+selIndx].substring(24);
				          weiToExtraBalance = web3.toBigNumber("0x" + s[6+selIndx]);
				          console.log("---- PROXY TRANSACTION for address: " + address + "    - wei amount: " + weiToExtraBalance);


				     } else if (funcHash == "00000966") {
				       //************* DIRECT TRANSACTION >> VARIABLE POSITIONS IN THE stack (determined empirically)******************
				       // funcHash            = stack[0].substring(56);                     // 00000966
				       // END_USER_ADDRESS    = "0x" + stack[3].substring(24);              // 0x2d5f0e392e90043ed2dbd57605b7534a169ae62e
				       // WEI_TO_EXTRABALANCE = web3.toBigNumber(stack[stack.length-3]);    // 2e426101834d5556"
				       // EXTRABAL_ADDRESS    = "0x" + stack[stack.length-2].substring(24); // 807640a13483f8ac783c557fcdf27be11ea4ac7a
				          //console.log("---- DIRECT TRANSACTION")
				          creationType = "direct";
				          address = "0x" + s[3+selIndx].substring(24);
				          weiToExtraBalance = web3.toBigNumber("0x" + s[s.length-(3+selIndx)]);
				          console.log("---- DIRECT TRANSACTION for address: " + address + "    - wei amount: " + weiToExtraBalance);

				     }

					// register these values in the Transaction object of n140
					var tt = n140[o].transactions[t];
					tt.ebWei = weiToExtraBalance;
	                tt.type = creationType;

					//add the balance to the total   
					if (n140[o].balanceTot == undefined) { n140[o].balanceTot = web3.toBigNumber( weiToExtraBalance ) 
					} else { n140[o].balanceTot = web3.toBigNumber( n140[o].balanceTot ).add( weiToExtraBalance ); }


				}
			  }  
			//});
		} 
	}
}


trace140Addresses_v2();
/*
function trace140Addresses_v1() {
	 //loop through each owner
	for (o in n140) {
		var txs = n140[o].transactions
		console.log("\n\no: " + o + " txs: " + txs.length);	

		//loop through each transaction of that owner
		for (var t = txs.length-1; t >= 0; t--) {
			//trace the transaction + store it in an object that you can interactively query 
			var txHash = txs[t].hash
			var txTrace = debug.traceTransaction( txHash );
			txTraces[ txHash ] = txTrace;
			txCalls[ txHash ] = [];
			//console.log("txTraces[t.hash]: " + JSON.stringify(txTraces[t.hash],null,4))

			// if it's an outof gas remove it from the list and go onto the next
			if (isOutOfGas( txTrace )) {
				console.log("tx " + txHash + " is OUT OF GAS")
				txs.splice(t, 1);
				continue
			}

			//find all CALL functions - since these are smart contracts they will have more than one
			// one call to the smart contract's own function, and another to the DAOs smart contract createToken function
			var txCallsArr = _.where( txTrace.structLogs, {"op": "CALL"});
			console.log("t: " + t + " - hash: " + txs[t].hash + " - found " + txCallsArr.length + " CALL functions")   
			//console.log("txCallsArr: " + JSON.stringify(txCallsArr,null,4))

			// loop through all of the CALL function to find the ones that are to the dao
			// by looking at the the DAO known func hashes either in the first s0 or second s1 position of the stack 
			// == "baac5300" (proxy) or "00000966" (direct)
			txCallsArr.forEach(function (c) {

				// record this Transaction Call in the interactive array				
				txCalls[ txHash ].push(c);

				var s = c.stack;
				var s0 = s[0].substring(56);
				var s1 = s[1].substring(56);

				// the 2 func hashes to find and a way to automatically select the right index
				var f1 = "baac5300";
				var f2 = "00000966";
				var selS0 = (s0 == f1 || s0 == f2 ) ? 0 : undefined;
				var selS1 = (s1 == f1 || s1 == f2 ) ? 1 : undefined;
				var selIndx = (selS0 != undefined) ? selS0 : selS1;
				console.log(t + " s0: " + s0 + " \ts1: " + s1 + " \tselIndx: " + selIndx);

				if(selIndx != undefined) {
					//we found a DAO function at c.stack[selIndx] - now record it's values
					var funcHash = s[selIndx].substring(56);
					console.log("funcHash: " + funcHash);

					var address, weiToExtraBalance, creationType;
					if (funcHash == "baac5300") {
				       //************* PROXIED TRANSACTION > VARIABLE POSITIONS IN THE stack (determined empirically) ******************
				       // funcHash            = stack[0].substring(56);                     // baac5300
				       // END_USER_ADDRESS    = "0x" + stack[2].substring(24);              // e300e1c3af964cf3ed089c7171c6145db05ea199
				       // WEI_TO_EXTRABALANCE = web3.toBigNumber(stack[6]);                 // 91db92276747f5556
				       // EXTRABAL_ADDRESS    = "0x" + stack[stack.length-2].substring(24); // 807640a13483f8ac783c557fcdf27be11ea4ac7a
				          creationType = "proxy";
				          address = "0x" + s[2+selIndx].substring(24);
				          weiToExtraBalance = web3.toBigNumber("0x" + s[6+selIndx]);
				          console.log("---- PROXY TRANSACTION for address: " + address + "    - wei amount: " + weiToExtraBalance);


				     } else if (funcHash == "00000966") {
				       //************* DIRECT TRANSACTION >> VARIABLE POSITIONS IN THE stack (determined empirically)******************
				       // funcHash            = stack[0].substring(56);                     // 00000966
				       // END_USER_ADDRESS    = "0x" + stack[3].substring(24);              // 0x2d5f0e392e90043ed2dbd57605b7534a169ae62e
				       // WEI_TO_EXTRABALANCE = web3.toBigNumber(stack[stack.length-3]);    // 2e426101834d5556"
				       // EXTRABAL_ADDRESS    = "0x" + stack[stack.length-2].substring(24); // 807640a13483f8ac783c557fcdf27be11ea4ac7a
				          //console.log("---- DIRECT TRANSACTION")
				          creationType = "direct";
				          address = "0x" + s[3+selIndx].substring(24);
				          weiToExtraBalance = web3.toBigNumber("0x" + s[s.length-(3+selIndx)]);
				          console.log("---- DIRECT TRANSACTION for address: " + address + "    - wei amount: " + weiToExtraBalance);

				     }

					// register these values in the Transaction object of n140
					var tt = n140[o].transactions[t];
					tt.ebWei = weiToExtraBalance;
	                tt.type = creationType;

					//add the balance to the total   
					if (n140[o].balanceTot == undefined) { n140[o].balanceTot = web3.toBigNumber( weiToExtraBalance ) 
					} else { n140[o].balanceTot = web3.toBigNumber( n140[o].balanceTot ).add( weiToExtraBalance ); }


				}
			});
		} 
	}
}
*/

console.log("\n\n------------------\n n140 FULLY traced \n------------------")  
console.log("in interactive version you can check the values of txCalls or the full txTraces");
console.log("var nick140Addresses = " + JSON.stringify(n140, null, 4));
         
//console.log("\n\n access the Calls with the transaction hash like this >> txCalls['0x694d35e8cacd209636e042e09681491ee82f15424e55db1e23fe7146af2337ad'] ") 
//txCalls['0x694d35e8cacd209636e042e09681491ee82f15424e55db1e23fe7146af2337ad'] 








