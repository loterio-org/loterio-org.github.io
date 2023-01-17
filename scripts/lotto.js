import { contracts, getContract } from "./contracts.js";
import { ids, rpcIds, rpcs, explorers, currencies } from './networks.js'
import { getWeb3Signer, getWeb3Provider, onAccountChanged, onChainChanged } from "./web3.js";
import { unixToDate } from "./utils.js";
import abi from '../../contract_abi.json' assert { type: 'json' };

var signer;
var address;
var provider;

var contract;
var selectedNetwork;

var status;
var maintenance;
var id;
var starter;
var pot;
var initPot;
var price;
var period;
var startDate;
var endDate;
var entries;
var potRatio;
var startRatio;
var endRatio;
var initRatio;
var startIncentive;
var endIncentive;
var endable;
var myEntries;
var claimable;

connectWeb3();

async function connectWeb3() {
    document.getElementById('address').innerHTML = 'Waitting for your response...';
    document.getElementById('address').style.display = 'block';
    document.getElementById('connect').style.display = 'none';
    selectedNetwork = document.getElementById('network').value;
    signer = await getWeb3Signer();

    if(signer){
        address = await signer.getAddress();
        document.getElementById('address').innerHTML = `${address}`;
        provider = getWeb3Provider();
        contract = new ethers.Contract(contracts[selectedNetwork], abi, signer);
        checkNetwork();
    } else {
        init(false, false)
    }
}

onAccountChanged(() => {
    location.reload();
})

onChainChanged(async () => {
    let network = await provider.getNetwork();
    if(network.chainId != ids[selectedNetwork]){
        init(true, false);
    } else {
        init(true, true);
    }
})

async function checkNetwork() {
    await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainId: `0x${rpcIds[selectedNetwork]}`,
            rpcUrls: [rpcs[selectedNetwork]],
            chainName: selectedNetwork,
            nativeCurrency: currencies[selectedNetwork],
            blockExplorerUrls: [explorers[selectedNetwork]]
        }]
    }).then(async (result) => {
        let network = await provider.getNetwork();
        //ids[selectedNetwork]
        if(network.chainId != ids[selectedNetwork]){
            init(true, false);
        } else {
            init(true, true);
        }
    });
}

async function init(user, network) {

    if(!network){
        deactiveButtons();
        contract = getContract(selectedNetwork);
        document.getElementById('connection').innerHTML = 'not connected';
        document.getElementById('connection').style.color = 'red';
    } else {
        contract = new ethers.Contract(contracts[selectedNetwork], abi, signer);
        document.getElementById('connection').innerHTML = 'connected';
        document.getElementById('connection').style.color = 'green';

    }

    setLabels(document.getElementById('network').value);

    status = await contract.checkStatus();
    maintenance = await contract.checkMaintenance();
    id = await contract.getId();

    if(!status && maintenance) {
        document.getElementById('status').innerHTML = 'under maintenance';
        document.getElementById('status').style.color = 'yellow';
    } else if(status) {
        document.getElementById('status').innerHTML = 'active';
        document.getElementById('status').style.color = 'green';
        
    } else {
        document.getElementById('status').innerHTML = 'inactive';
        document.getElementById('status').style.color = 'red';
    }

    loadInfo();
    await loadManagement();
    if(user){
        await loadParticipation();
        await loadReward();
        if(network){
            loadManagementButtons();
            loadParticipationButtons();
            loadRewardButtons();
        }
    } else {
        document.getElementById('address').style.display = 'none';
        document.getElementById('connect').style.display = 'block';
        document.getElementById('connect').onclick = () => {
            connectWeb3();
        };
    }
}

document.getElementById('network').onchange = () => { 
    connectWeb3();
};

async function loadInfo() {
    await loadInfoData();
    document.getElementById('id').innerHTML = id;
    document.getElementById('starter').innerHTML = starter;
    document.getElementById('pot').innerHTML = ethers.utils.formatEther(pot);
    document.getElementById('price').innerHTML = ethers.utils.formatEther(price);
    document.getElementById('period').innerHTML = period;
    document.getElementById('startDate').innerHTML = unixToDate(startDate);
    document.getElementById('endDate').innerHTML = unixToDate(endDate);
    document.getElementById('entries').innerHTML = entries;
    document.getElementById('potRatio').innerHTML = potRatio;
    document.getElementById('startRatio').innerHTML = startRatio;
    document.getElementById('endRatio').innerHTML = endRatio;
    document.getElementById('initRatio').innerHTML = initRatio;
}

async function loadManagement() {
    await loadManagementData();
    document.getElementById('startIncentive').innerHTML = ethers.utils.formatEther(startIncentive);
    document.getElementById('endIncentive').innerHTML = ethers.utils.formatEther(endIncentive);
    document.getElementById('initPot').innerHTML = ethers.utils.formatEther(initPot);
    document.getElementById('endable').innerHTML = endable;
}

async function loadParticipation() {
    await loadUserData();
    document.getElementById('myEntries').innerHTML = myEntries;
}

async function loadReward() {
    await loadRewardData();
    document.getElementById('reward').innerHTML = ethers.utils.formatEther(claimable);
}

async function loadInfoData() {
    starter = await contract.getStarter(id);
    pot = await contract.getPot(id);
    price = await contract.getPrice();
    period = await contract.getPeriod();
    startDate = await contract.getStartDate(id);
    if(status){
        endDate = parseInt(startDate) + parseInt(period);
    } else {
        endDate = parseInt(startDate);
    }
    entries = await contract.getTotalEntries(id);
    potRatio = await contract.getPotRatio();
    startRatio = await contract.getStartRatio();
    endRatio = await contract.getEndRatio();
    initRatio = await contract.getInitRatio();
}

async function loadManagementData() {
    endIncentive = await contract.getEndIncentive(id);
    if(status){
        startIncentive = await contract.getStartIncentive(parseInt(id) + 1);
        initPot = await contract.getInitPot(parseInt(id) + 1);
    } else {
        startIncentive = await contract.getStartIncentive(parseInt(id));
        initPot = await contract.getInitPot(parseInt(id));
    }
    endable = await contract.checkEnd();
}

async function loadUserData() {
    myEntries = await contract.getEntries(id, address);
}

async function loadRewardData() {
    claimable = await contract.getClaimable(address);
}

function loadManagementButtons() {
    if(maintenance) {
        document.getElementById('start').disabled = true;
    } else {
        document.getElementById('start').disabled = status;
    }
    document.getElementById('end').disabled = !endable;
    document.getElementById('start').onclick = () => {
        contract.start();
    };
    document.getElementById('end').onclick = () => { 
        contract.end();
    };
}

function loadParticipationButtons() {
    document.getElementById('participate').disabled = !status;
    document.getElementById('participate').onclick = () => {
        contract.participate({
            value: ethers.utils.parseEther(ethers.utils.formatEther(price))
        });
    };
}

function loadRewardButtons() {
    document.getElementById('claim').disabled = !claimable > 0;
    document.getElementById('claim').onclick = () => { 
        contract.claim();
    };
}

function deactiveButtons() {
    document.getElementById('start').disabled = true;
    document.getElementById('end').disabled = true;
    document.getElementById('claim').disabled = true;
    document.getElementById('participate').disabled = true;
}

function setLabels(network) {
    document.getElementById('potLabel').innerHTML = `Current pot (${currencies[network].symbol})`;
    document.getElementById('priceLabel').innerHTML = `Price (${currencies[network].symbol})`;
    document.getElementById('startIncentiveLabel').innerHTML = `Start incentive (${currencies[network].symbol})`;
    document.getElementById('endIncentiveLabel').innerHTML = `End incentive (${currencies[network].symbol})`;
    document.getElementById('initialPotLabel').innerHTML = `Next initial pot (${currencies[network].symbol})`;
    document.getElementById('claimableLabel').innerHTML = `Claimable (${currencies[network].symbol})`;
}