// extracting the differences between my results and Nick

// his script available here https://github.com/Arachnid/extrabalance
// outputs a json  https://raw.githubusercontent.com/Arachnid/extrabalance/master/extrabalance.json 
// that is structured as an Array of arrays
//[ [ "0x0015d5329a67e22ec78cca840e0a160fa0dc17b8", "3166666666666666667" ], [...], ...]
// I've simply modified the json to add a variable at the beginning as  "nickExtraBalance"  and I'm loading it from /02_outputs/output_byOtherPeople/Nick_extraBalance.json
  
// Structure of my extraBalance output - Array of Objects 
// [{"address":"0xbad9ab5fd55aff4a8aec47166e1a2894d68cc473","totETH":"6380952380952380953"}, {...}, ...]
                                                 
// run like this
// geth --exec "loadScript('D_comparingAndDiffingNicksResults.js')" attach



var pathToLibs = "/usr/local/lib/node_modules"    //"/Users/b/Documents/01_Works/20160721_EthereumDaoExtraBalanceOwners/node_modules"
loadScript(pathToLibs + "/underscore/underscore-min.js");

// Loading Nicks output
loadScript("./../02_outputs/output_byOtherPeople/Nick_extraBalance.json"); //nickExtraBalance
var ebNick = nickExtraBalance
console.log("Nick Addresses: " + ebNick.length);

//loading My output
loadScript("./../02_outputs/output_9-CORRECT2_SimpleOwners.txt");  //simpleOwners 
var ebBB = simpleOwners;
console.log("BB Addresses: " + ebBB.length);

console.log("Nick appears to have " + (ebNick.length-ebBB.length) + " more Addresses than BB"); 
  

/*---------------------------------- 1- COMPARING BASIC ETH VALUES
// Nick ETH:  {"eth":"344907.387187409408260585","wei":"3.44907387187409408260585e+23"}
// BB ETH  :  {"eth":"369740.558185027463534822","wei":"3.69740558185027463534822e+23"}
// BB Appears to have 24833.170997618055274237 more eth than Nick		
                                                         
function getNickTotalETH() {
	var nickTotETH = web3.toBigNumber(0);
	for (var i = 0; i< ebNick.length; i++) {
		var eth = web3.toBigNumber( ebNick[i][1] )
		//console.log("ebNick[i][1]: " + ebNick[i][1] + " \t eth: " + eth);
		nickTotETH = nickTotETH.add( eth )
	}   
	return {
		wei: nickTotETH,
		eth: nickTotETH.div(1e18)
	}
}

function getBBTotalETH() {
    var bbTotWEI = new BigNumber(0);
    for (var i = 0; i< ebBB.length; i++) {
		var eth =  web3.toBigNumber( ebBB[i].totETH )
        bbTotWEI = bbTotWEI.plus( eth )
    }
    return {
		wei: bbTotWEI,
		eth: bbTotWEI.div(1e18)
	}
}

var nickETH = getNickTotalETH() 
var bbETH = getBBTotalETH() 
var diffBigNum = (web3.toBigNumber(bbETH.eth)).minus( web3.toBigNumber(nickETH.eth) )
console.log("Nick ETH: ", JSON.stringify(nickETH))
console.log("BB ETH  : ", JSON.stringify(bbETH))
console.log("BB appears to have " +  diffBigNum + " more ETH than Nick")  //24833.170997618055274237
//*/

         


/*---------------------------------- 2 - COMPARING AND DIFFING ADDRESSES 
//Normalize the 2 arrays - only an array with the addresses
var nickAddressesOnly = _.unzip(ebNick)[0]
//console.log("nickAddressesOnly: " + JSON.stringify(nickAddressesOnly));
//console.log("nickAddressesOnly: " + nickAddressesOnly.length);                                                           

var bbAddressesOnly = _.pluck(ebBB, "address");
//console.log("bbAddressesOnly: " + JSON.stringify(bbAddressesOnly));
//console.log("bbAddressesOnly: " + bbAddressesOnly.length)

// quick test for diffing functions
//var nickAddressesOnly = [1,2,3,4,5, "abc"]
//var bbAddressesOnly   = [1,2,3,"bb","abc", "def"]

// --------------------------------- FIND THE DIFFERENCES 
var addressesNickHas_BBDoesnt = _.difference(nickAddressesOnly, bbAddressesOnly);
console.log("\n\n//------------------------------------\n// NICK HAS -- BB DOESN'T")
console.log("//Nick Has " + addressesNickHas_BBDoesnt.length + " Addresses that BB doesn't")
console.log("//------------------------------------");
console.log("var addressesNickHas_BBDoesnt = " + JSON.stringify(addressesNickHas_BBDoesnt)); 


var addressesBBHas_NickDoesnt = _.difference(bbAddressesOnly, nickAddressesOnly);
console.log("\n\n//------------------------------------\n// BB HAS -- NICK DOESN'T")
console.log("//BB Has " + addressesBBHas_NickDoesnt.length + " Addresses that Nick doesn't");
console.log("//------------------------------------");
console.log("var addressesBBHas_NickDoesnt = " + JSON.stringify(addressesBBHas_NickDoesnt)); 
//*/  
      


//*------------------------------------- 3- CALCULATE ETH VALUES OF THE DIFFED ADDRESSES
//		Nicks 141 extra Address have a total balance of : 1566.52624035801380371  ETH 
//		BB 62 extra Address have a total balance of : 	  1089.595956646072600872     ETH 
// SUMMING UP THIS BALANCES DOESN'T Return the same value as the previously calculated in step 1 (≈24833 ETH)!! 
//		Therefore there must be other differences in the common addressess
// 		probably due to Nicks' rounding caluculation errors
// var n = web3.toBigNumber("1566.52624035801380371");
// var b = web3.toBigNumber("1089.595956646072600872"); 	 
// n.add(b)   // 2656.122197004086404582   - which is not equal to the  24833.170997618055274237 direct difference previously calculated


// after having generated the 2 lists addressesNickHas_BBDoesnt and  addressesBBHas_NickDoesnt  in the previous step
// we might want to load it instead of running the whole script every time
loadScript("./../02_outputs/ouptut_10_ComparingWithNick.txt");

// find total ether for Nicks 141 extra addresses
var addressesNickHas_BBDoesnt_full = []
var totETH = web3.toBigNumber(0);
for (i = 0; i< ebNick.length; i++) {
	var a = ebNick[i][0]
	if (addressesNickHas_BBDoesnt.indexOf(a) != -1) { 
		addressesNickHas_BBDoesnt_full.push( ebNick[i] )
		totETH = totETH.add( web3.toBigNumber( ebNick[i][1] ) );
	}
}
console.log("//Nicks " + addressesNickHas_BBDoesnt_full.length + " extra Address have a total balance of : " + totETH.div(1e18));
console.log("var addressesNickHas_BBDoesnt_full = " + JSON.stringify(addressesNickHas_BBDoesnt_full, null,0));
          


// find total ether for BB's extra Addresses
var addressesBBHas_NickDoesnt_full = []
var totETH = web3.toBigNumber(0);
for (i = 0; i< ebBB.length; i++) {
	var a = ebBB[i].address;
	if (addressesBBHas_NickDoesnt.indexOf(a) != -1 ) {
	   addressesBBHas_NickDoesnt_full.push(ebBB[i]);
	   totETH = totETH.add(	web3.toBigNumber( ebBB[i].totETH ) )
	} 
}	
console.log("//BB " + addressesBBHas_NickDoesnt_full.length + " extra Address have a total balance of : " + totETH.div(1e18));
console.log("var addressesBBHas_NickDoesnt_full = " + JSON.stringify(addressesBBHas_NickDoesnt_full, null,0));








