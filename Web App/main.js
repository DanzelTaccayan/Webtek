var itemsArray = [];
var borrowersArray = [];


/** ADDING ITEMS **/
//when the body of the html loads do this function
function initItem() {
	console.log("body loaded");
	if(localStorage.itemsRecord){
		itemsArray = JSON.parse(localStorage.itemsRecord);
		for (var i = 0; i < itemsArray.length; i++) {
			generateTableItems(i,itemsArray[i].Description,itemsArray[i].Quantity);
		}
	} 
}

function initBorrow() {
	if (localStorage.loanRecord) {
		borrowersArray = JSON.parse(localStorage.loanRecord);
		for (var i = 0; i < borrowersArray.length; i++) {
			generateTableBorrower(borrowersArray[i].Idnum, borrowersArray[i].Name, borrowersArray[i].Item, 
				borrowersArray[i].Quantity, borrowersArray[i].Duedate, borrowersArray[i].DateBorrowed);
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
        itemsArray.push(itemsObject);	
        localStorage.itemsRecord = JSON.stringify(itemsArray);
        initItem();

    }
}

function generateTableItems(i,desc, quantity) {
	//Query table
	var table = document.getElementById("tableBody");
	//Insert a row into the table
	var tabRow = table.insertRow();

	//Insert into the first and second column of the tabRow var
	var colItemDesc = tabRow.insertCell(0);
	var colItemQuant = tabRow.insertCell(1);
	var colAction = tabRow.insertCell(2);

	colItemDesc.setAttribute("id","desc:"+i);
	colItemQuant.setAttribute("id","quant:"+i);

	//put some values
	colItemDesc.textContent = desc;
	colItemQuant.textContent = quantity;
	colAction.innerHTML = '<button id = "edit_button'+i+'" onclick = "editItem('+i+')">Edit</button><button style="display:none" id="save_button'+i+'" onclick = "saveItem('+i+')">Save</button><br><button onclick="removeTableRow('+i+')">Delete</button>'

	//Clear the values of the input
	document.getElementById("input_description").value = "";
	document.getElementById("input_quantity").value = "";
}

function removeTableRow(i) {

	//Query table
	var table = document.getElementById("tableBody");
	table.deleteRow(i);
	itemsArray.splice(i,1);
	localStorage.itemsRecord = JSON.stringify(itemsArray);
	initItem();
}

function editItem(i){
	document.getElementById("edit_button"+i)
	var itemObj = itemsArray[i];

	document.getElementById("edit_button"+i).style.display="none";
	document.getElementById("save_button"+i).style.display="block";

	var item = document.getElementById("desc:"+i);
	var quant = document.getElementById("quant:"+i);

	var item_data = item.innerHTML;
	var quant_data = quant.innerHTML;

	item.innerHTML ='<input type="text" id="new_item:'+i+'" value="'+item_data+'">';
	quant.innerHTML ='<input type="text" id="new_quant:'+i+'" value="'+quant_data+'">';

}

function saveItem(i){

	var newItem = document.getElementById("new_item:"+i).value;
	var newQuant = document.getElementById("new_quant:"+i).value;

	 if(newItem === "" || isNaN(newQuant) || newQuant === ""){
        alert("Please input a number");
    }else if(validate()){
        alert("not allowed");
    }else{

		document.getElementById("desc:"+i).innerHTML = newItem;
		document.getElementById("quant:"+i).innerHTML = newQuant;


		document.getElementById("edit_button"+i).style.display="block";
		document.getElementById("save_button"+i).style.display="none";
		itemsArray[i].Description = newItem;
		itemsArray[i].Quantity = newQuant;
		localStorage.itemsRecord = JSON.stringify(itemsArray);
		initItem();
	}

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
    var quantityBorrow = document.getElementById("input_quantityBorrow").value;
    var selectedItem = document.getElementById("item_description").selectedIndex;
    var item = document.getElementsByTagName("option")[selectedItem].value;
    var date = document.getElementById("date_return").value;
    var dateBorrowed = new Date();
    var tempArray = [];
    tempArray = JSON.parse(localStorage.itemsRecord);
 

    if (id === "" || name === "" || quantityBorrow === "" || date === "" ) { 
        alert("Complete the information needed");
    } else if (isNaN(quantityBorrow) || isNaN(id)) {
    	alert("Quantity and ID expecting number format");
    } else {	
    	for (var i = 0; i < tempArray.length; i++) {
    		if (item === tempArray[i].Description) {
    			if (tempArray[i].Quantity < quantityBorrow) {
    				alert("The Quantity entered exceed to the Quantity available of a Item ");
    			} else {
    				tempArray[i].Quantity -= quantityBorrow;
    				localStorage.itemsRecord = JSON.stringify(tempArray);
			        var borrowersObj = {'Idnum': id, 'Name': name, 'Item': item, 'Quantity': quantityBorrow, 'DateBorrowed':dateBorrowed,'Duedate': date };

			        borrowersArray.push(borrowersObj);

			        localStorage.loanRecord =JSON.stringify(borrowersArray);  
			        generateTableBorrower(id, name, item, quantityBorrow, date, dateBorrowed);
			        break;
    			}
    		}
    	}		
    } 
}

function generateTableBorrower(id, name, item, quantityBorrow, date, dateBorrowed  ) {
	//Query table
	var table = document.querySelector("table[name=borrowerTable]");
	//Insert a row into the table
	var tabRow = table.insertRow();

	//Insert into the first and second column of the tabRow var
	var colStudentId = tabRow.insertCell(0);
	var colStudentName = tabRow.insertCell(1);
	var colItemName = tabRow.insertCell(2);
	var colItemQuant = tabRow.insertCell(3);
	var colDateBorrow = tabRow.insertCell(4);
	var colDateReturn = tabRow.insertCell(5);
	var colAction = tabRow.insertCell(6);

	//put some values
	colStudentId.textContent = id;
	colStudentName.textContent = name;
	colItemName.textContent = item;
	colItemQuant.textContent = quantityBorrow;
	colDateBorrow.textContent = dateBorrowed;
	colDateReturn.textContent = date;
	colAction.innerHTML = "<button> view details </button>"

	//Clear the values of the input
	document.getElementById("user_id").value = "";
	document.getElementById("user_name").value = "";
	document.getElementById("date_return").value = "";
	document.getElementById("item_description").value = "";
	document.getElementById("input_quantityBorrow").value = "";
}

function prepareItems(){
	var items = JSON.parse(localStorage.itemsRecord);
	var itemChoice = document.querySelector("select[name=item_choice]");

	for(var i = 0; i < items.length; i++){
		var optionEl = document.createElement("option");
		optionEl.setAttribute("value",items[i].Description);
		itemChoice.appendChild(optionEl);
		optionEl.textContent = items[i].Description;
	}
}