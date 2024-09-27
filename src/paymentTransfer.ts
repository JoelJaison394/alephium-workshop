import * as alephium from "@alephium/web3";
import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { EXPLORER_URL, MY_PRIVATE_KEY } from "./config";
import { NODE_URL } from './config';

(async () => {
    const nodeProvider = new alephium.NodeProvider(NODE_URL);
    const wallet = new PrivateKeyWallet({ privateKey: MY_PRIVATE_KEY, nodeProvider });

    const receiverAddress = "17xyrLQpXg3MudW9LoptjWFNN82rN2PiGRrA4cENvfQdZ";

    const sendingAmount = 2;

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
        Transaction Link: ${EXPLORER_URL}/transactions/${result.txId}
    `);
})();