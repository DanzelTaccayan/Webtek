var itemsArray = [];
var borrowersArray = [];


/** ADDING ITEMS **/
//when the body of the html loads do this function
document.body.onload = function() {
	console.log("body loaded");
	if(localStorage.itemsRecord){
		itemsArray = JSON.parse(localStorage.itemsRecord);
		for (var i = 0; i < itemsArray.length; i++) {
			generateTableItems(itemsArray[i].Description,itemsArray[i].Quantity);
		}
	}
}

function addItem() {
    var description = document.getElementById("input_description").value;
    var quantity = document.getElementById("input_quantity").value;               
    var itemsObject = {'Description': description, 'Quantity': quantity}; 
    
    if(description === "" || isNaN(quantity) || quantity === ""){
        alert("Please input a number");
    }else if(validate()){
        alert("not allowed");
    }else{
        var quant = parseInt(quantity);
        var itemsObject = {'Description': description, 'Quantity': quant};
        generateTableItems(description,quant);
        itemsArray.push(itemsObject);	
        localStorage.itemsRecord = JSON.stringify(itemsArray);
    }
}

function generateTableItems(desc, quantity) {
	//Query table
	var table = document.querySelector("table[name=mytable]");
	//Insert a row into the table
	var tabRow = table.insertRow();

	//Insert into the first and second column of the tabRow var
	var colItemDesc = tabRow.insertCell(0);
	var colItemQuant = tabRow.insertCell(1);

	//put some values
	colItemDesc.textContent = desc;
	colItemQuant.textContent = quantity;

	//Clear the values of the input
	document.getElementById("input_description").value = "";
	document.getElementById("input_quantity").value = "";
}

function validate(){
    var validate = false;
    var description = document.getElementById("input_description").value;
        for (var i = 0; i < itemsArray.length; i++){
            if (description === itemsArray[i].Description){
                validate = true;
            }

        }
    return validate;
    
}

/** ADDING BORROWERS **/
function addBorrower(){
    var id = document.getElementById("user_id").value;
    var name = document.getElementById("user_name").value;
    var quantity = document.getElementById("input_quantity").value;
    var item = document.getElementById("item_description").value;
    var date = document.getElementById("date_return").value;
    var dateBorrowed = new Date();

    if (id === "" || name === "" || quantity === "" || isNaN(quantity) || date === "" || isNaN(id)) { 
        alert("Complete the information needed");
    } else {
        

        var borrowersObj = {'Idnum': id, 'Name': name, 'Item': item, 'Quantity': quantity, 'Date borrowed':dateBorrowed,'Duedate': date };

        borrowersArray.push(borrowersObj);

        localStorage.loanRecord =JSON.stringify(borrowersArray);  
    } 
}
