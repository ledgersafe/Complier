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

/* Define Cannabis structure, with 4 properties.
Structure tags are used by encoding/json library
*/
type Cannabis struct {
	Grower    string `json:"grower"`
	Timestamp string `json:"timestamp"`
	Holder    string `json:"holder"`
	Strain    string `json:"strain"`
	THC       string `json:"thc"`
	Amount    string `json:"amount"`
}

type newCannabis struct {
	Grower      string `json:"grower"`
	Timestamp   string `json:"timestamp"`
	Holder      string `json:"holder"`
	Strain      string `json:"strain"`
	THC         string `json:"thc"`
	SubjectName string `json:"subjectname"`
	PartyID     string `json:"partyid"`
	Amount      string `json:"amount"`
	Currency    string `json:"currency"`
	Date        string `json:"date"`
}

/*
 * The Init method *
 called when the Smart Contract "cannabis-chaincode" is instantiated by the network
 * Best practice is to have any Ledger initialization in separate function
 -- see initLedger()
*/
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method *
 called when an application requests to run the Smart Contract "cannabis-chaincode"
 The app also specifies the specific smart contract function to call with args
*/
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger
	if function == "queryCannabis" {
		return s.queryCannabis(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "recordCannabis" {
		return s.recordCannabis(APIstub, args)
	} else if function == "queryAllCannabis" {
		return s.queryAllCannabis(APIstub)
	} else if function == "changeCannabisHolder" {
		return s.changeCannabisHolder(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

/*
 * The queryCannabis method *
Used to view the records of one particular cannabis
It takes one argument -- the key for the cannabis in question
*/
func (s *SmartContract) queryCannabis(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	cannabisAsBytes, _ := APIstub.GetState(args[0])
	if cannabisAsBytes == nil {
		return shim.Error("Could not locate cannabis")
	}
	return shim.Success(cannabisAsBytes)
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
		fmt.Printf("Holder: %s", string(queryResponse.Value.holder))
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
Will add test data (10 cannabis catches)to our network
*/
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	cannabis := []Cannabis{
		Cannabis{Grower: "Farm 1", Strain: "67.0006", THC: "-70.5476", Timestamp: "1504054225", Holder: "Miriam", Amount: "3000.00"},
		Cannabis{Grower: "SF Farm", Strain: "62.0006", THC: "-70.5476", Timestamp: "1504057825", Holder: "Dave", Amount: "1000.00"},
		Cannabis{Grower: "Farm 3", Strain: "63.0006", THC: "-70.5476", Timestamp: "1493517025", Holder: "Igor", Amount: "9000.00"},
		Cannabis{Grower: "Humbolt County Farms", Strain: "64.0006", THC: "-30.5476", Timestamp: "1496105425", Holder: "Amalea", Amount: "7000.00"},
		Cannabis{Grower: "Denver Growers", Strain: "65.0006", THC: "-20.5476", Timestamp: "1493512301", Holder: "Rafa", Amount: "100.00"},
		Cannabis{Grower: "BC Farms", Strain: "66.0006", THC: "-10.5476", Timestamp: "1494117101", Holder: "Shen", Amount: "700.00"},
		Cannabis{Grower: "Organic Herb Farms", Strain: "68.0006", THC: "-60.5476", Timestamp: "1496104301", Holder: "Leila", Amount: "200.00"},
		Cannabis{Grower: "Hannabis Farms", Strain: "67.0006", THC: "-70.5476", Timestamp: "1485066691", Holder: "Yuan", Amount: "800.00"},
		Cannabis{Grower: "CannaFarms", Strain: "69.0006", THC: "-50.5476", Timestamp: "1485153091", Holder: "Carlo", Amount: "4500.00"},
		Cannabis{Grower: "MedMen", Strain: "89.0006", THC: "-40.5476", Timestamp: "1487745091", Holder: "Fatima", Amount: "1500.00"},
	}

	i := 0
	for i < len(cannabis) {
		fmt.Println("i is ", i)
		cannabisAsBytes, _ := json.Marshal(cannabis[i])
		APIstub.PutState(strconv.Itoa(i+1), cannabisAsBytes)
		fmt.Println("Added", cannabis[i])
		i = i + 1
	}

	return shim.Success(nil)
}

/*
 * The newInitLedger method *
Will add test data (10 cannabis catches)to our network
*/
func (s *SmartContract) newInitLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	newcannabis := []newCannabis{
		newCannabis{Grower: "Farm 1", Strain: "67.0006", THC: "-70.5476", Timestamp: "1504054225",
			Holder: "Miriam", SubjectName: "Miriam", PartyID: "MM", Amount: "1000.00", Currency: "USD",
			Date: "10152019"},
	}

	i := 0
	for i < len(newcannabis) {
		fmt.Println("i is ", i)
		cannabisAsBytes, _ := json.Marshal(newcannabis[i])
		APIstub.PutState(strconv.Itoa(i+1), cannabisAsBytes)
		fmt.Println("Added", newcannabis[i])
		i = i + 1
	}

	return shim.Success(nil)
}

/*
 * The recordCannabis method *
Fisherman like Sarah would use to record each of her cannabis catches.
This method takes in five arguments (attributes to be saved in the ledger).
*/
func (s *SmartContract) recordCannabis(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	var cannabis = Cannabis{Grower: args[1], Strain: args[2], THC: args[3], Timestamp: args[4], Holder: args[5], Amount: args[6]}

	cannabisAsBytes, _ := json.Marshal(cannabis)
	err := APIstub.PutState(args[0], cannabisAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record cannabis catch: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The queryAllCannabis method *
allows for assessing all the records added to the ledger(all cannabis catches)
This method does not take any arguments. Returns JSON string containing results.
*/
func (s *SmartContract) queryAllCannabis(APIstub shim.ChaincodeStubInterface) sc.Response {

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

	fmt.Printf("- queryAllCannabis:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

/*
 * The changeCannabisHolder method *
The data in the world state can be updated with who has possession.
This function takes in 2 arguments, cannabis id and new holder name.
*/
func (s *SmartContract) changeCannabisHolder(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	cannabisAsBytes, _ := APIstub.GetState(args[0])
	if cannabisAsBytes == nil {
		return shim.Error("Could not locate cannabis")
	}
	cannabis := Cannabis{}

	json.Unmarshal(cannabisAsBytes, &cannabis)

	fmt.Printf("Current Holder:", cannabis.Holder)
	fmt.Printf("New Holder: ", args[1])
	// Normally check that the specified argument is a valid holder of cannabis
	// we are skipping this check for this example
	cannabis.Holder = args[1]

	cannabisAsBytes, _ = json.Marshal(cannabis)
	err := APIstub.PutState(args[0], cannabisAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change cannabis holder: %s", args[0]))
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
