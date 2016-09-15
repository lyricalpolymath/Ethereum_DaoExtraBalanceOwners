// find all transactions to and from the ExtraBalance  
// there is no output because between the 2 blocks the script didn't find any transaction to and from the EB

// run like this
// geth --exec "loadScript('outputAnalysis_03_findingTXSfromToExtraBalance.js')" attach;          



var extraBalance = "0x807640a13483f8ac783c557fcdf27be11ea4ac7a" 
             
var blockOne  = 1520861;    
var blockLast = 1599205;
var testBlock = 1611368//1848080
 
//ANALYSIS OF EXTRABALANCE WEI FORMATTING
// get Balance retuns a BigNumber Instance https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetbalance                        
// eth.getBalance("0x807640a13483f8ac783c557fcdf27be11ea4ac7a", 1599205)	                   				// 3.449077359900894394727e+23
// eth.getBalance("0x807640a13483f8ac783c557fcdf27be11ea4ac7a", 1599205).toString(10)						//"344907735990089439472700"    OK FOR WEI REPRESENTATION
// web3.fromWei( eth.getBalance("0x807640a13483f8ac783c557fcdf27be11ea4ac7a", 1599205).toString(10) )    	//"344907.7359900894394727"     OK FOR ETH REPRESENTATION

// web3.toBigNumber( eth.getBalance("0x807640a13483f8ac783c557fcdf27be11ea4ac7a", 1599205));  				// 3.449077359900894394727e+23
// web3.toBigNumber( eth.getBalance("0x807640a13483f8ac783c557fcdf27be11ea4ac7a", 1599205)).toString()  	//"3.449077359900894394727e+23"
// eth.getBalance("0x807640a13483f8ac783c557fcdf27be11ea4ac7a", 1599205).toNumber()           				// 3.449077359900894e+23
// web3.toWei( eth.getBalance("0x807640a13483f8ac783c557fcdf27be11ea4ac7a", 1599205) )                     //  3.449077359900894394727e+41   ERROR                               
// web3.toWei( eth.getBalance("0x807640a13483f8ac783c557fcdf27be11ea4ac7a", 1599205).toString() )          // "344907735990089439472700000000000000000000"
// web3.toWei( eth.getBalance("0x807640a13483f8ac783c557fcdf27be11ea4ac7a", 1599205).toString(10) )        // "344907735990089439472700000000000000000000"                                                                       


//var EBbalanceOnBlockOne  = web3.toBigNumber( eth.getBalance(extraBalance, blockOne)); 	// 6729755060983593113
//var EBbalanceOnBlockLast = web3.toBigNumber( eth.getBalance(extraBalance, blockLast));  // 3.449077359900894394727e+23
//var EBdiff = EBbalanceOnBlockLast.minus( EBbalanceOnBlockOne )                          // 3.44901006235028455879587e+23
var EBbalanceOnBlockOne  = eth.getBalance(extraBalance, blockOne); 
var EBbalanceOnBlockLast = eth.getBalance(extraBalance, blockLast);
var EBdiff = web3.toBigNumber( EBbalanceOnBlockLast).minus( web3.toBigNumber( EBbalanceOnBlockOne) )
console.log("\n\n//---------------------\n// EXTRABALANCES \n//---------------------");                         
console.log("//ExtraBalance On Block1 " + blockOne + " : " + EBbalanceOnBlockOne.toString(10) );
console.log("//ExtraBalance On BlockN " + blockLast + " : " + EBbalanceOnBlockLast.toString(10) ); 
console.log("//ExtraBalance difference: " + EBdiff.toString(10) );


//var higherCostTXOne = "0xb989cba5fad84d78e305909bf97605dc35b3cb6caf0e32a2009c3a2dda876003";
//var higherCostTXLast = "0x39e8a89762ed719c8812595f262a20276bf3a3ea9a0c9259a140296e5fbaa7da";

var toEB = [];
var fromEB = [];

//for (var i = blockOne; i <= blockLast; i++) { 		 // ALL THE BLOCKS
//for (var i = blockOne; i <= (blockOne+10); i++) {     // DEV - only some blocks
for( var i = testBlock; i < (testBlock+1); i++) {		// DEV - only block with known OUT tx https://www.etherchain.org/tx/0x4feeb4b1883120cf2b7128077c530a3dfc648af70c2111d51c5f5fe9331983f6	

	              
	var foundTX1 = false;
    var foundTXLast = false;
	
	 var block = web3.eth.getBlock(i, true);
     if (block != null && block.transactions != null) {
	 	
		block.transactions.forEach(function (tx) {
			//console.log("tx.from: " + tx.from);
			       
			// find all (non zero = non internal) transactions TO the ExtraBalance and FROM the ExtraBalance
			if ( (tx.to == extraBalance /*&& tx.value != 0*/) || (tx.from == extraBalance /*&& tx.value != 0*/)) {
		     
		        
				// store it for later review in the 2 variables
				if (tx.to == extraBalance) toEB.push(tx);
				else if (tx.from == extraBalance) fromEB.push(tx);
		    }
		});	
   
	 }
	
}	
  

console.log("\n\n//---------------------\n// transactions FROM the EXTRABALANCE \n//---------------------");
console.log("var fromEB = ", JSON.stringify(fromEB,null,4));

console.log("\n\n\n\n\n//---------------------\n// transactions TO the EXTRABALANCE \n//---------------------");
console.log("var toEB = ", JSON.stringify(toEB,null,4)); 
