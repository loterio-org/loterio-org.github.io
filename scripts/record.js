import { getContract } from "./contracts.js";
import { explorers } from "./networks.js";
import { unixToDate } from "./utils.js";
import { loadingTextAnimation, finishLoadingAnimation } from "./animations.js";

const maxLoad = 10;

var contract;
var explorer;
var registers;
var pages;
var currentPage;

init();

async function init() {
    let network = document.getElementById('network').value;
    contract = getContract(network);
    explorer = explorers[network];
    currentPage = 1;
    registers = await contract.getId();
    if(registers <= maxLoad) {
        loadRecord(registers - 1, 0);
        pages = 1;
        document.getElementById('page').innerHTML = `1 of ${pages}`;
    } else {
        loadRecord(registers - 1, registers - maxLoad);
        pages = Math.ceil(registers / maxLoad);
        document.getElementById('page').innerHTML = `1 of ${pages}`;
        document.getElementById('next').disabled = false;
    }
    

    document.getElementById('back').onclick = () => {
        cleanRecord();
        let to = registers - maxLoad * currentPage + maxLoad;
        if(to + maxLoad < registers) {
            let from = registers - maxLoad * --currentPage;
            loadRecord(from, to)
        } else {
            loadRecord(registers - 1, registers - maxLoad * currentPage-- + maxLoad)
            document.getElementById('back').disabled = true;
        }
        document.getElementById('page').innerHTML = `${currentPage} of ${pages}`;
        document.getElementById('next').disabled = false;
    };
    document.getElementById('next').onclick = () => {
        cleanRecord();
        let from = registers - maxLoad * currentPage - 1;
        if(from > 0) {
            let to = registers - maxLoad * ++currentPage;
            loadRecord(from, to)
        } else {
            loadRecord(registers - maxLoad * currentPage++ - 1, 0)
            document.getElementById('next').disabled = true;
        }
        document.getElementById('page').innerHTML = `${currentPage} of ${pages}`;
        document.getElementById('back').disabled = false;
    };
}

document.getElementById('network').onchange = () => { 
    init();
};

async function loadRecord(from, to) {

    loadingTextAnimation(document.getElementById('loading'));
    let pageLoading = currentPage;

    let recordTable = document.getElementById('record');
    let records = [];

    for (let id = from; id >= to; id--) {
        records.push(loadInfo(id));
    }

    await Promise.all(records).then((results) => {
        if(pageLoading == currentPage) {
            results.forEach((record) => {
                record.pot = ethers.utils.formatEther(record.pot);
                record.winner = `<a href="${explorer}address/${record.winner}" target="_blank">${record.winner}</a>`
                record.startDate = unixToDate(record.startDate);
                record.endDate = unixToDate(record.endDate);
                record.startIncentive = ethers.utils.formatEther(record.startIncentive);
                record.starter = `<a href="${explorer}address/${record.starter}" target="_blank">${record.starter}</a>`
                record.endIncentive = ethers.utils.formatEther(record.endIncentive);
                record.finisher = `<a href="${explorer}address/${record.finisher}" target="_blank">${record.finisher}</a>`
                recordTable.innerHTML += addRow(record.id, record.pot, record.entries, record.winner, record.startDate, record.endDate, record.startIncentive, record.starter, record.endIncentive, record.finisher);
            })
            finishLoadingAnimation(loading);
        }
    });
}

async function loadInfo(id) {
    return {
        id: id,
        pot: await contract.getPot(id),
        entries: await contract.getTotalEntries(id),
        winner: await contract.getWinner(id),
        startDate: await contract.getStartDate(id),
        endDate:  await contract.getEndtDate(id),
        startIncentive: await contract.getStartIncentive(id),
        starter: await contract.getStarter(id),
        endIncentive: await contract.getEndIncentive(id),
        finisher: await contract.getFinisher(id)
    }
}

function cleanRecord() {
    document.getElementById('record').innerHTML = (
        `<tr>
            <th>ID</th>
            <th>Pot (MATIC)</th>
            <th>Entries</th>
            <th>Winner</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Start Incentive (MATIC)</th>
            <th>Starter</th>
            <th>End Incentive (MATIC)</th>
            <th>Finisher</th>
        </tr>`
    )
}

function addRow(id, pot, entries, winner, startDate, endDate, startIncentive, starter,  endIncentive, finisher) {
    return (
        `<tr>
            <td>${id}</td>
            <td>${pot}</td>
            <td>${entries}</td>
            <td>${winner}</td>
            <td>${startDate}</td>
            <td>${endDate}</td>
            <td>${startIncentive}</td>
            <td>${starter}</td>
            <td>${endIncentive}</td>
            <td>${finisher}</td>
        </tr>`
    )
}