
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
                if (data2[i + 1]["Customer Name"] === "Total  :") {
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
        const csdtPortion= (fL>netPMpayable) ? netPMpayable  : fL;
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
</div>

        `;
        
    } catch (error) {
        outputDiv.innerHTML = "Error fetching data.";
        console.error(error);
    }
  
});
