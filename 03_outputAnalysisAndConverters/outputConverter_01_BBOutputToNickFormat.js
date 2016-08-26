//this script converts my output_01_full  theDAOExtraOwners into the same format used by Nick
// his format https://raw.githubusercontent.com/Arachnid/extrabalance/master/extrabalance.json
// Nick format it's an Array of Arrays that looks like this
//[ ["0x0000000000015b23c7e20b0ea5ebd84c39dcbe60", "1304347826086957" ], [...], ... ]

// run it like this - to save the output to a file  in  /02_outputs/output_02_NickFormat.json
//$ geth --exec "loadScript('outputConverter_01_toNickFormat.js')" attach > ./../02_outputs/output_02_NickFormat.json



// imports the var theDAOExtraOwners
loadScript("./../02_outputs/output_01_full.txt");

var outputFormat = [];
for (o in theDAOExtraOwners) {
    outputFormat.push([ theDAOExtraOwners[o].address, theDAOExtraOwners[o].balanceTot ]);
}

// Verify that everything works
var totAddresses = 11440;
var totETH       = "344917.57992346864402677";
var ethsum = web3.toBigNumber(0);
for ( var i=0; i < outputFormat.length; i++) {
    ethsum = ethsum.add ( web3.toBigNumber(outputFormat[i][1] ) );
}

if ( (outputFormat.length == totAddresses) && ( web3.fromWei(ethsum).toString() == totETH ) ) {
    // print it to console which will save it to a file
    console.log(JSON.stringify(outputFormat, null, 4));

} else {
    console.log ("TEST FAILED - something is wrong with the conversion")
}





