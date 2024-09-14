import { MY_PRIVATE_KEY } from "./config";
import * as alephium from "@alephium/web3";
import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { NODE_URL } from './config';

(async () => {
    const nodeProvider = new alephium.NodeProvider(NODE_URL);
    const wallet = new PrivateKeyWallet({ privateKey: MY_PRIVATE_KEY, nodeProvider });

    const balance = await nodeProvider.addresses.getAddressesAddressBalance(wallet.address);
    console.log(`
        Account Details:
        Address: ${wallet.address}
        Private Key: ${wallet.privateKey}
        Public Key: ${wallet.publicKey}
        Group: ${wallet.group}

        Balance: ${alephium.utils.prettifyAttoAlphAmount(balance.balance)} ALPH
    `);
})();