import { Configuration } from '@alephium/cli'

export type Settings = {}

const configuration: Configuration<Settings> = {
    networks: {
        devnet: {
            //Make sure the two values match what's in your devnet configuration
            nodeUrl: 'http://localhost:22973',
            privateKeys: [],
            settings: {}
        },
        mainnet: {
            nodeUrl: 'https://node.mainnet.alephium.org',
            privateKeys: [],
            settings: {}
        }
        , testnet: {
            nodeUrl: 'https://node.testnet.alephium.org',
            privateKeys: [],
            settings: {}
        }
    }
}

export default configuration