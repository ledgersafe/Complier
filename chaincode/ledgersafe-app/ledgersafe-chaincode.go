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
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

/* Define Asset structure, with 4 properties.
Structure tags are used by encoding/json library
*/

// Asset ...
type Asset struct {
	ObjectType   string `json:"docType"` //docType is used to distinguish the various types of objects in state database
	Key          string `json:"key"`
	Manufacturer string `json:"manufacturer"`
	Timestamp    string `json:"timestamp"` // Date --> BSA SAR
	Holder       string `json:"holder"`    // SubjectName --> BSA SAR
	AssetType    string `json:"assetType"`
	Quantity     string `json:"quantity"`
	Amount       string `json:"amount"` // Amount --> BSA SAR ... Currency Always USD
	// PartyID will be a hash of the name and time created ?
}

/*
 * The Init method *
 called when the Smart Contract "asset-chaincode" is instantiated by the network
 * Best practice is to have any Ledger initialization in separate function
 -- see initLedger()
*/
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	fmt.Println("INIT")
	return shim.Success(nil)
}

/*
 * The Invoke method *
 called when an application requests to run the Smart Contract "asset-chaincode"
 The app also specifies the specific smart contract function to call with args
*/
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	fmt.Println("INVOKE")
	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger
	if function == "queryAsset" {
		return s.queryAsset(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "recordAsset" {
		return s.recordAsset(APIstub, args)
	} else if function == "queryAllAsset" {
		return s.queryAllAsset(APIstub)
	} else if function == "changeAssetHolder" {
		return s.changeAssetHolder(APIstub, args)
	} else if function == "getHistory" {
		return s.getHistory(APIstub, args)
	} else if function == "addAsset" {
		return s.addAsset(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

/*
 * The queryAsset method *
Used to view the records of one particular asset
It takes one argument -- the key for the asset in question
*/
func (s *SmartContract) queryAsset(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	assetAsBytes, _ := APIstub.GetState(args[0])
	if assetAsBytes == nil {
		return shim.Error("Could not locate asset")
	}
	return shim.Success(assetAsBytes)
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
		fmt.Printf("Holder: %s", string(queryResponse.Value))
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

	fmt.Printf("- queryBusiness:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())

}

/*
 * The initLedger method *
Will add test data (10 assetes)to our network
*/
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	fmt.Println("Initializing Ledger!")
	asset := []Asset{
		Asset{Key: "1", Manufacturer: "Farm 1", AssetType: "Plants", Quantity: "10", Timestamp: "1504054225", Holder: "Miriam", Amount: "3000.00"},
		Asset{Key: "2", Manufacturer: "Farm 2", AssetType: "Plants", Quantity: "25", Timestamp: "1504057825", Holder: "Dave", Amount: "1000.00"},
		Asset{Key: "3", Manufacturer: "San Diego Candles", AssetType: "Home Goods", Quantity: "3", Timestamp: "1493517025", Holder: "Igor", Amount: "9000.00"},
		Asset{Key: "4", Manufacturer: "SD Pharamceuticals", AssetType: "Medicine", Quantity: "100 mg", Timestamp: "1496105425", Holder: "Amalea", Amount: "7000.00"},
		Asset{Key: "5", Manufacturer: "Denver Manufacturers", AssetType: "Metals", Quantity: "24.5 lb", Timestamp: "1493512301", Holder: "Rafa", Amount: "100.00"},
		Asset{Key: "6", Manufacturer: "Genetic Farm", AssetType: "Medicine", Quantity: "40 g", Timestamp: "1494117101", Holder: "Shen", Amount: "700.00"},
		Asset{Key: "7", Manufacturer: "Organic Herb Farm", AssetType: "Plants", Quantity: "23", Timestamp: "1496104301", Holder: "Leila", Amount: "200.00"},
		Asset{Key: "8", Manufacturer: "Mr. Plastic", AssetType: "Plastics", Quantity: "7.9 lb", Timestamp: "1485066691", Holder: "Yuan", Amount: "800.00"},
		Asset{Key: "9", Manufacturer: "Pub n Sudz", AssetType: "Home Goods", Quantity: "5", Timestamp: "1485153091", Holder: "Carlo", Amount: "500.00"},
		Asset{Key: "10", Manufacturer: "Danny Fung Rolls Royce", AssetType: "Automobiles", Quantity: "1", Timestamp: "1487745091", Holder: "Fatima", Amount: "400,000.00"},
	}

	i := 0
	for i < len(asset) {
		fmt.Println("i is ", i)
		assetAsBytes, _ := json.Marshal(asset[i])
		APIstub.PutState(strconv.Itoa(i+1), assetAsBytes)
		fmt.Println("Added", asset[i])
		i = i + 1
	}

	var err = APIstub.PutState("res", []byte("InitSuccess"))
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

func (s *SmartContract) addAsset(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println("Initializing Ledger!")

	key := args[0]
	manufacturer := args[1]
	assetType := args[2]
	quantity := args[3]
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	holder := args[4]
	amount := "0.00"

	newAsset := Asset{Key: key, Manufacturer: manufacturer, AssetType: assetType, Quantity: quantity, Timestamp: timestamp, Holder: holder, Amount: amount}

	assetAsBytes, _ := json.Marshal(newAsset)
	var err = APIstub.PutState(key, assetAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

/*
 * The recordAsset method *
Fisherman like Sarah would use to record each of her assetes.
This method takes in five arguments (attributes to be saved in the ledger).
*/
func (s *SmartContract) recordAsset(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	var asset = Asset{Key: args[0], Manufacturer: args[1], AssetType: args[2], Quantity: args[3], Timestamp: args[4], Holder: args[5], Amount: args[6]}

	assetAsBytes, _ := json.Marshal(asset)
	err := APIstub.PutState(args[0], assetAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record asset: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The queryAllAsset method *
allows for assessing all the records added to the ledger(all assetes)
This method does not take any arguments. Returns JSON string containing results.
*/
func (s *SmartContract) queryAllAsset(APIstub shim.ChaincodeStubInterface) sc.Response {

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

	fmt.Printf("- queryAllAsset:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

/*
 * The changeAssetHolder method *
The data in the world state can be updated with who has possession.
This function takes in 2 arguments, asset id and new holder name.
*/
func (s *SmartContract) changeAssetHolder(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	assetAsBytes, _ := APIstub.GetState(args[0])
	if assetAsBytes == nil {
		return shim.Error("Could not locate asset")
	}
	asset := Asset{}

	json.Unmarshal(assetAsBytes, &asset)

	fmt.Printf("Current Holder: %s", asset.Holder)
	fmt.Printf("New Holder: %s", args[1])
	fmt.Printf("New Amount: %s", args[2])
	// Normally check that the specified argument is a valid holder of asset
	// we are skipping this check for this example
	asset.Holder = args[1]
	asset.Amount = args[2]

	assetAsBytes, _ = json.Marshal(asset)
	err := APIstub.PutState(args[0], assetAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change asset holder: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
//////////////////////////////////// New Functions ///////////////////////////////////////////////////////
*/

// ============================================================================================================================
// Get history of asset
//
// Shows Off GetHistoryForKey() - reading complete history of a key/value
//
// Inputs - Array of strings
//  0
//  id
//  "m01490985296352SjAyM"
// ============================================================================================================================
func (s *SmartContract) getHistory(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	type AuditHistory struct {
		TxID  string `json:"txId"`
		Value Asset  `json:"value"`
	}
	//var history []AuditHistory
	//var asset Asset

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	key := args[0]
	fmt.Printf("- start getHistoryForAssetAsset: %s\n", key)

	// Get History
	resultsIterator, err := stub.GetHistoryForKey(key)
	if err != nil {
		fmt.Println("ERROR ON ITERATOR", err.Error())
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// fmt.Println(resultsIterator)
	// for resultsIterator.HasNext() {
	// 	historyData, err := resultsIterator.Next()
	// 	if err != nil {
	// 		return shim.Error(err.Error())
	// 	}
	// 	fmt.Println(historyData)
	// 	var tx AuditHistory
	// 	tx.TxID = historyData.TxId                   //copy transaction id over
	// 	json.Unmarshal(historyData.Value, &asset) //un stringify it aka JSON.parse()
	// 	if historyData.Value == nil {                //marble has been deleted
	// 		var asset Asset
	// 		tx.Value = asset // nil //emptyAsset //copy nil marble
	// 	} else {
	// 		json.Unmarshal(historyData.Value, &asset) //un stringify it aka JSON.parse()
	// 		tx.Value = asset                          //copy marble over
	// 	}
	// 	history = append(history, tx) //add this tx to the list
	// }
	// fmt.Printf("- getHistoryForMarble returning:\n%s", history)

	// //change to array of bytes
	// historyAsBytes, _ := json.Marshal(history) //convert to array of bytes
	// return shim.Success(historyAsBytes)

	// buffer is a JSON array containing historic values for the marble
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		//as-is (as the Value itself a JSON marble)
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryForAsset returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

/*
func (s *SmartContract) getAllHistoryForBusiness(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	type AuditHistory struct {
		TxID  string `json:"txId"`
		Value Asset  `json:"value"`
	}
	//var history []AuditHistory
	//var asset Asset

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	startKey := "0"
	endKey := "999"
	//fmt.Printf("- start getHistoryForAssetAsset: %s\n", key)

	// Get History

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

		historyIterator, err := stub.GetHistoryForKey(queryResponse.Key)
		if err != nil {
			fmt.Println("ERROR ON ITERATOR", err.Error())
			return shim.Error(err.Error())
		}
		for historyIterator.HasNext() {
			response, err := historyIterator.Next()
			if err != nil {
				return shim.Error(err.Error())
			}


			var obj = string(response.Value)
			if obj.holder == args[0] { // Need to Figure this out ...
				if bArrayMemberAlreadyWritten == true {
					buffer.WriteString(",")
				}
				buffer.WriteString("{\"TxId\":")
				buffer.WriteString("\"")
				buffer.WriteString(response.TxId)
				buffer.WriteString("\"")

				buffer.WriteString(", \"Value\":")
				// if it was a delete operation on given key, then we need to set the
				//corresponding value null. Else, we will write the response.Value
				//as-is (as the Value itself a JSON marble)
				if response.IsDelete {
					buffer.WriteString("null")
				} else {
					buffer.WriteString(string(response.Value))
				}

				buffer.WriteString(", \"Timestamp\":")
				buffer.WriteString("\"")
				buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
				buffer.WriteString("\"")

				buffer.WriteString(", \"IsDelete\":")
				buffer.WriteString("\"")
				buffer.WriteString(strconv.FormatBool(response.IsDelete))
				buffer.WriteString("\"")

				buffer.WriteString("}")
				bArrayMemberAlreadyWritten = true
			}

			// IF the Key contains the holder then write it ...
			// Add a comma before array members, suppress it for the first array member
		}
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryofBusiness returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}
*/

/*
//////////////////////////////////// End of New Functions ///////////////////////////////////////////////////////
*/

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
