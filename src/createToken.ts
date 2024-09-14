import { PrivateKeyWallet } from "@alephium/web3-wallet";
import * as alephium from "@alephium/web3";
import { MY_PRIVATE_KEY } from "./config";
import { MyToken } from "../artifacts/ts";

const nodeProvider = new alephium.NodeProvider(NODE_URL);
const wallet = new PrivateKeyWallet({ privateKey: MY_PRIVATE_KEY, nodeProvider });

async function createFungibleToken(issueTokenTo: string): Promise<string> {

    const issueTokenAmount = alephium.utils.convertAmountWithDecimals(10000, 18)!;
    // Deoloy `ShinyToken` contract and issue `10000` shiny tokens to `issueTokenTo` address.
    const shinyToken = await MyToken.deploy(wallet, {
        initialFields: {},
        issueTokenAmount,
        issueTokenTo
    })

    return shinyToken.contractInstance.contractId
}

(async () => {

    const tokenId = await createFungibleToken(wallet.address)
    console.log(`Created Token with ID: ${tokenId}`);
    
})();