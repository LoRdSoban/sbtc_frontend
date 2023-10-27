"use client";

import { useState, useContext } from "react";
import {
  DevEnvHelper,
  sbtcDepositHelper,
  TESTNET,
  REGTEST,
  TestnetHelper,
  WALLET_00,
  WALLET_01,
} from "sbtc";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import * as btc from "@scure/btc-signer";

import { UserContext } from "../UserContext";

export default function DepositForm() {
  const { userData } = useContext(UserContext);
  const [satoshis, setSatoshis] = useState("");

  const handleInputChange = (event) => {
    setSatoshis(event.target.value);
  };

  const buildTransaction = async (e) => {
    e.preventDefault();
    // Helper for working with various API and RPC endpoints and getting and processing data
    // Change this depending on what network you are working with
    // const testnet = new TestnetHelper();
    const testnet = new DevEnvHelper();

    // setting BTC address for devnet
    // Because of some quirks with Leather, we need to pull our BTC wallet using the helper if we are on devnet
    const bitcoinAccountA = await testnet.getBitcoinAccount(WALLET_00);
    const btcAddress = bitcoinAccountA.wpkh.address;
    const btcPublicKey = bitcoinAccountA.publicKey.buffer.toString();

    // setting BTC address for testnet
    // here we are pulling directly from our authenticated wallet
    // const btcAddress = userData.profile.btcAddress.p2wpkh.testnet;
    // const btcPublicKey = userData.profile.btcPublicKey.p2wpkh;

    let utxos = await testnet.fetchUtxos(btcAddress);

    // If we are working via testnet
    // get sBTC deposit address from bridge API
    // const response = await fetch(
    //   "https://bridge.sbtc.tech/bridge-api/testnet/v1/sbtc/init-ui"
    // );
    // const data = await response.json();
    // const pegAddress = data.sbtcContractData.sbtcWalletAddress;

    // if we are working via devnet we can use the helper to get the peg address, which is associated with the first wallet
    const pegAccount = await testnet.getBitcoinAccount(WALLET_00);
    const pegAddress = pegAccount.tr.address;

    const tx = await sbtcDepositHelper({
      // comment this line out if working via devnet
      // network: TESTNET,
      pegAddress,
      stacksAddress: userData.profile.stxAddress.testnet,
      amountSats: satoshis,
      // we can use the helper to get an estimated fee for our transaction
      feeRate: 100,
      // the helper will automatically parse through these and use one or some as inputs
      utxos,
      // where we want our remainder to be sent. UTXOs can only be spent as is, not divided, so we need a new input with the difference between our UTXO and how much we want to send
      bitcoinChangeAddress: btcAddress,
    });

    // convert the returned ttransaction object into a PSBT for Leather to use
    const psbt = tx.toPSBT();
    const requestParams = {
      publicKey: btcPublicKey,
      hex: bytesToHex(psbt),
    };
    // Call Leather API to sign the PSBT and finalize it
    const txResponse = await window.btc.request("signPsbt", requestParams);
    const formattedTx = btc.Transaction.fromPSBT(
      hexToBytes(txResponse.result.hex)
    );
    formattedTx.finalize();

    // Broadcast it using the helper
    const finalTx = await testnet.broadcastTx(formattedTx);

    // Get the transaction ID
    console.log(finalTx);
  };

  return (
    <div class="flex items-center justify-center p-12">
      <div class="mx-auto w-2/5">
        <form>
          <input
            type="number"
            placeholder="Amount of BTC to deposit"
            className=" w-full mb-10 px-4 py-4 text-gray-300 bg-gray-300 shadow-inner rounded focus:outline-none focus:border-orange-500"
            value={satoshis}
            onChange={handleInputChange}
          />

          <div className="">

            <button
              type="submit"
              className="w-full px-6 py-2 font-semibold text-white bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
              onClick={buildTransaction}
            >
              Deposit BTC
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
