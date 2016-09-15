// run like this
// geth --exec "loadScript('quickTests.js')" attach

// deleting all out of gas I'm left with balanceTot = "230769230769230770"  (from the first transaction)
// which is still different from             weiN  = "562210447974398951"  >> how did he get to that value?
// the difference is now in favor of Nick	 WEI:    -331441217205168181      or 0.331441217205168181 in favor of Nick > what value is he adding?

//although not exactly right, Nick Seems to have added tx1 ("230769230769230770") and tx5 ("333333333333333334") , 
//which yelds 564102564102564104
//which is just 1892116128165153 WEI away (or "0.001892116128165153" ETH) from his own result in his json file ("562210447974398951")

//? are there rounding errors?
//¿did he include an out of gas transaction?
//¿if the out of gas happens in the middle of the logs, does it mean that it doesn't halt the computation and we should consider it a valid transaction?

//example with the out of gas transaction that Nicks "seems" to have included "0x50f3126d52b788c7cf748cae6611347839970f87daf57cfd846fc967acbcba2e"  "ebWei": "333333333333333334",
var txTrace = debug.traceTransaction("0x50f3126d52b788c7cf748cae6611347839970f87daf57cfd846fc967acbcba2e");
var sl = txTrace.structLogs;
var errors = [];
for (var l=0; l < sl.length; l++) errors.push( sl[l].error);
console.log("\ntx: 0x50f3126d52b788c7cf748cae6611347839970f87daf57cfd846fc967acbcba2e") 	
console.log("out of gas in index: " + errors.indexOf("Out of gas"));   	   // 176
console.log("computation continued and stopped on index: " + (sl.length-1)); // 295
console.log("errors: " + JSON.stringify(errors)) 

//trying with a normal out of gas transaction that halts at the out of gas call
var tx1Trace = debug.traceTransaction("0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1"); 
var sl1 = tx1Trace.structLogs 
var errors1 = []
for (var l=0; l < sl1.length; l++) errors1.push( sl1[l].error);
console.log("\ntx: 0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1") 	
console.log("out of gas in index: " + errors1.indexOf("Out of gas"));   			 //171
console.log("computation continued continued and stopped on index: " + (sl1.length-1));//171
console.log("errors: " + JSON.stringify(errors1)) 


// OUTPUTS
/*
	tx: 0x50f3126d52b788c7cf748cae6611347839970f87daf57cfd846fc967acbcba2e
	out of gas in index: 176
	computation continued and stopped on index: 295
	errors: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","Out of gas","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]

	tx: 0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1
	out of gas in index: 171
	computation continued continued and stopped on index: 171
	errors: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","Out of gas"]
  

*/

/*
it seems that the out of gas error are happening on the SSTORE operation AFTER the CALL
var txTrace = debug.traceTransaction("0x3ed31ad3436918d1d75007b495e406340db4f84d9178b460d94150d7fc6cf345")
var sl = txTrace.structLogs

// the CALL function is at index 171 and refers to the extraBalance
sl[171]
{
  depth: 1,
  error: "",
  gas: 25007,
  gasCost: 9040,
  memory: ["0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000060"],
  op: "CALL",
  pc: 2761,
  stack: ["0000000000000000000000000000000000000000000000000000000000000966", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000980", "00000000000000000000000000c7d701fa374d9f26b3b09e9a3f6b766a38baff", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000002ab36d3c7933b13b", "000000000000000000000000807640a13483f8ac783c557fcdf27be11ea4ac7a", "0000000000000000000000000000000000000000000000000ccf6d92245c4ec5", "0000000000000000000000000000000000000000000000000000000000000060", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000060", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000060", "0000000000000000000000000000000000000000000000000ccf6d92245c4ec5", "000000000000000000000000807640a13483f8ac783c557fcdf27be11ea4ac7a", "0000000000000000000000000000000000000000000000000000000000000000"],
  storage: {}
}

// the out of gas happens on the SSTORE at index 187
{
  depth: 2,
  error: "Out of gas",
  gas: 2196,
  gasCost: 5000,
  memory: ["0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000060"],
  op: "SSTORE",
  pc: 75,
  stack: ["00000000000000000000000000000000000000000000000000000000000000d9", "00000000000000000000000000000000000000000000173aedf46fa0d9227a51", "0000000000000000000000000000000000000000000000000000000000000001"],
  storage: {
    0000000000000000000000000000000000000000000000000000000000000001: "00000000000000000000000000000000000000000000173aedf46fa0d9227a51"
  }
}

but after that the computation keeps going on

*/