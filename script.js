document.getElementById('searchButton').addEventListener('click', async function () {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    const outputDiv = document.getElementById('output');

    if (!input1 || !input2) {
        outputDiv.innerHTML = "Please enter both inputs.";
        return;
    }

    // Fetch data from Google Sheets
    const apiKey = "AIzaSyAmznsZGKdiNwzKLxhLrQWPnO5qFWxrKmA"; // Replace with your API key
    const sheetId = "1p0U5YEABMXtK5XZ3_UXioEdrMFL8rlKqzE8UonJByys"; // Replace with your Google Sheet ID
    const sheetRange1 = "terminated Chit list"; 
    const sheetRange2= "data";// Replace with your sheet name
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange1}?key=${apiKey}`;
    const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange2}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const response2= await fetch( url2);
        const data = await response.json();
        const data2 = await response2.json();
        const rows = data.values;
        const rows2 = data2.values;
        var sum= 0;
        var avgDivIncome= 0;
        var avgAmntRemt;
        var sum2=0;
        var avgPm;

        // Find matching row
        let resultRow = [];
        for (let i = 0; i < rows.length; i++) { // Skip the header row
            if (rows[i][1]===input1 ) {
                resultRow.push(rows[i]);
                console.log(rows[i][4]);
                sala= rows[i][4];
                
            }
        }
        if (!resultRow) {
            outputDiv.innerHTML = "No matching data found.";
            return;
        }
        for (let i = 0; i < rows2.length; i++) { // Skip the header row
            if (rows2[i][1]===input1 ) {
                if(rows2[i+1][6]==="Total :"){
                    sum= sum+parseInt(rows2[i+1][9]);
                }
                if(rows2[i][2]===input2){
                    sum2= sum2+ parseInt(rows2[i][8])
                }
                
            }
        }
        
        countOfRows= resultRow.length;
        const count = countOfRows;
        avgDivIncome= parseInt(sum/countOfRows);
        avgAmntRemt= sala-avgDivIncome;
        avgPm= parseInt(sum2/countOfRows);
        const GST= sala*0.009;
        const documentationCharge= 236;
        const netPMpayable= avgPm-GST-documentationCharge;


        // Display result
        outputDiv.innerHTML = `No of chits considered: ${count}<br> Sala: ${sala} <br> Avg. div Income : ${avgDivIncome}<br> Avg.PM at given instalment : ${avgPm}<br> Net PM payable : ${netPMpayable}`;
    } catch (error) {
        outputDiv.innerHTML = "Error fetching data.";
        console.error(error);
    }
});





