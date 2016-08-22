// this file contains the 5 different conditions that have to be verified to test that the ExtraBalanceOwner script
// works in all situations

// the 5 conditions are:
//                               Block N    Transaction hash
// 1- direct trasaction          1592248,   0x29f564543d22a5dd86c42cce039d071df89191f9a5dede211493372601e79a38
// 2- proxied transaction        1534687,   0x0ad78201811a6dbe74f9e6510282f2b887f5c04201be559e073584842bec6360
// 3- txs with input data        1537724,   0xeea3be70ab2204693fb0bc30a37ab09aa47f790bd61f058efd7c2be4fa64a66b
// 4- txs from smart contract    1595058,   0x9b9cc86509f86070edea8761c6e36e704e988fb57962838716df6746d2031303
// 5- out of gas                 1521125,   0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1

// direct transactions  - the user sent eth to the dao directly from his/her wallet
// proxied transactions - an intermediary such as an exchange (ie Poloniex) bought the eth for an end user
// tx with input data   - direct or proxied transactions where there is also an input data passed onto the transaction
// txs from smart contracts - addresses that don't belong to humans but to smart contracts that call theDAO smart contract
// out of gas txs       - tx that dindn't go through but if you look at them in the simple way they still seem to have sent a value

// RUN - interactive
// geth attach
// loadScript("extraBalanceOwners.test.js")

// RUN - non interactive
// geth --exec "loadScript('extraBalanceOwners.test.js')" attach


// FOR interactive dev purposes you might also want to load these
//var pathToLibs = "/usr/local/lib/node_modules";
//loadScript(pathToLibs + "/underscore/underscore-min.js");
// loadScript("./../02_outputs/output_4OwnersFull.txt")



loadScript("./Web3Utils.js");
loadScript("extraBalanceOwners.js");



// DIRECT TX
var expect1DirectTx = {
    "0x0010ac02317ce3fc244f0502e43f22d1b5c096c0":{
        "address":"0x0010ac02317ce3fc244f0502e43f22d1b5c096c0",
        "balanceTot":"1588076433333333334",
        "transactions":[
            {
                "ebWei":"1588076433333333334",
                "hash":"0x29f564543d22a5dd86c42cce039d071df89191f9a5dede211493372601e79a38",
                "type":"direct",
                "block": 1592248
            }
        ]
    }
};

// Proxied TX
var expect2ProxiedTx = {
    "0x0000000000015b23c7e20b0ea5ebd84c39dcbe60":{
        "address":"0x0000000000015b23c7e20b0ea5ebd84c39dcbe60",
        "balanceTot":"1304347826086957",
        "transactions":[
            {
                "ebWei":"1304347826086957",
                "hash":"0x0ad78201811a6dbe74f9e6510282f2b887f5c04201be559e073584842bec6360",
                "type":"proxy",
                "block": 1534687
            }
        ]
    }
};

// With input Data
var expect3WithInputData = {
    "0x416bdadc20ae5238ea7b1373fb783e893d51048e": {
        "address": "0x416bdadc20ae5238ea7b1373fb783e893d51048e",
        "balanceTot":"4693695652173913044",
        "transactions" : [
            {
                "ebWei": "4693695652173913044",
                "hash": "0xeea3be70ab2204693fb0bc30a37ab09aa47f790bd61f058efd7c2be4fa64a66b",
                "inputDataHex": "0x64616f20",
                "inputDataString": "dao ",
                "type": "direct",
                "block": 	1537724
            }
        ]
    }
};

// TX from a smart contract
var expect4FromSmartContract = {
    "0x025abad6de060f94cc6c9a98d4e7637f97288f08": {
        "address": "0x025abad6de060f94cc6c9a98d4e7637f97288f08",
        "balanceTot": "6333333333333333334",
        "isContract": true,
        "nickEth": "6333333333333333333",
        "transactions": [
            {
                "ebWei": "6333333333333333334",
                "hash": "0x9b9cc86509f86070edea8761c6e36e704e988fb57962838716df6746d2031303",
                "block": 1595058,
                "type": "direct"
            }
        ]
    }
};

// we are not really expecting this, just to store the sample values in a similar way
var expect5OutOfGas = {
    "0x1fbf2f94d91ad989ea132ae0597b6b71d059f2cc": {
        "address": "0x1fbf2f94d91ad989ea132ae0597b6b71d059f2cc",
        "transactions": [
            {
                "hash": "0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1",
                "block": 1521125,
                isOutOfGas: true
            }
        ]
    }
};


// testing that the calculated version is the same as the models we hardcoded here
function isEqual(o1, o2) {
    var address = (o1.address == o2.address);
    var balanceTot = (o1.balanceTot == o2.balanceTot);
    var txs  = (o1.transactions.length   == o2.transactions.length);
    var hash = (o1.transactions[0].hash  == o2.transactions[0].hash);
    var type = (o1.transactions[0].type  == o2.transactions[0].type);
    var ebWei =(o1.transactions[0].ebWei == o2.transactions[0].ebWei);
    return (address && balanceTot && txs && hash && type && ebWei);
}


// RUN THE TESTS
var tests     = [expect1DirectTx, expect2ProxiedTx, expect3WithInputData, expect4FromSmartContract, expect5OutOfGas];
var testTypes = ["direct TX", "Proxy Tx", "Tx with Input Data", "Tx from Smart contract", "out of gas"];

for (var i=0; i < tests.length; i++) {
    var testObj = tests[i];
    //console.log("to:" + JSON.stringify(to));
    var from = Object.keys(testObj)[0];
    var to = testObj[from];
    var tx = to.transactions[0];
    console.log("\n\nTEST " + i + "\ttest type: " + testTypes[i] +"\n\t- block: " + tx.block + "\t - tx.hash: " + tx.hash);
    parseExtraBalanceOwnersAndTransaction(tx.block, tx.block);
    //console.log("theDAOExtraOwners: " + JSON.stringify(theDAOExtraOwners, null, 4));

    //theDAOExtraOwners has been produced by the parse function above, we use a shorthand
    var d = theDAOExtraOwners;

    var testPassed = false;
    if (i < tests.length-1) {
        // do the comparison for all types that are not out of gas
        testPassed = isEqual(d[from], testObj[from]);


    } else if (i == tests.length-1) {
        //testing the out of Gas transaction - it should not have been added to theDAOExtraOwners
        var testA = (d[from] == undefined);
        var testB = Web3Utils.isOutOfGas(tx.hash);
        testPassed = (testA && testB);
    }


    console.log("TEST " + i + " passed: " + testPassed );
    if(!testPassed) {
        console.log("\ntestObj: " + JSON.stringify(testObj, null, 4));
        console.log("\nd: " + JSON.stringify(d, null, 4))
    }


    // empty the object to start from scratch
    theDAOExtraOwners = {};
}






