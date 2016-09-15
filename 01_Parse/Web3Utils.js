/**
  Web3Utils
  utilities for parsing the Ethereum Blockchain with Geth (Go client)

  requires and loads the underscorejs library
  the best thing is that you install it globally with
  		$ npm install -g underscore
  which doesn't require you to modify the pathToLibs

  OR you can download it from https://raw.githubusercontent.com/jashkenas/underscore/master/underscore-min.js"
  and modify the pathToLibs to point to the directory where you have the library

  USAGE:
  load it into the file you want to use these functions

 Copyright (C) 2016  Beltran Berrocal <b25zero1@gmail.com> <@lyricalpolymath>
 https://github.com/lyricalpolymath/Ethereum_DaoExtraBalanceOwners

 LICENCE (GNU AGPL)
 This file is part of Web3Utils library.

 Web3Utils is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License (AGPL) as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Web3Utils is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU AGPL General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with Web3Utils.  If not, see <https://www.gnu.org/licenses/agpl.txt>.

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
 <http://www.gnu.org/licenses/

*/



var pathToLibs = "/usr/local/lib/node_modules";
//loadScript(pathToLibs + "/underscore/underscore-min.js");
//loadScript("/usr/local/lib/node_modules/underscore/underscore-min.js");

Web3Utils = {};


/* find if a transaction is out of gas or not 
* @param		- String or Object > it can accept the string of the transaction hash OR directly the trace object
* @return 		- Boolean - true if the transaction is out of gas or false
*
* example usages:
* //testing with a string  0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1
* var test1 = isOutOfGas("0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1")
* console.log("test1 - string: " + test1) 
* 
* //testing with a Tx Traced
* var txTrace = debug.traceTransaction("0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1")
* var test2 = Web3Utils.isOutOfGas(txTrace);
* console.log("test2 - object: " + test2)
*/
Web3Utils.isOutOfGas = function (tx) {
	console.log("Web3Utils.isOutOfGas - typeof tx " + typeof(tx));
	var sl;
	if (typeof(tx) == "string") { 
		console.log("Web3Utils.isOutOfGas - string - trace the transaction")
		//it' a string - then you need to trace the transaction
		var txTrace = debug.traceTransaction(tx);
		sl = txTrace.structLogs
	
	} else if (typeof(tx) == "object" && tx.structLogs != undefined) {
		//it already a trace transaction - simply check the last 
		sl = tx.structLogs
	}
	// usually the last log will be the out of gas exeption and the computation will halt
	// but there are rare cases like this http://etherscan.io/tx/0x2309d07a0eaf811d0b68c9cc9e28843a775ba288475f623940ba6cff51d771da
	// where the out of gas error will appear before the last log (in this case at index at index 366 of the structLogs)
	// and the computation seems to keep carrying on (untill the last index which in this case is 578 with a RETURN CALL)
	// therefore we look for any "error" which matches the "out of gas"
	//var lastLog = sl[ sl.length -1 ];
	//return (lastLog.error == "Out of gas");
	for(var i=0; i < sl.length; i++) {
		if (sl[i].error == "Out of gas") {
			console.log("Web3Utils.isOutOfGas - found out of gas in index: " +i)
			return true;
		}	
	}
	return false 
};


//TODO - isContract - find a definitive way to find if it is a contract
/**
 * returns if a given address is a contract or not
 * WARNING: DO NOT USE! the function is not complete and there are some special cases that yield false negatives
 * (addresses that are contracts will be returned as false)
 * like in this case http://etherscan.io/address/0x2b3ab2fdb0b9111d25ebd6724bd1b56c04b80796
 *
 * @param address		{String} of the address reference
 * @returns {boolean}
 *
 * examples - normal address
 * web3.eth.getCode("0x0015d5329a67e22ec78cca840e0a160fa0dc17b8")
 * returns "0x"
 *
 * examples - contract address
 * web3.eth.getCode("0x01861c6dfab20bae0fa4ee698912630697d78ce4")
 * returns: "0x3660008037602060003660003473273930d21e01ee25e4c219b63259d214872220a261235a5a03f21560015760206000f3"
 *  BUT this
 *  web3.eth.getCode("0x2b3ab2fdb0b9111d25ebd6724bd1b56c04b80796")
 *  will return "0x" in spute of being an address
 */
Web3Utils.isContract = function(address) {
	var code = web3.eth.getCode(address);
	return (code != "0x");
};




/* get all errors if any 
* this will take longer than Web3Utils.isOutOfGas() since it will read all logs, while isOutOfGas will return as soon as it finds the first one
* @param		- String or Object > it can accept the string of the transaction hash OR directly the trace object
* @return 		- Boolean - false if no errors where found
*				- String  - if it finds only one error it will return it as a string
*				- Array   - if it finds more than one error it will return all of them in an array
*
* example usages:
* //testing with a string  0x2309d07a0eaf811d0b68c9cc9e28843a775ba288475f623940ba6cff51d771da
* var txErrors1 = Web3Utils.getTXErrors("0x2309d07a0eaf811d0b68c9cc9e28843a775ba288475f623940ba6cff51d771da")
* 
* //testing with a Tx Traced
* var txTrace = debug.traceTransaction("0x2309d07a0eaf811d0b68c9cc9e28843a775ba288475f623940ba6cff51d771da")
* var txErrors2 = Web3Utils.getTXErrors(txTrace);
*/
Web3Utils.getTXErrors = function(tx) {
	var sl;
	if (typeof(tx) == "string") {
		//it' a string - then you need to trace the transaction
		var txTrace = debug.traceTransaction(tx);
		sl = txTrace.structLogs
	
	} else if (typeof(tx) == "object" && tx.structLogs != undefined) {
		//it already a trace transaction - simply check the last 
		sl = tx.structLogs
	}
	
	var errors = []; 
	//could do it faster with  errors = _.compact(_.pluck(sl, "error"))
	for(var i=0; i < sl.length; i++) {
		if(sl[i].error != "") errors.push( sl[i].error ) 
	} 
  
	if 		(errors.length == 0) return false;
	else if (errors.length == 1) return errors[0];
	else if (errors.length > 1)  return errors;		
};
 
 

/**
 * get CALL object with given func hashes
 * get from the stack the CALL object that contain the funcHashes you are looking for
 * @param txTrace	- the transaction Trace found with debug.traceTransaction
 * @param funcHash  - can be a String or an Array of Strings, so that you can look for more than one function at the same time
 * @return Object 	- the Call object that contains the stack with the functions hashes you are looking for
 *
 * we search in s0 or s1 because if the user gives an inputData to the transaction, it will appear in s0 and the funcHash in s1
 * but if the user leaves an empty inputData, the funcHash will appear in s0
 *
 * usage examples
 * var txCall = Web3Utils.getCallWithFuncHash(txTrace, "baac5300")   				// look for the CALL that contains the string "baac5300"
 * var txCall = Web3Utils.getCallWithFuncHash(txTrace, ["baac5300","00000966"] )    // loof for the CALL that contains any of the strings in s0 or in s1
 */
Web3Utils.getCallWithFuncHash = function(txTrace, funcHash) {
	var txCallsArr = _.where( txTrace.structLogs, {"op": "CALL"});
	for (var i = txCallsArr.length-1; i >= 0; i--) {
		var call = txCallsArr[i];
		var s = call.stack;
		var s0 = s[0].substring(56);
		var s1 = s[1].substring(56);
		
		//funcHash is a string - test and return the call if you find it
		if (typeof(args) == "string" && (s0 == funcHash || s1 == funcHash)) {
			return call
		
		} else if (typeof(funcHash) == "object") { 
			//the funcHash is an array of funcHashes to look for
			//_.some returns true if any of the funcHashes are contained either in s0 or s1
			if (_.some(funcHash, function(fn){ return (s0 == fn || s1 == fn)} ) ){
				return call
			}
		}     
	}	
	return undefined 
};

        

//TODO - getCallWithAddress - returns the CALL in the stack that sends balance to a specific address
// use this if you don't know the function hashes that you'd be looking for with  Web3Utils.getCallWithFuncHash
//Web3Utils.getCallWithAddress = function(txTrace, address)


/**
* get Function Hash Index
* retrieves the index in the stack of the first occurrance of the funcHashes passed. 
* Reason: if the user has given an inputData with the transaction, the funcHash will be at index1 instead or index0
* and also the subsequent position of the parameters in the stack (the address, the wei amount, etc) changes from function to function
* so the index is used to easily write once the code for each function and simply shift the stack index if there is or not an inputData in the transaction
* @param call		- Object - the CALL object retrieved with  getCallWithFuncHash
* @param funcHash   - can be a String or an Array of Strings, so that you can look for more than one function at the same time 
* @return 			Int - returns the index number, wither 0 o 1
*
* usage examples
* var indx = getFuncHashIndex(c, "00000966")
* var indx = getFuncHashIndex(c, ["baac5300", "00000966"])  //2 funcHashes
*/
Web3Utils.getFuncHashIndex = function(call, funcHash) {
	var s = call.stack;
	var s0 = s[0].substring(56);
	var s1 = s[1].substring(56);
	var indx;
	// I have only one string to check
	if (typeof(funcHash) == "string") {
		indx = [s0, s1].indexOf(funcHash);
		//console.log("string - " + funcHash + " - indx: " + indx + " - value: " + s[indx].substring(56) )

	} else if (typeof(funcHash) == "object") {
		//console.log("its an array");
		for(var i=0; i < funcHash.length; i++) {
		  indx = [s0,s1].indexOf(funcHash[i]);
			if ( indx != -1) {
		        //console.log("array - " + funcHash + " - indx: " + indx + " - value: " + s[indx].substring(56))
				break		      	
			}   
		}		
	}
	return indx
};
  

// Quick tests for the Web3Utils.getFuncHashIndex
//var arr = [	"00000000000000000000000000000000000000000000000000000000no",
//			"00000000000000000000000000000000000000000000000000000000find1",
//			"00000000000000000000000000000000000000000000000000000000other",
//			"00000000000000000000000000000000000000000000000000000000other2"];
//console.log("index of 'no': " + Web3Utils.getFuncHashIndex({ stack: arr }, "no"));									// returns: 0
//console.log("index of ['other2', 'find1']: " + Web3Utils.getFuncHashIndex({ stack: arr }, ["other2", "find1"]));	// returns: 0
//console.log("index of 'missingWord' (should be -1): " + Web3Utils.getFuncHashIndex({ stack: arr }, "missingWord"));	// returns: -1



//Web3Utils.ScriptTimer = 