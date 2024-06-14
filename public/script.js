document.getElementById('addTableBtn').addEventListener('click', addTable);
document.getElementById('saveDataBtn').addEventListener('click', saveData);

function addTable() {
    const tablesContainer = document.getElementById('tablesContainer');
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
                <th><button onclick="addRow(this)">Add Row</button></th>
            </tr>
        </thead>
        <tbody>
            ${createRow()}
        </tbody>
    `;
    tablesContainer.appendChild(table);
}


//RETURN A STRING (TABLEROW) WITH INPUT FEIELDS
function createRow() {
    return `
        <tr>
            <td><input type="number" class="numPassengers"></td>
            <td><input type="number" class="numChildren"></td>
            <td><input type="number" class="rooms" oninput="calculateRow(this)"></td>
            <td><input type="number" class="extraBeds" oninput="calculateRow(this)"></td>
            <td><input type="number" class="cost" oninput="calculateRow(this)"></td>
            <td><input type="number" class="netCost" readonly></td>
            <td><input type="number" class="gstPercentage" oninput="calculateRow(this)"></td>
            <td><input type="number" class="gstAmount" readonly></td>
            <td><input type="number" class="totalAmount" readonly></td>
        </tr>
    `;
}


//ADDS A NEW ROW TO TABLE
function addRow(button) {
    const tbody = button.closest('table').querySelector('tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = createRow();
    tbody.appendChild(newRow);
}


//CALCULATIONS
function calculateRow(input) {
    const row = input.closest('tr');
    const rooms = parseFloat(row.querySelector('.rooms').value) || 0;
    const extraBeds = parseFloat(row.querySelector('.extraBeds').value) || 0;
    const cost = parseFloat(row.querySelector('.cost').value) || 0;
    const gstPercentage = parseFloat(row.querySelector('.gstPercentage').value) || 0;

    const netCost = rooms * cost + extraBeds * (0.1 * cost);
    const gstAmount = (netCost * gstPercentage) / 100;
    const totalAmount = netCost + gstAmount;

    row.querySelector('.netCost').value = netCost.toFixed(2);
    row.querySelector('.gstAmount').value = gstAmount.toFixed(2);
    row.querySelector('.totalAmount').value = totalAmount.toFixed(2);
}




//SAVE THE DATA
async function saveData() {    //GATHERS DATA AND SENT TO ERVER VIA POST (ALERTS ON POST AND ERRORS) 
    const tables = document.querySelectorAll('#tablesContainer table');
    const data = [];

    tables.forEach(table => {
        const rows = [];
        table.querySelectorAll('tbody tr').forEach(row => {
            rows.push({
                numPassengers: row.querySelector('.numPassengers').value,
                numChildren: row.querySelector('.numChildren').value,
                rooms: row.querySelector('.rooms').value,
                extraBeds: row.querySelector('.extraBeds').value,
                cost: row.querySelector('.cost').value,
                netCost: row.querySelector('.netCost').value,
                gstPercentage: row.querySelector('.gstPercentage').value,
                gstAmount: row.querySelector('.gstAmount').value,
                totalAmount: row.querySelector('.totalAmount').value
            });
        });
        data.push({ rows });
    });

    try {
        const response = await fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}