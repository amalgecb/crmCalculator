document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const outputDiv = document.getElementById('output');

    // Function to handle the search functionality
    async function handleSearch() {
        const value1 = input1.value;
        const value2 = input2.value;

        if (!value1 || !value2) {
            outputDiv.innerHTML = "Please enter both inputs.";
            return;
        }

        // Server-side URLs for API calls
        const url1 = './data.json';
        const url2 = './data2.json';
        const url3 = './data3.json';

        try {
            const response = await fetch(url1);
            const response2 = await fetch(url2);
            const data = await response.json();
            const data2 = await response2.json();
            const response3 = await fetch(url3);
            const data3 = await response3.json();

            let sum = 0,
                avgDivIncome = 0,
                avgAmntRemt,
                sum2 = 0,
                avgPm,
                sala;

            // Find matching row
            let resultRow = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].Pattern === value1) {
                    resultRow.push(data[i].Pattern);
                    sala = data[i].amnt;
                    duration = data[i].chittal;
                    instalamnt = data[i]["subs amnt"];
                }
            }
            if (resultRow.length === 0) {
                outputDiv.innerHTML = "No matching data found.";
                return;
            }
            

            for (let i = 0; i < data2.length; i++) {
                

                if (data2[i].pattern === value1) {
                    //console.log(data2[i].pattern);
                    if (data2[i + 1]["Customer Name"] === "Total :") {
                        sum += parseInt(data2[i + 1]["Instal Discount"]);
                        //console.log(parseInt(data2[i + 1]["Instal Discount"]));
                    }
                    if (data2[i]["Instal No"] === value2) {
                        sum2 += parseInt(data2[i]["Prize Money"]);
                    }
                }
            }

            const countOfRows = resultRow.length;
            //console.log(sum);
            avgDivIncome = parseInt(sum / countOfRows);
            avgAmntRemt = sala - avgDivIncome;
            avgPm = parseInt(sum2 / countOfRows);
            const GST = parseInt(sala * 0.009);
            const documentationCharge = 236;
            const netPMpayable = avgPm - GST - documentationCharge;
            const fL = instalamnt * (duration - parseInt(value2));
            const csdtPortion = fL > netPMpayable ? netPMpayable : fL;
            const fDportion = netPMpayable - csdtPortion;
            const period = duration - parseInt(value2);
            let csdtPerc;
            let fdperc;
            for (let i = 1; i < data3.length; i++) {
                if (parseInt(data3[i]["Period in Months"]) === period) {
                    csdtPerc = parseFloat(data3[i]["CSDT"]);
                    fdperc = parseFloat(data3[i]["FD"]);
                    break;
                }
            }
            const intFromcsdt = parseInt(csdtPortion * csdtPerc / 100 / 12);
            const intFromfd = parseInt(fDportion * fdperc / 100 / 12);
            const totalInt = (intFromcsdt + intFromfd) * period;
            const totalReturn = totalInt + netPMpayable;

            // Display result
            outputDiv.innerHTML = `
<div id="general">
    <div><span>No of chits considered :</span><span>${countOfRows}</span></div>
    <div><span>Sala :</span><span>${sala}</span></div>
    <div><span>Avg. div Income :</span><span>${avgDivIncome}</span></div>
    <div><span>Avg. amount to be remtd :</span><span>${avgAmntRemt}</span></div>
</div>
<div id="prizeMoney">
    <div><span>Avg. PM at given installment :</span><span>${avgPm}</span></div>
    <div><span>GST :</span><span>${GST}</span></div>
    <div><span>Documentation charge :</span><span>${documentationCharge}</span></div>
    <div><span>Net PM payable :</span><span>${netPMpayable}</span></div>
</div>
<div id="fD">
    <div><span>Future liability :</span><span>${fL}</span></div>
    <div><span>CSDT portion :</span><span>${csdtPortion}</span></div>
    <div><span>FD portion :</span><span>${fDportion}</span></div>
    <div><span>Mnthly intrst from CSDT :</span><span>${intFromcsdt}</span></div>
    <div><span>Mnthly intrst from FD :</span><span>${intFromfd}</span></div>
    <div><span>Total interest :</span><span>${totalInt}</span></div>
    <div><span>Total return :</span><span>${totalReturn}</span></div>
    <div><span>Profit/loss :</span><span>${totalReturn - avgAmntRemt}</span></div>
</div>`;
        } catch (error) {
            outputDiv.innerHTML = "Error fetching data.";
            console.error(error);
        }
    }

    async function populateInput2(value1, data4) {
        // Check if the key exists in the data4 object
        if (data4.hasOwnProperty(value1)) {
            const options = data4[value1]; 
            input2.innerHTML = '';  // Get the options array for the selected ke
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.id;
                optionElement.textContent = option.name;
                input2.appendChild(optionElement);
            });
        } else {
            console.error("No matching category found in data4 for value:", value1);
            outputDiv.innerHTML = "No matching options found for input2.";
        }
    }
    
 
    // Add click event listener to the button
    searchButton.addEventListener('click', handleSearch);

    // Add keydown event listener to the input fields
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    input1.addEventListener('change', async () => {
        const value1 = input1.value;
        const splittedArray = value1.split("X");
        const lastPart= splittedArray[1];
        if (lastPart) {
            // Call the populateInput2 function to reload options in input2 when input1 changes
            const response = await fetch('./data4.json');
            const data4 = await response.json();
            populateInput2(lastPart, data4);
        }
    });

});
