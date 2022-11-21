import contractAbi from '../../contract_abi.json' assert { type: 'json' };
import { ids, rpcs, networks } from './networks.js'

//Contracts
const contracts = {
    ethereum: '',
    polygon: '',
    binance: '',
    avalanche: '',
    fantom: '',
    arbitrum: '',
    optimism: '',
    polygonmum: '0x01c8607cB2F45401aE410eed2b93E8D2dF77A5f0'
}

//Contract links
const contractExplorers = {
    ethereum: '',
    polygon: '',
    binance: '',
    avalanche: '',
    fantom: '',
    arbitrum: '',
    optimism: '',
    polygonmum: 'https://mumbai.polygonscan.com/address/0x0B1186bC0cE0cCC3e00e568237949c4358ECa1B0'
}

function getContract(chain){return getSpecifiedContract(networks[chain], ids[chain], rpcs[chain], contracts[chain]);}

function getSpecifiedContract(chain, chainId, chainRPC, contractAddress){
    let network = new ethers.providers.getNetwork(chainId);
    network = {
        name: (network.name ? network.name : chain),
        chainId: (network.chainId ? network.chainId : chainId),
        ensAddress:(network.ensAddress ? network.ensAddress : null),
        _defaultProvider: (network._defaultProvider ? network._defaultProvider : (providers) => new providers.JsonRpcProvider(chainRPC))
    };
    let provider = new ethers.providers.getDefaultProvider(network);
    return new ethers.Contract(contractAddress, contractAbi, provider);
}

export {
    contracts,
    contractExplorers,
    getContract
};