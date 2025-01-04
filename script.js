
document.getElementById('searchButton').addEventListener('click', async function () {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    const outputDiv = document.getElementById('output');

    if (!input1 || !input2) {
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
        //const rows = data.values;
        //const rows2 = data2.values;
        //console.log(data);
        //console.log(data[1].Pattern);
        let sum = 0, avgDivIncome = 0, avgAmntRemt, sum2 = 0, avgPm, sala;

        // Find matching row
        let resultRow = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].Pattern === input1) {
                resultRow.push(data[i].Pattern);
                sala = data[i].amnt;
                duration = data[i].chittal;
                instalamnt= data[i]["subs amnt"];
            }
        }
        if (resultRow.length === 0) {
            outputDiv.innerHTML = "No matching data found.";
            return;
        }

        for (let i = 0; i < data2.length; i++) {
            if (data2[i].pattern === input1) {
                if (data2[i + 1]["Customer Name"] === "Total :") {
                    sum += parseInt(data2[i + 1]["Instal Discount"]);
                }
                if (data2[i]["Instal No"] === input2) {
                    sum2 += parseInt(data2[i]["Prize Money"]);
                }
            }
        }

        const countOfRows = resultRow.length;
        avgDivIncome = parseInt(sum / countOfRows);
        avgAmntRemt = sala - avgDivIncome;
        avgPm = parseInt(sum2 / countOfRows);
        const GST = parseInt(sala * 0.009);
        const documentationCharge = 236;
        const netPMpayable = avgPm - GST - documentationCharge;
        const fL= instalamnt*(duration-parseInt(input2));
        const csdtPortion= (fL>netPMpayable) ? netPMpayable : fL;
        const fDportion = netPMpayable- csdtPortion;
        const period = duration-parseInt(input2);
        var csdtPerc;
        var fdperc;
        for (let i= 1; i<data3.length;i++){
            //console.log(rows[i][12]);
            if (parseInt(data3[i]["Period in Months"]) === period) {
                csdtPerc= parseFloat(data3[i]["CSDT"]);
                fdperc = parseFloat(data3[i]["FD"]);
                console.log(csdtPerc);
                console.log(fdperc);
                break;

        }
    }
        const intFromcsdt= parseInt(csdtPortion*csdtPerc/100/12);
        const intFromfd= parseInt(fDportion*fdperc/100/12);
        const totalInt= (intFromcsdt+intFromfd)*period;
        const totalReturn= totalInt + netPMpayable;


        // Display result
        outputDiv.innerHTML = `
            No of chits considered: ${countOfRows}<br>
            Sala: ${sala}<br>
            Avg. div Income: ${avgDivIncome}<br>
            Avg.amnt to be remitted : ${avgAmntRemt} <br>
            Avg. PM at given instalment: ${avgPm}<br>
            GST : ${GST} <br>
            Documentation charge : ${documentationCharge};<br>
            Net PM payable: ${netPMpayable}<br>
            Future liability: ${fL} <br>
            CSDT portion : ${csdtPortion} <br>
            FD portion : ${fDportion} <br>
            Monthly interest from CSDT : ${intFromcsdt} <br>
            Monthly interest from FD : ${intFromfd}<br>
            Total interest : ${totalInt} <br>
            Total return : ${totalReturn} <br>
            Profit/loss : ${totalReturn-avgAmntRemt}
        `;
        
    } catch (error) {
        outputDiv.innerHTML = "Error fetching data.";
        console.error(error);
    }
  
});
