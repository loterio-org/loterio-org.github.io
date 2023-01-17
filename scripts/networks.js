const chains =[
    'ethereum',
    'polygon',
    'binance',
    'avalanche',
    'fantom',
    'arbitrum',
    'optimism',
    'polygonmum'
];

const networks = {
    ethereum: 'homestead',
    polygon: 'matic',
    binance: 'binance',
    avalanche: 'avalanche',
    fantom: 'fantom',
    arbitrum: 'arbitrum',
    optimism: 'optimism',
    polygonmum: 'maticmum',
}

const ids ={
    ethereum: 1,
    polygon: 137,
    binance: 56,
    avalanche: 43114,
    fantom: 250,
    arbitrum: 42161,
    optimism: 10,
    polygonmum: 80001
}

const chainById = {
    1: 'ethereum',
    137: 'polygon',
    56: 'binance',
    43114: 'avalanche',
    250: 'fantom',
    42161: 'arbitrum',
    10: 'optimism',
    80001: 'polygonmum'
}

const rpcIds ={
    ethereum: 1,
    polygon: 137,
    binance: 38,
    avalanche: 43114,
    fantom: 250,
    arbitrum: 42161,
    optimism: 10,
    polygonmum: 13881
}

const rpcs = {
    ethereum: 'https://mainnet.infura.io/v3/',
    polygon: 'https://polygon-rpc.com/',
    binance: 'https://bsc-dataseed1.binance.org',
    avalanche: 'https://api.avax.network/ext/bc/C/rpc',
    fantom: 'https://rpc.ftm.tools',
    arbitrum: 'https://arb1.arbitrum.io/rpc',
    optimism: 'https://mainnet.optimism.io/',
    polygonmum: 'https://matic-mumbai.chainstacklabs.com'
}

const explorers = {
    binance: 'https://bscscan.com/',
    polygonmum: 'https://mumbai.polygonscan.com/'
}

const currencies = {
    binance: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18
    },
    polygonmum: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
    }
}

export {
    chains,
    networks,
    ids,
    chainById,
    rpcIds,
    rpcs,
    explorers,
    currencies
};