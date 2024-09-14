import * as alephium from "@alephium/web3";
import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { EXPLORER_URL, MY_PRIVATE_KEY } from "./config";
import { NODE_URL } from './config';

const nodeProvider = new alephium.NodeProvider(NODE_URL);

async function getTokenBalance(address: string, tokenId: string) {
    try {
        const Balance = await nodeProvider.addresses.getAddressesAddressBalance(address)
        const TokenBalance = Balance.tokenBalances!.find((token) => token.id === tokenId)
        return TokenBalance?.amount!
    } catch (e) {
        return 0n;
    }
}

(async () => {
    const wallet = new PrivateKeyWallet({ privateKey: MY_PRIVATE_KEY, nodeProvider });

    const receiverAddress = "12XL7oZUw7fFHidH4QyuCNzFNSF8MKkZVjFesr6BmoTRa";

    const tokenId = "10eeeb83509b8dacd8db04060e4e39eab339a407095d772793483d4932d25c00"

    const metadata = await nodeProvider.fetchFungibleTokenMetaData(tokenId);

    const sendingAmount = 50;

    const senderBeforeBalance = alephium.utils.prettifyTokenAmount(
        await getTokenBalance(wallet.address, tokenId), metadata.decimals
    );
    const receiverBeforeBalance = alephium.utils.prettifyTokenAmount(
        await getTokenBalance(receiverAddress, tokenId), metadata.decimals
    );

    const result = await wallet.signAndSubmitTransferTx(
        {
            signerAddress: wallet.address,
            destinations: [{ address: receiverAddress, tokens: [{ id: tokenId, amount: alephium.utils.convertAmountWithDecimals(sendingAmount, metadata.decimals)! }],attoAlphAmount: 0n }]
        }
    );

    const receiverAfterBalance = alephium.utils.prettifyTokenAmount(
        await getTokenBalance(wallet.address, tokenId), metadata.decimals
    );
    const senderAfterBalance = alephium.utils.prettifyTokenAmount(
        await getTokenBalance(receiverAddress, tokenId), metadata.decimals
    );

    console.log(`
        Sender Address: ${wallet.address}
        Receiver Address: ${receiverAddress}
        Sender Balance Before: ${senderBeforeBalance} ${alephium.hexToString(metadata.symbol)}
        Receiver Balance Before: ${receiverBeforeBalance} ${alephium.hexToString(metadata.symbol)}

        Sent Amount: ${sendingAmount} ${alephium.hexToString(metadata.symbol)}

        Sender Balance After: ${senderAfterBalance} ${alephium.hexToString(metadata.symbol)}
        Receiver Balance After: ${receiverAfterBalance} ${alephium.hexToString(metadata.symbol)}
        Transaction Link: ${EXPLORER_URL}/transactions/${result.txId}
    `);
})();