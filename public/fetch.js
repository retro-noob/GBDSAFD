document.getElementById('fetchDataBtn').addEventListener('click', fetchData);

async function fetchData() {  // FETCH RERQ/GET REQ FROM RESPONSSE CREATING ATABLE
    try {
        const response = await fetch('http://localhost:3000/fetch');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const fetchedTablesContainer = document.getElementById('fetchedTablesContainer');
        fetchedTablesContainer.innerHTML = '';

        data.forEach(tableData => {
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Number of Passengers</th>
                        <th>Number of Children</th>
                        <th>Rooms</th>
                        <th>Extra Beds</th>
                        <th>Cost</th>
                        <th>Net Cost</th>
                        <th>GST Percentage</th>
                        <th>GST Amount</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableData.rows.map(row => createRowHTML(row)).join('')}
                </tbody>
            `;
            fetchedTablesContainer.appendChild(table);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function createRowHTML(row) {
    return `
        <tr>
            <td>${row.numPassengers}</td>
            <td>${row.numChildren}</td>
            <td>${row.rooms}</td>
            <td>${row.extraBeds}</td>
            <td>${row.cost}</td>
            <td>${row.netCost}</td>
            <td>${row.gstPercentage}</td>
            <td>${row.gstAmount}</td>
            <td>${row.totalAmount}</td>
        </tr>
    `;
}
