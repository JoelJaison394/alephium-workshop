import { PrivateKeyWallet } from "@alephium/web3-wallet";
import * as alephium from "@alephium/web3";
import { EXPLORER_URL, MY_PRIVATE_KEY } from "./config";
import { NODE_URL } from './config';
import { testPrivateKey } from "@alephium/web3-test";

const nodeProvider = new alephium.NodeProvider(NODE_URL);

async function requestTestnetFaucet(address: string) {
    try {
        const response = await fetch('https://faucet.testnet.alephium.org/send', {
            method: 'POST',
            body: address,
            headers: {
                'Content-Type': 'text/plain'
            }
        });

        if (response.status === 429) {
            // date & time in local timezone , add 5 minutes to the current time
            const newTime = new Date(new Date().getTime() + 5 * 60000);
            console.log(`Faucet is rate limited. Try again after ${newTime.toLocaleString()}`);
            return;
        }

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.text();
        console.log('Faucet Request Successful:', result);
    } catch (error) {
        console.error('Error fetching faucet:', error);
    }
}

async function addLocalTokens(reciever: string) {
    const wallet = new PrivateKeyWallet({ privateKey: testPrivateKey, nodeProvider });

    const result = await wallet.signAndSubmitTransferTx(
        {
            signerAddress: wallet.address,
            destinations: [{ address: reciever, attoAlphAmount: alephium.utils.convertAlphAmountWithDecimals(6)! }]
        }
    );

    return result;

}

(async () => {
    const wallet = new PrivateKeyWallet({ privateKey: MY_PRIVATE_KEY, nodeProvider });

    const result = await addLocalTokens(wallet.address);

    console.log(`Faucet Request Successful: ${EXPLORER_URL}/transactions/${result.txId}`);

})();