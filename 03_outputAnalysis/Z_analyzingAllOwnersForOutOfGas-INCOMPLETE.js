// This script checks ALL theDAOExtraOwners transactions to see if there are out of gas or other errors
// and excludes them form the list

// after having removed all 62 of gas transactions  
// whose output is visible in 
//			output_11StatsAndSimpleWithoutOutOfGasTxs.txt
// 			output_12_OwnersFull_without62OutOfGas.txt	
// we are left with:
// tot transactions: 23751 
// and especially 
// tot ETH:          368650.96222838139093395   
// (oddly enough, even without the 141 addresses, BB's eth balance it still (+ 23743.575040971982673365 ETH) Higher than Nicks 344907.387187409408260585 ETH )
// and we haven't added to BB's balance the value of the missing 141 address that nick has and BB doesn't (other 1566.52624035801380371  ETH)
// it might be the case that other transactions in all of the addresses are out of gas or have problems
// check 03_outputAnalysis/G_analyzingAllTransactionsForOutOfGas.js that has the script that analyzes this




var pathToLibs = "/usr/local/lib/node_modules"    //"/Users/b/Documents/01_Works/20160721_EthereumDaoExtraBalanceOwners/node_modules"
loadScript(pathToLibs + "/underscore/underscore-min.js");
   
// examples of out of gas transactions: http://etherscan.io/tx/0xe17d270fd1e9a6802ae0a30ca3d5260b8d01d10513576afd716f33c294e3ccb3
{
  address: "0x1fbf2f94d91ad989ea132ae0597b6b71d059f2cc",
  balanceTot: "356933333333334",
  transactions: [{
      ebWei: "356933333333334",
      hash: "0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1",
      type: "direct"
  }]
} 
{
  address: "0xf8752cb5b9032135b2e27dd38727061c749caca9",
  balanceTot: "852546430300846409",
  transactions: [{
      ebWei: "189152690150423204",
      hash: "0xaead37f6f1a0b7ba1fac8b973fe88ca378a42444d3cd8bc61b5b7eeb67e7432f",
      type: "direct"
  }, {
      ebWei: "189104156817089871",
      hash: "0xd8dd48c9563f6c71baa2a278d75ee9f83235ba2aed80dd1d58718ba04a502487",
      type: "direct"
  }, {
      ebWei: "474289583333333334",
      hash: "0xe17d270fd1e9a6802ae0a30ca3d5260b8d01d10513576afd716f33c294e3ccb3",
      type: "direct"
  }]
}




/* theDAOExtraOwners TEST OBJECT 
var theDAOExtraOwners = {
    "0x0000000000015b23c7e20b0ea5ebd84c39dcbe60":
    {
        "address": "0x0000000000015b23c7e20b0ea5ebd84c39dcbe60",
        "balanceTot": "1304347826086957",
        "transactions": [
        {
            "ebWei": "1304347826086957",
            "hash": "0x0ad78201811a6dbe74f9e6510282f2b887f5c04201be559e073584842bec6360",
            "type": "proxy",
			"error": "out of gas"   //added for quick test
        }]
    },
    "0x0015d5329a67e22ec78cca840e0a160fa0dc17b8": {
        "address": "0x0015d5329a67e22ec78cca840e0a160fa0dc17b8",
        "balanceTot": "3166666666666666667",
        "transactions": [{
            "ebWei": "2666666666666666667",
            "hash": "0x2f689a181655fc432afdf0f61d48e6855c3baf62a33cce7e4fd944086e577d75",
            "type": "direct", 
			"error": "some other error"   //added for quick test
        },
        {
            "ebWei": "500000000000000000",
            "hash": "0xcbe47e46dde5f2a8fc9326d72097e1483b539717de167f118ed7e4a9874499d5",
            "type": "direct"
        },
		{
		      ebWei: "474289583333333334",
		      hash: "0xe17d270fd1e9a6802ae0a30ca3d5260b8d01d10513576afd716f33c294e3ccb3",    // this is out of gas , belongs to address "0xf8752cb5b9032135b2e27dd38727061c749caca9"
		      type: "direct"
		  }
		]
    },
} 
*/


var txsWithErrors = [];
var bigN = web3.toBigNumber
                         
for (o in theDAOExtraOwners) {
	var ow = theDAOExtraOwners[o];
	var txs = ow.transactions;
	for (i = txs.length-1; i >=0 ; i--) {
		console.log(i + " - process tx: " + txs[i].hash);
		if (txs[i].error != undefined) {
			// add the transaction to the error to output
			txsWithErrors.push(txs[i])
			// substract the value from the total balance
			ow.balanceTot = bigN( ow.balanceTot ).minus( bigN( txs[i].ebWei ) )
			// remove the transaction from the list
			txs.splice(i, 1);
		}
	} 
	// if there are no transactions or the balance is zero you can safely remove this address from the list
	if (txs.length == 0 || ow.balanceTot == "0") {
		delete theDAOExtraOwners[o]
	}
}

console.log("\n\nvar txsWithErrors = ", JSON.stringify(txsWithErrors, null, 4))

console.log("\n\nvar theDAOExtraOwners = ", JSON.stringify(theDAOExtraOwners, null, 4));

