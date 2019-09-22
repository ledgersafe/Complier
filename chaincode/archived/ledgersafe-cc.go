// SPDX-License-Identifier: Apache-2.0

/*
  Sample Chaincode based on Demonstrated Scenario

 This code is based on code written by the Hyperledger Fabric community.
  Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/chaincode/fabcar/fabcar.go
*/

package main

/* Imports
* 4 utility libraries for handling bytes, reading and writing JSON,
formatting, and string manipulation
* 2 specific Hyperledger Fabric specific libraries for Smart Contracts
*/
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

/* Define Asset structure, with 4 properties.
Structure tags are used by encoding/json library
*/
type Asset struct {
	Manufacturer    string `json:"manufacturer"`
	Timestamp string `json:"timestamp"`
	Location  string `json:"location"`
	Holder    string `json:"holder"`
}

/*
 * The Init method *
 called when the Smart Contract "asset-chaincode" is instantiated by the network
 * Best practice is to have any Ledger initialization in separate function
 -- see initLedger()
*/
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method *
 called when an application requests to run the Smart Contract "asset-chaincode"
 The app also specifies the specific smart contract function to call with args
*/
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger
	if function == "queryBusiness" {
		return s.queryBusiness(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "queryFI" {
		return s.queryFI(APIstub, args)
	} else if function == "queryAllTransactions" {
		return s.queryAllTransactions(APIstub)
	} else if function == "b2cTransaction" {
		return s.b2cTransaction(APIstub, args)
	} else if function == "b2bTransaction" {
		return s.b2bTransaction(APIstub, args)
	}else if function == "deposit" {
		return s.deposit(APIstub, args)
	}else if function == "withrdawal" {
		return s.withdrawal(APIstub, args)
	}
	return shim.Error("Invalid Smart Contract function name.")
}


/*
 * The queryBusiness method *
Used to view the records of one particular business
It takes one argument -- the key for the business in question
*/
func (s *SmartContract) queryBusiness(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	businessAsBytes, _ := APIstub.GetState(args[0])
	if businessAsBytes == nil {
		return shim.Error("Could not locate business")
	}
	return shim.Success(businessAsBytes)
}

/*
 * The queryFI method *
Used to view the records of one particular Financial institution
It takes one argument -- the key for the FI in question
*/
func (s *SmartContract) queryFI(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	FIAsBytes, _ := APIstub.GetState(args[0])
	if FIAsBytes == nil {
		return shim.Error("Could not locate business")
	}
	return shim.Success(FIAsBytes)
}

/*
 * The queryAllTransactions method *
allows for assessing all the records added to the ledger(all assetes)
This method does not take any arguments. Returns JSON string containing results.
*/
func (s *SmartContract) queryAllTransactions(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "0"
	endKey := "999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllTransactions:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}



/*
 * The b2cTransaction method *
 * DESCRIPTION
*/
func (s *SmartContract) b2cTransaction(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	assetAsBytes, _ := APIstub.GetState(args[0])
	if assetAsBytes == nil {
		return shim.Error("Could not locate asset")
	}
	asset := Asset{}

	json.Unmarshal(assetAsBytes, &asset)

	fmt.Printf("Current Holder:", asset.Holder)
	fmt.Printf("New Holder: ", args[1])
	// **TODO**
	// Check Owner of Current Assett
	// Exchange Value from args[1] to Owner of Assett

	//Instead of changing Hodler move asset object into a Customer List 
	asset.Holder = args[1]

	assetAsBytes, _ = json.Marshal(asset)
	err := APIstub.PutState(args[0], assetAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change asset holder: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The b2bTransaction method *
 * DESCRIPTION
*/
func (s *SmartContract) b2bTransaction(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	assetAsBytes, _ := APIstub.GetState(args[0])
	if assetAsBytes == nil {
		return shim.Error("Could not locate asset")
	}
	asset := Asset{}

	json.Unmarshal(assetAsBytes, &asset)

	fmt.Printf("Current Holder:", asset.Holder)
	fmt.Printf("New Holder: ", args[1])
	// **TODO**
	// Check Owner of Current Assett
	// Exchange Value from args[1] to Owner of Assett
	asset.Holder = args[1]

	assetAsBytes, _ = json.Marshal(asset)
	err := APIstub.PutState(args[0], assetAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change asset holder: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The deposit method *
 * DESCRIPTION
*/
func (s *SmartContract) deposit(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	FI = args[0]
	business = args[1]
	amount = args[2]

	fmt.Printf("Businesss:", business)
	fmt.Printf("Financial Institution: ", FI)
	// **TODO**
	// Check Owner of if Biz.balance > amount
	// Exchange Value from Biz to FI

	//assetAsBytes, _ = json.Marshal(asset)
	err := APIstub.PutState(args[0], amount)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change asset holder: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The withdrawal method *
 * DESCRIPTION
*/
func (s *SmartContract) withdrawal(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	
	FI = args[0]
	business = args[1]
	amount = args[2]

	fmt.Printf("Businesss:", business)
	fmt.Printf("Financial Institution: ", FI)
	// **TODO**
	// Check FI to see if the account associated with the business has > amount
	// Exchange Value from FI to Business

	//assetAsBytes, _ = json.Marshal(asset)
	err := APIstub.PutState(args[0], amount)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change asset holder: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The initLedger method *
Will add test data (10 assetes)to our network
*/
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	asset := []Asset{
		Asset{Manufacturer: "Farm 1", Type: "67.0006", Quantity: "-70.5476", Timestamp: "1504054225", Holder: "Miriam"},
		Asset{Manufacturer: "SF Farm", Type: "62.0006", Quantity: "-70.5476", Timestamp: "1504057825", Holder: "Dave"},
		Asset{Manufacturer: "Farm 3", Type: "63.0006", Quantity: "-70.5476", Timestamp: "1493517025", Holder: "Igor"},
		Asset{Manufacturer: "Humbolt County Farms", Type: "64.0006", Quantity: "-30.5476", Timestamp: "1496105425", Holder: "Amalea"},
		Asset{Manufacturer: "Denver Manufacturers", Type: "65.0006", Quantity: "-20.5476", Timestamp: "1493512301", Holder: "Rafa"},
		Asset{Manufacturer: "BC Farms", Type: "66.0006", Quantity: "-10.5476", Timestamp: "1494117101", Holder: "Shen"},
		Asset{Manufacturer: "Organic Herb Farms", Type: "68.0006", Quantity: "-60.5476", Timestamp: "1496104301", Holder: "Leila"},
		Asset{Manufacturer: "Hannabis Farms", Type: "67.0006", Quantity: "-70.5476", Timestamp: "1485066691", Holder: "Yuan"},
		Asset{Manufacturer: "CannaFarms", Type: "69.0006", Quantity: "-50.5476", Timestamp: "1485153091", Holder: "Carlo"},
		Asset{Manufacturer: "MedMen", Type: "89.0006", Quantity: "-40.5476", Timestamp: "1487745091", Holder: "Fatima"},
	}

	i := 0
	for i < len(asset) {
		fmt.Println("i is ", i)
		assetAsBytes, _ := json.Marshal(asset[i])
		APIstub.PutState(strconv.Itoa(i+1), assetAsBytes)
		fmt.Println("Added", asset[i])
		i = i + 1
	}

	return shim.Success(nil)
}



/*
 * main function *
calls the Start function
The main function starts the chaincode in the container during instantiation.
*/
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
