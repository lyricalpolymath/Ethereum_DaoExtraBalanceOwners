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
			
			


