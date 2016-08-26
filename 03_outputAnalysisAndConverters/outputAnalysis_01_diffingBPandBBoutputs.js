// after converting BokkyPoobah's output into an object similar to mine (with script outputConverter_02_BPJsonToObject.js)
// this script analyzes the differences between my output and BP's output 
// and extract the very tiny difference that appear in 8783 addresses
// the output file is 02_outputs/output_byOtherPeople/BPC_03_diffedAddressesAndValues.txt

// the resulting difference is minimal:
// - we have the same number of addresses:      11440
// - we have the same number of transactions:   22.608
// - we only have a tiny difference in total ETH value ( just 86360144 WEI or 0.000000000086360144 ETH)


// the difference is due to rounding problems in BP's addresses script
// for example in BP's output https://github.com/bokkypoobah/TheDAOData/blob/master/CreatedTokenEventsWithNonZeroExtraBalance_v3.txt
// the address 0x0000000000015b23c7e20b0ea5ebd84c39dcbe60  has extraBalanceAmount = 0.0013043478
// but that is missing some digits of the real output (in wei) 1304347826086957  which in ETH should be "0.001304347826086957"

// his problem probably lies in line 86  of his code https://github.com/bokkypoobah/TheDAOData/blob/master/getTheDAOCreatedTokenEventsWithNonZeroExtraBalance_v3
//		var theDAOAmount = amount - extraBalanceAmount; 
// that should rather be done with BigNumber
// 		var theDAOAmount = amount.minus(extraBalanceAmount);

// RUN LIKE THIS - to save to file
// $ geth --exec "loadScript('outputAnalysis_01_diffingBPandBBoutputs.js')" attach > ./../02_outputs/output_byOtherPeople/BPC_03_diffedAddressesAndValues_new.txt


                                                                                    // imported variables
loadScript("./../02_outputs/output_byOtherPeople/BPC_02_ExtraBalanceOwners.txt");   // BPExtraBlanceOwners
loadScript("./../02_outputs/output_01_full.txt");                                   // theDAOExtraOwners, theDAOExtraTransactions, simpleOwners



//sums all ETH balances and returns one unique value
function getTotalETH(owners) {
    var totETH = new BigNumber(0);
    for (o in owners) {
        totETH = totETH.plus( web3.toBigNumber( owners[o].balanceTot) );
    }
    return totETH; //.div(ethDivisor);
}


//------------- find the differences between my output and BP's
var weiDiff = web3.toBigNumber(0);
var diffAddr = [];
var addressesBBHas_BPdoesnt = [];
var addressesBPHas_BBdoesnt = [];
var bbTotWei = web3.toBigNumber(0);
var bpTotWei = web3.toBigNumber(0);
if(!BBEBOwners) var BBEBOwners = theDAOExtraOwners;

function findAddressETHDifferences() {
    for (o in BBEBOwners) {
        var ownerB  = BBEBOwners[o];
        var ownerBP = BPExtraBlanceOwners[o];

        // save them if there are some differences in the addresses
        if (!ownerBP) addressesBBHas_BPdoesnt.push(o);
        if (!ownerB)  addressesBPHas_BBdoesnt.push(o);

        var bbWei =  web3.toBigNumber(ownerB.balanceTot);
        var bpWei =  web3.toWei(ownerBP.balanceTot);	  // BP stored it in ETH so convert it to Wei

        // add the totals
        bbTotWei = bbTotWei.add(bbWei);
        bpTotWei = bpTotWei.add(bpWei);

        // look for differences
        if(bbWei.toString() != bpWei.toString()) {
            //found differences
            //console.log("\n found differences in address " + o)
            //console.log(" BB ETH: " + bbETH + "\t\tBP ETH: " + bpETH)
            var diffObj = {
                address: o,
                BBwei: bbWei,
                BPwei: bpWei,
                BPeth: ownerBP.balanceTot
            };
            diffAddr.push( diffObj );
            //console.log(JSON.stringify(diffObj, null, 0))

            //calculate the difference between my output and his and sum it up
            var diff  =  bbWei.minus(bpWei);
            weiDiff = weiDiff.add(diff);
        }

    }
}


findAddressETHDifferences();
console.log("\n\n//----------------------\n// ETH COMPARED\n//-----------------------");
var bbtotals = web3.fromWei( getTotalETH(BBEBOwners) );                 // I saved values in wei > convert it to ETH
var bptotals = getTotalETH(BPExtraBlanceOwners);		                // he saved values in eth
console.log("\n//BB tot ETH - bbtotals: " + bbtotals);    				// 344917.57992346864402677
console.log("//BP tot ETH - bptotals: " + bptotals);                    // 344917.579923468557666626
console.log("//difference BB-BP  in WEI: " + weiDiff);                  // 86360144
console.log("//difference BB-BP  in ETH: " + web3.fromWei( weiDiff.toString() ) ); // 0.000000000086360144 ETH  //if you pass a BigNumber to web3.fromWei it will output the scientific notation 


console.log("\n\n//----------------------\n// ADDRESSES COMPARED\n//-----------------------");
console.log("//Amount of different addresses whose balance differs: " + diffAddr.length + " of 11440");  	 // 8783 of 11440
console.log("//total Addresses BB: " + Object.keys(BBEBOwners).length);                 // should be 11440
console.log("//total Addresses BP: " + Object.keys(BPExtraBlanceOwners).length);        // should be 11440
console.log("//BB and BP have the same number of addresses? " + (Object.keys(BBEBOwners).length == Object.keys(BPExtraBlanceOwners).length));  // true
console.log("//addresses BP Has BB doesnt: " + addressesBPHas_BBdoesnt.length);  	   // 0
console.log("//addresses BB Has BP doesnt: " + addressesBBHas_BPdoesnt.length);        // 0

// print one line at a time but in compact mode
console.log("\n//------------- DIFFED ADDRESSES");
console.log("var BB_BP_diffedValues = [");
for (i in diffAddr) console.log(JSON.stringify(diffAddr[i],null,0));
console.log("]");