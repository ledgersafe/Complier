var express = require("express"); // call express
var bodyParser = require("body-parser");
var http = require("http");
var fs = require("fs");
var Fabric_Client = require("fabric-client");
var path = require("path");
var util = require("util");
var os = require("os");
const routerTo_queryAll = express.Router();
// setup the fabric network
var fabric_client = new Fabric_Client();
var channel = fabric_client.newChannel("mychannel");
var order = fabric_client.newOrderer("grpc://localhost:7050");
channel.addOrderer(order);
var peer = fabric_client.newPeer("grpc://localhost:7051");
channel.addPeer(peer);

module.exports = function router() {
    var queryAll = async function (req, res) {
        try {
            console.log("getting all asset from database: ");

            //
            var member_user = null;
            var store_path = path.join(os.homedir(), ".hfc-key-store");
            console.log("Store path:" + store_path);
            var tx_id = null;

            const state_store = await Fabric_Client.newDefaultKeyValueStore({ path: store_path });
            // assign the store to the fabric client
            fabric_client.setStateStore(state_store);
            var crypto_suite = Fabric_Client.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            var crypto_store = Fabric_Client.newCryptoKeyStore({
                path: store_path
            });
            crypto_suite.setCryptoKeyStore(crypto_store);
            fabric_client.setCryptoSuite(crypto_suite);

            const user_from_store = await fabric_client.getUserContext("user1", true);
            if (user_from_store && user_from_store.isEnrolled()) {
                console.log("Successfully loaded user1 from persistence");
                member_user = user_from_store;
            } else {
                throw new Error("Failed to get user1.... run registerUser.js");
            }

            // queryAllAsset - requires no arguments , ex: args: [''],
            const request = {
                chaincodeId: "ledgersafe-app",
                txId: tx_id,
                fcn: "queryAllAsset",
                args: [""]
            };

            const query_responses = await channel.queryByChaincode(request);
            console.log("Query has completed, checking results in queryAll.js");
            // query_responses could have more than one  results if there multiple peers were used as targets
            if (query_responses && query_responses.length == 1) {
                if (query_responses[0] instanceof Error) {
                    console.error("error from query = ", query_responses[0]);
                } else {
                    console.log("Response is ", query_responses[0].toString());
                    // res.json(JSON.parse(query_responses[0].toString()));
                    return JSON.parse(query_responses[0].toString());
                }
            } else {
                console.log("No payloads were returned from query");
            }
        }
        catch (error) {
            console.error('query failed, ', error);
            process.exit(1);
        }
    }
    routerTo_queryAll.route('/')
    .get((req, res) => {
        queryAll(req, res).then(function (result) {
            if (result) {
                res.status(200).json({ message: 'OK', result: result })
            } else {
                res.status(200).json({ message: 'NOK', result: result })
            }
        });
    });
    return routerTo_queryAll;
};
