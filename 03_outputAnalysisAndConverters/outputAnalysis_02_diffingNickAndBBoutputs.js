
// find the differences between Nick's and BB addresses 
// the output of this file is /02_outputs/outputs_byOtherPeople/NickC_02_diffedBBvsNick.txt
              
// run like this
// geth --exec "loadScript('outputAnalysis_02_diffingNickAndBBoutputs.js')" attach 

// or like this if you want to save it to an output
// geth --exec "loadScript('outputAnalysis_02_diffingNickAndBBoutputs.js')" attach > output_NickC_02_diffedBBvsNick_new.txt
  


loadScript("/usr/local/lib/node_modules/underscore/underscore-min.js");


loadScript("./../02_outputs/output_byOtherPeople/Nick_extrabalance.json"); //nickExtraBalance
//console.log("nickExtraBalance.length: " + nickExtraBalance.length);

//loadScript("./../02_outputs/output_01_full.txt"); //simpleOwners, theDAOExtraOwners
//console.log("simpleOwners.length: " + simpleOwners.length); 

// load my version in the same format as Nick
loadScript("./../02_outputs/output_02_NickFormat.json");   //BBExtraBalance
//console.log("BBExtraBalance.length: " + BBExtraBalance.length);        
                     

//------------- COMPARE ETH
function getTotalWEI(owners) {
	var totWEI = web3.toBigNumber(0);
	for (i in owners) {     
		var newWei = web3.toBigNumber( owners[i][1] );
		//console.log("owners[i][1]: " + owners[i][1] + " newWei: " + newWei)
		totWEI = totWEI.add( newWei )
	} 
	return totWEI;
}
var NtotWEI = getTotalWEI(nickExtraBalance);
var BtotWEI = getTotalWEI(BBExtraBalance);
var diffWei = (web3.toBigNumber(BtotWEI)).minus( web3.toBigNumber(NtotWEI) )
var diffEth = web3.fromWei(diffWei)  


// getting the ETH balance of the ExtraBalance at the last block
var EB = web3.toBigNumber( eth.getBalance("0x807640a13483f8ac783c557fcdf27be11ea4ac7a", 1599205))

//differences BB to EB and Nick to EB 
// BB ETH   						"344917.57992346864402677"
// ExtraBalace at block  1599205 =  "344907.7359900894394727" 
// extraBalance sent				 344907.73799008945
// NICK ETH 						"344907.387187409408260585"
var diffBB2EBwei   = BtotWEI.minus(EB)
var diffNick2EBwei = NtotWEI.minus(EB)


//------------ DIFFING THE ADDRESSES
var diffAddr = [];
var wrongIndx = [];

//TODO - calculate the differences and then sort the array according to that value so that we see the bigger ones
function findDifferentAddressesAndBalances() {
   	for (var i=0; i < nickExtraBalance.length; i++){
		var Naddress = nickExtraBalance[i][0];
		var Baddress = BBExtraBalance[i][0];
		var weiN =  web3.toBigNumber( nickExtraBalance[i][1] );
		var weiB =  web3.toBigNumber( BBExtraBalance[i][1] );
		var weiDiff = (weiB.minus(weiN)).abs();

		if (Naddress == Baddress) {          
			  // omit marginal differences of 1 wei or no difference at all  
			  if(weiDiff.greaterThan(1)) {   
			   //add the difference 
			   diffAddr.push({
					address: Baddress,
					weiN: weiN.toString(10),
					weiB: weiB.toString(10),
					weiDiff: weiDiff.toString(10),
				}) 
			}
		} else {
			wrongIndx.push(i);
		}
	}
	
	// TODO sort it by difference 
	diffAddr = _.sortBy(diffAddr, "weiDiff");
}
   
 
console.log("\n\n//---------------------\n// COMPARING ETH - BB vs Nick \n//---------------------");
console.log("// BB   totals ETH: " + web3.fromWei(BtotWEI) + " \tWEI: " + BtotWEI);
console.log("// Nick totals ETH: " + web3.fromWei(NtotWEI) + " \tWEI: " + NtotWEI); 
console.log("// difference - BB has " + diffWei + " WEI ( or " + diffEth+" ETH ) More than Nick" );

console.log("\n// ExtraBalance at Block 1599205  WEI: " + EB + "\tETH: " + web3.fromWei(EB)); 
console.log("// BB-ExtraBalance     WEI: " + diffBB2EBwei   + "\tETH: " + web3.fromWei(diffBB2EBwei));
console.log("// Nick-ExtraBalance   WEI: " + diffNick2EBwei + "\tETH: " + web3.fromWei(diffNick2EBwei));
//console.log("wrongIndx: " + wrongIndx);
                                         

findDifferentAddressesAndBalances()
console.log("\n\n//---------------------\n// DIFFED ADDRESSES BB vs Nick \n//---------------------");
// print one line at a time but in compact mode 
console.log("// there are " + diffAddr.length + " differences between BB and Nick");
console.log("var BB_Nick_diffedValues = [");
for (i in diffAddr) console.log(JSON.stringify(diffAddr[i],null,0) + ",");
console.log("]");
                   
        
//---------------------
// COMPARING ETH - BB vs Nick
//---------------------
//BB total WEI  : 3.4491757992346864402677e+23 
//				  3.449077359900894394727e+23
//Nick total WEI: 3.44907387187409408260585e+23
//difference - BB has 10192736059235766185 WEI ( or 10.192736059235766185 ETH ) More than Nick



