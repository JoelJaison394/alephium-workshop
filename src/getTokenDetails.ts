import { PrivateKeyWallet } from "@alephium/web3-wallet";
import * as alephium from "@alephium/web3";
import { MY_PRIVATE_KEY } from "./config";
import { NODE_URL } from './config';

const nodeProvider = new alephium.NodeProvider(NODE_URL);

async function getTokenBalance(address: string, tokenId: string) {
    const Balance = await nodeProvider.addresses.getAddressesAddressBalance(address)
    const TokenBalance = Balance.tokenBalances!.find((token) => token.id === tokenId)
    return TokenBalance?.amount!
}

(async () => {

    const wallet = new PrivateKeyWallet({ privateKey: MY_PRIVATE_KEY, nodeProvider });

    const tokenId = "2ec08fc1e48d81f49bab191aac551d011a84bb37399b602271845cc58048fd02"

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