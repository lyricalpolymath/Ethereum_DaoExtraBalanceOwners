// this file converts Bokkypoobah's json into an object similar to mine based on the addresses and not the transactions
// Structure of one of the BokkyPoobah's transactions converted from his csv
//	{
//	  Amount: 134,
//	  BlockNumber: 1520861,
//	  Cost: 0.00249417,
//	  CreatedBy: "Proxy",
//	  Error: "",
//	  From: "0x32be343b94f860124dc4fee278fdcbd38c102d88",
//	  GMTDateTime: "Sun, 15 May 2016 09:00:16 GMT",
//	  GasPrice: 30000000000,
//	  GasUsed: 83139,
//	  Nonce: 64340,
//	  TheDAOAmount: 127.619047619,
//	  TheDAOTokens: 12761.9047619048,
//	  Timestamp: 1463302816,
//	  TokenOwner: "0xbad9ab5fd55aff4a8aec47166e1a2894d68cc473",
//	  TxHash: "0xb989cba5fad84d78e305909bf97605dc35b3cb6caf0e32a2009c3a2dda876003",
//	  extraBalanceAmount: 6.380952381
//	}

// RUN LIKE THIS ( to save it to the file )
//$ geth --exec "loadScript('outputConverter_02_BPjsonToObject.js')" attach > ./../02_outputs/output_byOtherPeople/BPC_02_ExtraBalanceOwners_new.txt


//Load BokkyPoobahs output (previously converted in json)
loadScript("./../02_outputs/output_byOtherPeople/BPC_01_CreatedTokenEventsWithNonZeroExtraBalance_v3.json");
var bpa = BP_ExtraBalanceTransactions;

//sums all ETH balances and returns one unique value
function getTotalETH(owners) {
    var totETH = new BigNumber(0);
    for (o in owners) {
        totETH = totETH.plus( web3.toBigNumber( owners[o].balanceTot) );
    }
    return totETH //.div(ethDivisor);
}

// convert BP output to one similar to mine, adding the eth of each address
function convertBPOutput() {
    var out = {};
    for (var i = 0; i < bpa.length; i++) {
        //for (var i=0; i< 1; i++) {
        var from = bpa[i].TokenOwner;
        var ebEth = bpa[i].extraBalanceAmount;
        var txHash = bpa[i].TxHash;
        var txType = bpa[i].CreatedBy;

        var txo = {
            hash: txHash,
            ebWei: web3.toWei(ebEth),
            type: txType
        };

        if (!out[from]) {
            //new owner
            out[from] = {
                address: from,
                balanceTot: web3.toBigNumber(ebEth),
                transactions: [txo]
            };

        } else {
            //known address - add the eth
            var owner = out[from];
            var newValue = web3.toBigNumber(ebEth);
            var oldBalance = owner.balanceTot;
            var newBalance = oldBalance.plus(newValue);

            owner.balanceTot = newBalance;
            owner.transactions.push(txo);
        }
    }
    //console.log("out: ", out)
    return out;
}


var BPExtraBlanceOwners = convertBPOutput();

console.log("\n\n//------------------\n// BP STATS \n//------------------");
console.log("//BP Addresses:\t " + Object.keys(BPExtraBlanceOwners).length);
console.log("//BP Transactions:\t " + bpa.length);
console.log("//BP Total ETH:\t " + getTotalETH(BPExtraBlanceOwners));


console.log("\n\n//------------------\n// BP ADDRESSES \n//------------------");
console.log("var BPExtraBlanceOwners = ", JSON.stringify(BPExtraBlanceOwners, null, 4));


//------------------
// BP STATS
//------------------
//BP Addresses:	 11440
//BP Transactions:	 22608
//BP Total ETH:	 344917.579923468557666626
