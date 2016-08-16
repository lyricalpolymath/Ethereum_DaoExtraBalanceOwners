// after having found the 31 transactions, and extracted their trace that
// we merge these 31 values into the SimpleOwners and theDAOExtraOwners arrays
                             
// run like this
// geth --exec "loadScript('C_mergingTXsAndExtractingFinalOwners.js')" attach
//
// or even better, if you want to save the output to a file
// geth --exec "loadScript('C_mergingTXsAndExtractingFinalOwners.js')" attach > ouptut.txt


var pathToLibs = "/usr/local/lib/node_modules"    //"/Users/b/Documents/01_Works/20160721_EthereumDaoExtraBalanceOwners/node_modules"
loadScript(pathToLibs + "/underscore/underscore-min.js");

var pathToOutput = "./../02_outputs/";
loadScript(pathToOutput + "output_8Transactions-special-retraced.js"); 	//loads one variable 	txs_special_full
loadScript(pathToOutput + "output_3SimpleOwners.txt"); 					//loads one variable 	simpleOwners
loadScript(pathToOutput + "output_4OwnersFull.txt");   					//loads one variable 	theDAOExtraOwners


//first thing - cleanup the "undefined" owner from theDAOExtraOwners and simpleOwners that had the 31 special transactions
if(theDAOExtraOwners["undefined"]) delete theDAOExtraOwners["undefined"]

//clean it from simpleOwners too
for (i = 0 ; i < simpleOwners.length; i++) {
	if(simpleOwners[i].address == undefined) { 
		simpleOwners.splice(i,1) 
		break
	}
} 
   
//create an array with just the addresses to easily retrieve the indexes
var simpleAddresses = _.pluck(simpleOwners, "address");



// output to console starting Values before starting the merging process
console.log("\n\n//------------------\n// Prior to starting Stats \n//------------------")
console.log("tot Extra Balance ETH: " + getTotalETH());
console.log("tot Transactions: " + getTotalTXs());
console.log("simpleOwners: " + simpleOwners.length + "  \t fullOwners: " + Object.keys(theDAOExtraOwners).length + " \t simpleAddresses: " + simpleAddresses.length);    


//Parse all special transactions and add them to both the simpleOwners and theDAOExtraOwners arrays
function parseAndAddSpecialTransactions() {
	 for (i=0; i< txs_special_full.length; i++) {
		var tx = txs_special_full[i];
		var from = tx.address;

		//there are 14 transactions that relate to previously known addresses
		//add the ether of the special transaction to totETH
		if(_.contains(simpleAddresses, from)) {	
			//previously known address > add the ether and the transaction 
			//console.log(i + " previously known address: " + from);
			var sIndx = simpleAddresses.indexOf(from); 
			var currETH =  web3.toBigNumber( simpleOwners[sIndx].totETH );
			var newETH  =  web3.toBigNumber( tx.ebWei ); 
			var newTotETH = currETH.add( newETH );

			//record it in simpleOwners    
			simpleOwners[sIndx].totETH = newTotETH

			//record it also in fullOwners
			theDAOExtraOwners[from].balanceTot = newTotETH
			theDAOExtraOwners[from].transactions.push(tx); 

		} else {
			//it's a new Address > add it to simpleOwners 
			//console.log("\n" + i + " - new address: " + from);
			simpleOwners.push({
				"address": from,
				"totETH": tx.ebWei 
			}); 

			//add it also to the simpleAddress that is used for this loop to find the index in the simpleOwners arrays
			simpleAddresses.push(from)

			//Add it also to full owners
			theDAOExtraOwners[from] = {
	            address: from,
	            balanceTot: tx.ebWei,
	            transactions: [tx]
	        } 
		}  
	}
}

  
//sums all ETH balances and returns one unique value
function getTotalETH() { 
	var ethDivisor = 1e18;
    var owners = Object.keys(theDAOExtraOwners)
    var totWEI = new BigNumber(0);
    for (o in theDAOExtraOwners) {
        totWEI = totWEI.plus(theDAOExtraOwners[o].balanceTot)
    }
    return totWEI.div(ethDivisor);
}  
 
// returns a count of all transactions involved
function getTotalTXs() { 
	var totTXs = 0
	for ( o in theDAOExtraOwners ) { 
		totTXs += theDAOExtraOwners[o].transactions.length;
	}            
	return totTXs;
}    
            
                                 
// RUN MAIN SCRIPT
parseAndAddSpecialTransactions();
                                  

console.log("\n\n//------------------\n// STATS - COMPLETE \n//------------------")
console.log("simpleOwners: " + simpleOwners.length + "  \t fullOwners: " + Object.keys(theDAOExtraOwners).length)
console.log("tot Extra Balance ETH: " + getTotalETH());
console.log("tot Transactions: " + getTotalTXs());


//console.log("\n\n//------------------\n// SIMPLE OWNERS - COMPLETE \n//------------------")
//console.log("var simpleOwners = ", JSON.stringify(simpleOwners, null, 0));
//                                  
//
//console.log("\n\n//------------------\n// FULL OWNERS - COMPLETE \n//------------------")
//console.log("var theDAOExtraOwners = ", JSON.stringify(theDAOExtraOwners, null, 0));






















