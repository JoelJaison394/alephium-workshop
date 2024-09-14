import * as alephium from "@alephium/web3";
import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { MY_PRIVATE_KEY } from "./config";
import { json } from "stream/consumers";
import { NODE_URL } from './config';

(async () => {
    const nodeProvider = new alephium.NodeProvider(NODE_URL);
    const wallet = new PrivateKeyWallet({ privateKey: MY_PRIVATE_KEY, nodeProvider });

    const receiverAddress = "1Ht4UDeKvGKA8ZDPsjjo3cDaJ9qSvfACKGguBziMj3jY2";

    const sendingAmount = 0.2;

    const senderBeforeBalance = alephium.utils.prettifyTokenAmount(
        (await nodeProvider.addresses.getAddressesAddressBalance(wallet.address)).balance, 18
    );
    const receiverBeforeBalance = alephium.utils.prettifyTokenAmount(
        (await nodeProvider.addresses.getAddressesAddressBalance(receiverAddress)).balance, 18
    );

    const result = await wallet.signAndSubmitTransferTx(
        {
            signerAddress: wallet.address,
            destinations: [{ address: receiverAddress, attoAlphAmount: alephium.utils.convertAlphAmountWithDecimals(sendingAmount)! }]
        }
    );

    const receiverAfterBalance = alephium.utils.prettifyTokenAmount(
        (await nodeProvider.addresses.getAddressesAddressBalance(receiverAddress)).balance, 18
    );
    const senderAfterBalance = alephium.utils.prettifyTokenAmount(
        (await nodeProvider.addresses.getAddressesAddressBalance(wallet.address)).balance, 18
    );

    console.log(`
        Sender Address: ${wallet.address}
        Receiver Address: ${receiverAddress}
        Sender Balance Before: ${senderBeforeBalance} ALPH
        Receiver Balance Before: ${receiverBeforeBalance} ALPH

        Sent Amount: ${sendingAmount} ALPH

        Sender Balance After: ${senderAfterBalance} ALPH
        Receiver Balance After: ${receiverAfterBalance} ALPH
        Transaction Link: https://testnet.alephium.org/transactions/${result.txId}
    `);
})();