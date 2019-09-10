package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

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
 * The initLedger method *
Will add test data (10 assetes)to our network
*/
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	asset := []Asset{
		Asset{Grower: "Farm 1", Strain: "67.0006", THC: "-70.5476", Timestamp: "1504054225", Holder: "Miriam"},
		Asset{Grower: "SF Farm", Strain: "62.0006", THC: "-70.5476", Timestamp: "1504057825", Holder: "Dave"},
		Asset{Grower: "Farm 3", Strain: "63.0006", THC: "-70.5476", Timestamp: "1493517025", Holder: "Igor"},
		Asset{Grower: "Humbolt County Farms", Strain: "64.0006", THC: "-30.5476", Timestamp: "1496105425", Holder: "Amalea"},
		Asset{Grower: "Denver Growers", Strain: "65.0006", THC: "-20.5476", Timestamp: "1493512301", Holder: "Rafa"},
		Asset{Grower: "BC Farms", Strain: "66.0006", THC: "-10.5476", Timestamp: "1494117101", Holder: "Shen"},
		Asset{Grower: "Organic Herb Farms", Strain: "68.0006", THC: "-60.5476", Timestamp: "1496104301", Holder: "Leila"},
		Asset{Grower: "Hannabis Farms", Strain: "67.0006", THC: "-70.5476", Timestamp: "1485066691", Holder: "Yuan"},
		Asset{Grower: "CannaFarms", Strain: "69.0006", THC: "-50.5476", Timestamp: "1485153091", Holder: "Carlo"},
		Asset{Grower: "MedMen", Strain: "89.0006", THC: "-40.5476", Timestamp: "1487745091", Holder: "Fatima"},
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
 * The recordAsset method *
Fisherman like Sarah would use to record each of her assetes.
This method takes in five arguments (attributes to be saved in the ledger).
*/
func (s *SmartContract) recordAsset(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	var asset = Asset{Grower: args[1], Strain: args[2], THC: args[3], Timestamp: args[4], Holder: args[5]}

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

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	assetAsBytes, _ := APIstub.GetState(args[0])
	if assetAsBytes == nil {
		return shim.Error("Could not locate asset")
	}
	asset := Asset{}

	json.Unmarshal(assetAsBytes, &asset)

	fmt.Printf("Current Holder:", asset.Holder)
	fmt.Printf("New Holder: ", args[1])
	// Normally check that the specified argument is a valid holder of asset
	// we are skipping this check for this example
	asset.Holder = args[1]

	assetAsBytes, _ = json.Marshal(asset)
	err := APIstub.PutState(args[0], assetAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change asset holder: %s", args[0]))
	}

	return shim.Success(nil)
}
