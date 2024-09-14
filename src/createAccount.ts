import * as alephium from "@alephium/web3";
import { PrivateKeyWallet } from '@alephium/web3-wallet'


(async () => {
    const nodeProvider = new alephium.NodeProvider(NODE_URL);

    const newWallet = PrivateKeyWallet.Random(0, nodeProvider);

    console.log(`
        Wallet Details:
        Address: ${newWallet.address}
        Private Key: ${newWallet.privateKey}
        Public Key: ${newWallet.publicKey}
        Group: ${newWallet.group}
    `);

})();