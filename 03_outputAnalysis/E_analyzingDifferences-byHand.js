//ANALYZING WHAT SPECIAL in the 141 Addresses that Nick Has and BB doesn't  
// summary
// - they might be contract addresses that call theDAO
// - the tx.value might always be 0
// - they might have been done AFTER the token creation period, like this tx http://etherscan.io/tx/0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3, that donated 280 ETH to the extra Balance 

// contract address  0x01861c6dfab20bae0fa4ee698912630697d78ce4
// normal   address  0x2d5f0e392e90043ed2dbd57605b7534a169ae62e
//my address http://etherscan.io/token/TheDAO?a=0x2d5f0e392e90043ed2dbd57605b7534a169ae62e  




//------------------------------------------- 
// NICK EXTRAS  ADDRESS 1 
// [   0x01861c6dfab20bae0fa4ee698912630697d78ce4", "280000000000000000001"] 
//-------------------------------------------  

// Nick has address 0x01861c6dfab20bae0fa4ee698912630697d78ce4 (it's a contract address)
// http://etherscan.io/address/0x01861c6dfab20bae0fa4ee698912630697d78ce4  

// NICK RECORDED THESE ETH FOR THIS ADDRESS
// [   0x01861c6dfab20bae0fa4ee698912630697d78ce4", "280000000000000000001"] 
// that value probably derives from one unique transaction http://etherscan.io/tx/0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3
//		BUT! this transaction was AFTER the token creation period as it was done on block 1560028 - it can be considered a donation to the extraBalance	
// question IS THERE A WAY TO TELL if the transaction worked?



//but between the 2 blocks that generated the extraBalance (1520861 <-> 1599205)
//he only made these INCOMING transactions - none of which is to the dao
// 
// 0x76fa0a31f08e135e984e343b4a905d3162afb33bfdc9bdeaf44f935c8a1e7736	1564044	82 days 23 hrs ago	0x32be343b94f860124dc4fee278fdcbd38c102d88	IN	 0x01861c6dfab20bae0fa4ee698912630697d78ce4	1,645.75215663 Ether	0.00087732
// 0x4877ecba6eaca7b1d0265f8cdb665ebbc7eb87196d7656dc22c80b59784b82f5	1563902	83 days 4 mins ago	0x32be343b94f860124dc4fee278fdcbd38c102d88	IN	 0x01861c6dfab20bae0fa4ee698912630697d78ce4	642.28680918 Ether	0.00087732
// 0x059c5aebd7d40318c8331c0c9a19dafd7536e796a0e76e29aa57af12d6cef946	1563902	83 days 4 mins ago	0x32be343b94f860124dc4fee278fdcbd38c102d88	IN	 0x01861c6dfab20bae0fa4ee698912630697d78ce4	1,080.94522232 Ether	0.00087732
//*** 0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3	1560028	83 days 15 hrs ago	0x01a7d9fa7d0eb1185c67e54da83c2e75db69e39f	IN	 0x01861c6dfab20bae0fa4ee698912630697d78ce4	0 Ether	0.00101768
// 0x19b91efa6149f13c641da6ce91db204be639cf151d8c195a09f62b63dfd0a635	1559989	83 days 15 hrs ago	0x562a8dcbbeeef7b360685d27303bd69e094accf6	IN	 0x01861c6dfab20bae0fa4ee698912630697d78ce4	0 Ether	0.0036232
// 0xcfa295fa17b3d4b1a6b823d69173b750c9774d7b96889c2da6e871eca3847b43	1521122	90 days 2 hrs ago	0x32be343b94f860124dc4fee278fdcbd38c102d88	IN	 0x01861c6dfab20bae0fa4ee698912630697d78ce4	965.20227968 Ether	0.00087732

// THIS TRANSACTION IS "TO THE DAO" > it's actually TO a contract  ("0x01861c6dfab20bae0fa4ee698912630697d78ce4") that calls theDAO creation token
// http://etherscan.io/tx/0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3
// it also has a weird structure in Etherscan - it looks as if it had an extra donation to the DAO
// 	 Contract 0x01861c6dfab20bae0fa4ee698912630697d78ce4  
// 80,000 TheDAO CREATION From 0xbb9bc244d798123fde783fcc1c72d3bb8c189413 to  0x01861c6dfab20bae0fa4ee698912630697d78ce4
// TRANSFER  1,080 Ether  to  0xbb9bc244d798123fde783fcc1c72d3bb8c189413
// TRANSFER  280 Ether  to  0x807640a13483f8ac783c557fcdf27be11ea4ac7a    
 

// HOWEVER...
// if you look at theDAO Token Holder Address 
// http://etherscan.io/token/TheDAO?a=0x01861c6dfab20bae0fa4ee698912630697d78ce4
// you will see that there are 3 transactions to theDAO marked as "CREATION", one oddly enough in block 1560028 which is after the end of the creation period
// the first 2 transactions have gone directly to theDAO, but probably, not having called the createTokenProxy function they simply resulted in donations to the DAO
// only the 3rd transaction send 280 ETH to the extraBalance


// reading the simple transaction
// the "TO" field is NOT the DAO, it's a custom contract  "0x01861c6dfab20bae0fa4ee698912630697d78ce4"  (is this an address that I have? > NO) 
// IMPORTANT: by looking at the simplified transaction (output here after) THERE IS NO WAY OF TELLING THAT THE DAO IS INVOLVED > you can do this only by TRACING the transaction
var tx = web3.eth.getTransaction("0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3")
/*{
  blockHash: "0xdbcdcca0041635dbe3eee05305773c9aeaf18e9e87763ee46d49bce5c17edba3",
  blockNumber: 1560028,     						  // important this block was AFTER the creation period, so w shouldn't calculate it
  from: "0x01a7d9fa7d0eb1185c67e54da83c2e75db69e39f",
  gas: 200000,
  gasPrice: 20000000000,
  hash: "0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3",
  input: "0x797af627ea5d61270780378a5acbb51623e55ee767ad2bfb16ce967324af620ed5219e8d",
  nonce: 24,
  to: "0x01861c6dfab20bae0fa4ee698912630697d78ce4",   // Not TO the DAO, but to custom contract that CALLS THE DAO
  transactionIndex: 4,
  value: 0       									  // value = 0 then it didn't work?
} 
*/ 


// TRACING THE TRANSACTION
// it can be tricky to identify that the end destination is theDAO as well
// if you search for "CALL" functions, unlike all other transactions to the dao (either direct or proxied), you will notice that there are 2 "CALL" (while the others only had one "CALL" function)
// the first one is probably to the contract's own internal function, and the second one to theDAO Token creation function
// if you read the stack of the second CALL function you will recognize the 00000966 that we have learned to recognize as the function identifying a "direct" transaction 
var txTrace = debug.traceTransaction("0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3")
var txCall = _.where( txTrace.structLogs, {"op": "CALL"}); // use _.where instead of _.findWhere because there is MORE than one "CALL" function 
/*
[{
    depth: 2,
    error: "",
    gas: 25007,
    gasCost: 119254,
    memory: ["ea5d61270780378a5acbb51623e55ee767ad2bfb16ce967324af620ed5219e8d", "0000000000000000000000000000000000000000000000000000000000000109", "0000000000000000000000000000000000000000000000000000000000000060", "00000000000000000000000001a7d9fa7d0eb1185c67e54da83c2e75db69e39f", "ea5d61270780378a5acbb51623e55ee767ad2bfb16ce967324af620ed5219e8d"],
    op: "CALL",
    pc: 2835,
    stack: ["00000000000000000000000000000000000000000000000000000000797af627", "00000000000000000000000000000000000000000000000000000000000003c6", "ea5d61270780378a5acbb51623e55ee767ad2bfb16ce967324af620ed5219e8d", "0000000000000000000000000000000000000000000000000000000000000000", "ea5d61270780378a5acbb51623e55ee767ad2bfb16ce967324af620ed5219e8d", "000000000000000000000000bb9bc244d798123fde783fcc1c72d3bb8c189413", "00000000000000000000000000000000000000000000003a8c02c5ea2de00000", "0000000000000000000000000000000000000000000000000000000000000060", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000060", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000060", "00000000000000000000000000000000000000000000003a8c02c5ea2de00000", "000000000000000000000000bb9bc244d798123fde783fcc1c72d3bb8c189413", "000000000000000000000000000000000000000000000000000000000001ae86"],
    storage: {
      36f976ccbfd7982db6af6c5bdae0d5bbe20bfbd17e13a0d162f88c18e4b470e3: "0000000000000000000000000000000000000000000000000000000000000000",
      36f976ccbfd7982db6af6c5bdae0d5bbe20bfbd17e13a0d162f88c18e4b470e4: "0000000000000000000000000000000000000000000000000000000000000000",
      36f976ccbfd7982db6af6c5bdae0d5bbe20bfbd17e13a0d162f88c18e4b470e5: "0000000000000000000000000000000000000000000000000000000000000000",
      4c0be60200faa20559308cb7b5a1bb3255c16cb1cab91f525b5ae7a03d02fac3: "0000000000000000000000000000000000000000000000000000000000000000"
    }
}, {
    depth: 3,
    error: "",
    gas: 25007,
    gasCost: 86505,
    memory: ["0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000060"],
    op: "CALL",
    pc: 2761,
    stack: ["0000000000000000000000000000000000000000000000000000000000000966", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000980", "00000000000000000000000001861c6dfab20bae0fa4ee698912630697d78ce4", "0000000000000000000000000000000000000000000000000000000000000000", "00000000000000000000000000000000000000000000002b5e3af16b18800000", "000000000000000000000000807640a13483f8ac783c557fcdf27be11ea4ac7a", "00000000000000000000000000000000000000000000000f2dc7d47f15600000", "0000000000000000000000000000000000000000000000000000000000000060", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000060", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000060", "00000000000000000000000000000000000000000000000f2dc7d47f15600000", "000000000000000000000000807640a13483f8ac783c557fcdf27be11ea4ac7a", "0000000000000000000000000000000000000000000000000000000000012e99"],
    storage: {}
}]   
*/



// TRANSACTION RECEIPT - might hold a clue to save time to indentify these transactions
var txReceipt = web3.eth.getTransactionReceipt("0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3")
/*
{
  blockHash: "0xdbcdcca0041635dbe3eee05305773c9aeaf18e9e87763ee46d49bce5c17edba3",
  blockNumber: 1560028,
  contractAddress: null,
  cumulativeGasUsed: 194844,
  from: "0x01a7d9fa7d0eb1185c67e54da83c2e75db69e39f",
  gasUsed: 50884,
  logs: [{
      address: "0x01861c6dfab20bae0fa4ee698912630697d78ce4",
      blockHash: "0xdbcdcca0041635dbe3eee05305773c9aeaf18e9e87763ee46d49bce5c17edba3",
      blockNumber: 1560028,
      data: "0x00000000000000000000000001a7d9fa7d0eb1185c67e54da83c2e75db69e39fea5d61270780378a5acbb51623e55ee767ad2bfb16ce967324af620ed5219e8d",
      logIndex: 1,
      topics: ["0xe1c52dc63b719ade82e8bea94cc41a0d5d28e4aaf536adb5e9cccc9ff8c1aeda"],
      transactionHash: "0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3",
      transactionIndex: 4
  }, {
      address: "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
      blockHash: "0xdbcdcca0041635dbe3eee05305773c9aeaf18e9e87763ee46d49bce5c17edba3",
      blockNumber: 1560028,
      data: "0x00000000000000000000000000000000000000000000002b5e3af16b18800000",
      logIndex: 2,
      topics: ["0xdbccb92686efceafb9bb7e0394df7f58f71b954061b81afb57109bf247d3d75a", "0x00000000000000000000000001861c6dfab20bae0fa4ee698912630697d78ce4"],
      transactionHash: "0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3",
      transactionIndex: 4
  }, {
      address: "0x01861c6dfab20bae0fa4ee698912630697d78ce4",
      blockHash: "0xdbcdcca0041635dbe3eee05305773c9aeaf18e9e87763ee46d49bce5c17edba3",
      blockNumber: 1560028,
      data: "0x00000000000000000000000001a7d9fa7d0eb1185c67e54da83c2e75db69e39fea5d61270780378a5acbb51623e55ee767ad2bfb16ce967324af620ed5219e8d00000000000000000000000000000000000000000000003a8c02c5ea2de00000000000000000000000000000bb9bc244d798123fde783fcc1c72d3bb8c18941300000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000",
      logIndex: 3,
      topics: ["0xe7c957c06e9a662c1a6c77366179f5b702b97651dc28eee7d5bf1dff6e40bb4a"],
      transactionHash: "0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3",
      transactionIndex: 4
  }],
  root: "e662c64a5412baf96c60625b560325a564c59072c510b02c490ce2205f3e8bcc",
  to: "0x01861c6dfab20bae0fa4ee698912630697d78ce4",
  transactionHash: "0xca5de508c79be7e6625537610aae201c0ca41bf5e8b553f3decca887aaa62cb3",
  transactionIndex: 4
}
*/







//------------------------------------------- 
// NICK EXTRAS  ADDRESS 2
// ["0x025abad6de060f94cc6c9a98d4e7637f97288f08","6333333333333333333"]
//-------------------------------------------
// it'a contract 




 

//*****************************************************************************************************************************************/

//--------------------------------------------------------------------------------------- 
// BB EXTRAS  ADDRESS 
// {"address":"0x1fbf2f94d91ad989ea132ae0597b6b71d059f2cc","totETH":"356933333333334"}
// {"address":"0x1fbf2f94d91ad989ea132ae0597b6b71d059f2cc","balanceTot":"356933333333334",
// "transactions":[{"ebWei":"356933333333334","hash":"0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1","type":"direct"}]}
//---------------------------------------------------------------------------------------
 
                          

// OUT OF GAS  // http://etherscan.io/tx/0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1
/*
{
  blockHash: "0x390ca90a3d92f6d71da62ef2753399f3a2d46aa2a055af53cd415dda79a044e4",
  blockNumber: 1521125,
  from: "0x1fbf2f94d91ad989ea132ae0597b6b71d059f2cc",
  gas: 50960,
  gasPrice: 20000000000,
  hash: "0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1",
  input: "0x",
  nonce: 1,
  to: "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
  transactionIndex: 23,
  value: 7495600000000000
}
*/
 
var txReceipt = web3.eth.getTransactionReceipt(txRef)
/*
{
  blockHash: "0x390ca90a3d92f6d71da62ef2753399f3a2d46aa2a055af53cd415dda79a044e4",
  blockNumber: 1521125,
  contractAddress: null,
  cumulativeGasUsed: 598226,
  from: "0x1fbf2f94d91ad989ea132ae0597b6b71d059f2cc",
  gasUsed: 50960,
  logs: [],
  root: "39218f5a029f4b39e098e682118994f7ecd37df04171b7e2060ec0c0868a6b48",
  to: "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
  transactionHash: "0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1",
  transactionIndex: 23
}
*/

// maybe one can determine out of gas if cumulativeGasUsed: 598226, > gasUsed: 50960, ??



// var txTrace = debug.traceTransaction(txRef)
var last = txTrace.structLogs.pop()  // error == "Out of gas"
{
      depth: 1,
      error: "Out of gas",
      gas: 28958,
      gasCost: 1.157920892373162e+77,
      memory: ["0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000060"],
      op: "CALL",
      pc: 2761,
      stack: ["0000000000000000000000000000000000000000000000000000000000000966", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000980", "0000000000000000000000001fbf2f94d91ad989ea132ae0597b6b71d059f2cc", "0000000000000000000000000000000000000000000000000000000000000000", "00000000000000000000000000000000000000000000000000195c945ad62aaa", "000000000000000000000000807640a13483f8ac783c557fcdf27be11ea4ac7a", "000000000000000000000000000000000000000000000000000144a1048ab556", "0000000000000000000000000000000000000000000000000000000000000060", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000060", "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000060", "000000000000000000000000000000000000000000000000000144a1048ab556", "000000000000000000000000807640a13483f8ac783c557fcdf27be11ea4ac7a", "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec1f"],
      storage: {}
}

  


//--------------- ADDRESS 2  ALL TX out of gas
//{"address":"0xf8752cb5b9032135b2e27dd38727061c749caca9","balanceTot":"852546430300846409","transactions":[
//{"ebWei":"189152690150423204","hash":"0xaead37f6f1a0b7ba1fac8b973fe88ca378a42444d3cd8bc61b5b7eeb67e7432f","type":"direct"},  // Out of gas
//{"ebWei":"189104156817089871","hash":"0xd8dd48c9563f6c71baa2a278d75ee9f83235ba2aed80dd1d58718ba04a502487","type":"direct"},
//{"ebWei":"474289583333333334","hash":"0xe17d270fd1e9a6802ae0a30ca3d5260b8d01d10513576afd716f33c294e3ccb3","type":"direct"}]},
      


//********************************************************************************
// TESTING OUT OF GAS FUNCTION

function isOutOfGas(tx) {
	console.log("typeof tx " + typeof(tx))
	var sl;
	if (typeof(tx) == "string") {
		//it' a string - then you need to trace the transaction
		var txTrace = debug.traceTransaction(tx);
		sl = txTrace.structLogs[ txTrace.structLogs.length-1 ]
	
	} else if (typeof(tx) == "object" && tx.structLogs != undefined) {
		//it already a trace transaction - simply check the last 
		sl = tx.structLogs
	}
	var lastLog = sl[ s.length -1 ];
	return (lastLog.error == "Out of gas")
}  

// testing with a string  0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1
var test1 = isOutOfGas("0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1")
console.log("test1 - string: " + test1) 

//testing with a Tx Traced
var txTrace = debug.traceTransaction("0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1")
var test2 = isOutOfGas(txTrace); 
console.log("test2 - string: " + test2)


















