import { PrivateKeyWallet } from "@alephium/web3-wallet";
import * as alephium from "@alephium/web3";
import { MY_PRIVATE_KEY } from "./config";

const nodeProvider = new alephium.NodeProvider(NODE_URL);

async function getTokenBalance(address: string, tokenId: string) {
    const Balance = await nodeProvider.addresses.getAddressesAddressBalance(address)
    const TokenBalance = Balance.tokenBalances!.find((token) => token.id === tokenId)
    return TokenBalance?.amount!
}

(async () => {

    const wallet = new PrivateKeyWallet({ privateKey: MY_PRIVATE_KEY, nodeProvider });

    const tokenId = "10eeeb83509b8dacd8db04060e4e39eab339a407095d772793483d4932d25c00"

    const metadata = await nodeProvider.fetchFungibleTokenMetaData(tokenId);

    console.log(`
        Token Details:
        Token ID: ${tokenId}
        Token Name: ${alephium.hexToString(metadata.name)}
        Symbol: ${alephium.hexToString(metadata.symbol)}
        Decimals: ${metadata.decimals}
        Total Supply: ${metadata.totalSupply}
        `)

    console.log(`
        Token Balance of ${wallet.address}:`, alephium.utils.prettifyTokenAmount(await getTokenBalance(wallet.address, tokenId), metadata.decimals))

})();