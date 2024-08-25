window.onload = function () {
    loadFromLocalStorage();
};


function saveMyData(saveButton){
	for (let i = 5; i <= 12; i++) {
		const line = document.getElementById('line' + i).value;
		saveToLocalStorage('line' + i, line);
		saveButton.textContent = "Spremljeno!";
		saveButton.disabled=true;

            // Re-enable the button and reset the label after 5 seconds
		setTimeout(() => {
			saveButton.disabled = false;
			saveButton.textContent = "Spremi moje podatke";
		}, 2000);
	}
}

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function clearForm(){
	 for (let i = 1; i <= 12; i++) {
        document.getElementById('line' + i).value = '';
    }
}

function loadFromLocalStorage() {
    for (let i = 1; i <= 12; i++) {
        const savedValue = localStorage.getItem('line' + i);
        if (savedValue !== null) {
            document.getElementById('line' + i).value = savedValue;
        }
    }
}

function clearLocalStorage() {
    for (let i = 1; i <= 12; i++) {
        localStorage.removeItem('line' + i);
        document.getElementById('line' + i).value = '';
    }
}

function copyBarcode() {
    const canvas = document.querySelector('#barcode canvas');
    if (!canvas) {
        alert("No barcode generated to copy.");
        return;
    }

    canvas.toBlob(function(blob) {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]).then(() => {
            // Disable the button and change the label
            const copyButton = document.querySelector('.button.copy');
            copyButton.textContent = 'Kopirano!';
            copyButton.disabled = true;
            setTimeout(() => {
                copyButton.textContent = 'Kopiraj barkod';
                copyButton.disabled = false;
            }, 2000);
        }, (err) => {
            console.error("Failed to copy barcode: ", err);
        });
    });
}

function generate() {
	 let amount = document.getElementById('line1').value.trim();

    // Replace comma with a dot and remove any non-numeric characters except the dot
    amount = amount.replace(',', '.').replace(/[^0-9.]/g, '');

    // Split the amount into integer and decimal parts
    let [integerPart, decimalPart = ''] = amount.split('.');

    // Ensure decimal part has exactly two digits
    if (decimalPart.length > 2) {
        alert("Max 2 decimale.");
        return;
    }

    // If less than two decimal digits, pad with zeros
    decimalPart = decimalPart.padEnd(2, '0');

    // Combine the integer and decimal parts
    amount = integerPart + decimalPart;

    // Pad the amount with leading zeros to ensure it's 15 digits long
    if (amount.length > 15) {
        alert("Prevelik iznos.");
        return;
    }
    amount = amount.padStart(15, '0');
    // Prepare the rest of the code with the formatted amount
    let code = `HRVHUB30\nEUR\n${amount}\n`;
    for (let i = 2; i <= 12; i++) {
        const line = document.getElementById('line' + i).value;
        code += line + '\n';
    }
	var textToEncode = code;
	

	PDF417.init(textToEncode);             

	var barcode = PDF417.getBarcodeArray();

	// block sizes (width and height) in pixels
	var bw = 2;
	var bh = 2;

	// create canvas element based on number of columns and rows in barcode
	var container = document.getElementById('barcode');

    // Clear previous barcode (if any)
    if (container.firstChild) {
        container.removeChild(container.firstChild);
    }
		
		

	var canvas = document.createElement('canvas');
	canvas.width = bw * barcode['num_cols'];
	canvas.height = bh * barcode['num_rows'];
	canvas.style.display = 'none';
	container.appendChild(canvas);

	var ctx = canvas.getContext('2d');                    

	// graph barcode elements
	var y = 0;
	// for each row
	for (var r = 0; r < barcode['num_rows']; ++r) {
		var x = 0;
		// for each column
		for (var c = 0; c < barcode['num_cols']; ++c) {
			if (barcode['bcode'][r][c] == 1) {                        
				ctx.fillRect(x, y, bw, bh);
			}
			x += bw;
		}
		y += bh;
	}   

	const imageContainer = document.getElementById('image-container');

	// Get data URL of the canvas
	const dataURL = canvas.toDataURL('image/png');

	// Create a new img element
	const img = document.createElement('img');
	img.src = dataURL;
	img.id = 'myImage'
	// Clear any previous images
	imageContainer.innerHTML = '';

	// Append the new img element
	imageContainer.appendChild(img);
	
}


// Function to show the modal
function showModal() {
	const modal = document.getElementById("myModal");
    modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
	const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// Close the modal if the user clicks outside of the modal content
window.onclick = function(event) {
	const modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

