const web3 = window.ethereum;

async function getWeb3Signer(){
    if(web3){
        try {
            let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            await provider.send("eth_requestAccounts", []);
            return provider.getSigner();
        } catch (error) {
            return undefined;
        }
    } else {
        alert('Web3Provider not detected.');
        return undefined;
    }
}

function getWeb3Provider(){
    if(web3){
        try {
            return new ethers.providers.Web3Provider(window.ethereum, 'any');
        } catch (error) {
            alert('Error connecting to Web3Provider.');
        }
    } else {
        alert('Web3Provider not detected.');
    }
}

function onAccountChanged(handle){
    if(web3) web3.on('accountsChanged', handle);
}

function onChainChanged(handle){
    if(web3) web3.on('chainChanged', handle);
}

function onConnect(handle){
    if(web3) web3.on('connect', handle);
}

function onDisconnect(handle){
    if(web3) web3.on('disconnect', handle);
}

export{
    getWeb3Signer,
    getWeb3Provider,
    onAccountChanged,
    onChainChanged,
    onConnect,
    onDisconnect
}