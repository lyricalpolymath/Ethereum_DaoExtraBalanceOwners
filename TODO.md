//TODO
	xx parse Nick's 140 addresses     		
	xx	- look for the transactions that made up his balance > probably using his method
	
	- Trace Nicks transactions for the 140 addresses
		- modify the ethTraceParser to look for more than one CALL opcodes
		- find all "CALL" opcodes
			- loop through them and look if there is one that has a direct or proxied transaction to theDAO
				- extract the values sent to the Extrabalance
				- create the trace object
   			- add the address and it's value and it's transactions to theDAOExtraBalanceOwners

	- parse all transactions for Out of Gas or other errors - and exclude those that should not be there
	
	- calculate totals and compare with Nick and bookypoobahs

    - optional - parse nicks and your's output to see if there are large discrepancies in ETH values
 	- optional - use Nicks Method to calculate how many transactions he is considering and confront them with your method



  //DONE (top older > bottom newer)
	- parsed the whole blockchain looking for addresses TO theDAO
	- reparsed the blockchain tracing every transaction TO theDAO and differentiating direct and proxied transactions by looking at the stack
	- confronted with Nicks result and improved my output by
		- solving the 39 transactions assigned to the "undefined" address, only because thy had an inputData
		- eliminated 62 addresses that Nick didn't have that were all due to out of gas exceptions
		- analized Nicks 141 extra addresses and understood that 140 where smart contract addresses
			and 1 was a normal address due to the very last transaction being skipped by the original extraBalanceOwners script (corrected all this)
			
			



Things to test
xx1- direct trasaction          1592248, "0x29f564543d22a5dd86c42cce039d071df89191f9a5dede211493372601e79a38"
xx2- proxied transaction        1534687, "0x0ad78201811a6dbe74f9e6510282f2b887f5c04201be559e073584842bec6360"
xx3- 39 transactions > one with input data
xx4- smart contract transaction (Nick 140 addresses) 1595058, "0x9b9cc86509f86070edea8761c6e36e704e988fb57962838716df6746d2031303"
xx 5- out of gas                   1521125, 0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1






// 1+2 DIRECT AND PROXIED TRANSACTION
// blocks  1534687   and 1592248
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
    },
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


// 3- WITH INPUT DATA
// Block 	1537724 
"0x416bdadc20ae5238ea7b1373fb783e893d51048e": {
        "address": "0x416bdadc20ae5238ea7b1373fb783e893d51048e",
        "ebWei": "4693695652173913044",
        "transactions" : [
            {
                "hash": "0xeea3be70ab2204693fb0bc30a37ab09aa47f790bd61f058efd7c2be4fa64a66b",
                "inputDataHex": "0x64616f20",
                "inputDataString": "dao ",
                "txType": "direct",
                "block": 	1537724 
            }
        ]   
    },


// 4 - SMART Contract Transaction
// Block 1595058
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
    },



// 5 - Out of GAS
// Block 1521125 
// transaction 0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1
"0x1fbf2f94d91ad989ea132ae0597b6b71d059f2cc" : {
    "address": "0x1fbf2f94d91ad989ea132ae0597b6b71d059f2cc",
    "transactions": [{
        "hash" "0x07a3d34f3618d4aa042b60f41bff8bb12192540538a179626e31fa27ecf164a1";
        "block": 1521125,
        isOutOfGas: true
    }]