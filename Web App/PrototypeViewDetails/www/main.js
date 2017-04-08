var itemsArray = [];
var borrowersArray = [];
var itemIndex = 1;


/** ADDING ITEMS **/
//when the body of the html loads do this function
function initItem() {
    console.log("body loaded");
    var bottom = document.querySelector(".bottom");
    bottom.innerHTML = "";
    if (localStorage.itemsRecord) {
        itemsArray = JSON.parse(localStorage.itemsRecord);
        for (var i = 0; i < itemsArray.length; i++) {
            generateDiv(i,itemsArray[i].Description, itemsArray[i].Quantity);
        }
    }
}

function initBorrow() {
    if (localStorage.loanRecord) {
    	document.querySelector("#mabody").innerHTML = "";
        borrowersArray = JSON.parse(localStorage.loanRecord);
        for (var i = 0; i < borrowersArray.length; i++) {
            generateTableBorrower(i,borrowersArray[i].Idnum, borrowersArray[i].Name, borrowersArray[i].Item,
                borrowersArray[i].Quantity, borrowersArray[i].Duedate, borrowersArray[i].DateBorrowed);
        }
    }
}

function addItem() {
    var description = document.getElementById("input_description").value.trim();
    var quantity = document.getElementById("input_quantity").value.trim();
    var itemsObject = {
        'Description': description,
        'Quantity': quantity
    };

    if (description === "" || isNaN(quantity) || quantity === "") {
        alert("Please input a number");
    } else if (validate()) {
        alert("not allowed");
    } else {
        var quant = parseInt(quantity);
        var itemsObject = {
            'Description': description,
            'Quantity': quant
        };
        itemsArray.push(itemsObject);
        localStorage.itemsRecord = JSON.stringify(itemsArray);
        initItem();
    }
}

function generateDiv(i,desc, quant) {
    //Create the necessary
    var outerContainer = document.querySelector(".bottom");
    var container = document.createElement("container");
    var pItem = document.createElement("p");
    var pQuant = document.createElement("p");
    var pAction = document.createElement("p");
    var spanDelete = document.createElement("span");
    var spanItem = document.createElement("span");
    var spanQuant = document.createElement("span");

    //Set their Attributes
    container.setAttribute("class", "container");
    spanItem.setAttribute("id","desc:"+i);
    spanQuant.setAttribute("id","quant:"+i);

    //Put the values
    spanItem.innerHTML = desc;
    spanQuant.innerHTML = quant;
    spanDelete.innerHTML = '<button onclick="removeItem('+i+')" >Delete</button><button style="display:none" id="save_button'+i+'" onclick = "saveItem('+i+')">Save</button><button id = "edit_button'+i+'" onclick = "editItem('+i+')">Edit</button>';

    //Show them in the Webpage
    pItem.appendChild(spanItem);
    pQuant.appendChild(spanQuant);
    pAction.appendChild(spanDelete);

    container.appendChild(pItem);
    container.appendChild(pQuant);
    container.appendChild(pAction);
    outerContainer.appendChild(container);

}

function removeItem(i) {
    //Query the div
    var bottom = document.querySelector(".bottom");

    //Empty to delete all the items in the webpage but not in the local storage
    bottom.innerHTML = "";

    //Remove the specified item in the localStorage
    itemsArray.splice(i,1);

    //Put them in the Local storage and reinitialize the Webpage
    localStorage.itemsRecord = JSON.stringify(itemsArray);
    initItem();
}


function editItem(i){


    //Hide the edit button and show the save button
    document.getElementById("edit_button"+i).style.display="none";
    document.getElementById("save_button"+i).style.display="inline";

    //Query the row who called the EditItem
    var item = document.getElementById("desc:"+i);
    var quant = document.getElementById("quant:"+i);

    //Store the old values of the items in a variable
    var item_data = item.innerHTML;
    var quant_data = quant.innerHTML;

    //Add <input> in the <span> element
    item.innerHTML ='<input class="editInput" type="text" id="new_item:'+i+'" value="'+item_data+'">';
    quant.innerHTML ='<input class="editInput" type="text" id="new_quant:'+i+'" value="'+quant_data+'">';

}

function saveItem(i){

    //Get the entered values in the newly created <input> element
    var newItem = document.getElementById("new_item:"+i).value;
    var newQuant = document.getElementById("new_quant:"+i).value;

    //Validate
     if(newItem === "" || isNaN(newQuant) || newQuant === ""){
        alert("Please input a number");
    }else if(validateSaveItem(i)){
        alert("not allowed");
    }else{
        //Change the values in the <span> element
        document.getElementById("desc:"+i).innerHTML = newItem;
        document.getElementById("quant:"+i).innerHTML = newQuant;

        //Hide the Save button and show the edit button
        document.getElementById("edit_button"+i).style.display="block";
        document.getElementById("save_button"+i).style.display="none";

        //change the values of the item in the array and then put it in the local storage
        itemsArray[i].Description = newItem;
        itemsArray[i].Quantity = newQuant;
        localStorage.itemsRecord = JSON.stringify(itemsArray);
        //Refresh the Page
        initItem();
    }

}


function validateSaveItem(itemNo) {
    var validate = false;
    var description = document.getElementById("new_item:"+itemNo).value;
    for (var i = 0; i < itemsArray.length; i++) {
        if(i == itemNo ){
            continue
        }
        else if (description === itemsArray[i].Description) {
            validate = true;
        }

    }
    return validate;

}



function validate() {
    var validate = false;
    var description = document.getElementById("input_description").value;
    for (var i = 0; i < itemsArray.length; i++) {
        if (description === itemsArray[i].Description) {
            validate = true;
        }

    }
    return validate;

}

function addInput() {
	itemIndex++;
	var createBreak = document.createElement('br');
	var addBtn = document.getElementById('addInput');

	var item_date = document.createElement("input");
	var item_date_label = document.createElement("label");

	var item_desc = document.createElement("select");
	var item_desc_label = document.createElement("label");

	var item_quant = document.createElement("input");
	var item_quant_label = document.createElement("label");

	item_date.setAttribute('type','input');
	item_date.setAttribute('id','date_return_'+itemIndex);
	item_date_label.setAttribute('for','date_return_'+itemIndex);
	item_date_label.textContent = 'Due Date: ';

	item_desc.setAttribute('type','select');
	item_desc.setAttribute('id','item_description_'+itemIndex);
	item_desc.setAttribute('class','item_choice');
	item_desc_label.setAttribute('for','item_description_'+itemIndex);
	item_desc_label.textContent = ' Item: ';

	item_quant.setAttribute('type','input');
	item_quant.setAttribute('id','item_quantity_'+itemIndex);
	item_quant_label.setAttribute('for','item_quantity_'+itemIndex);
	item_quant_label.textContent = ' Item Quantity: ';

	document.getElementById("items").insertBefore(item_date, addBtn);
	document.getElementById("items").insertBefore(item_date_label, item_date);

	document.getElementById("items").insertBefore(item_desc, addBtn);
	document.getElementById("items").insertBefore(item_desc_label, item_desc);
	

	document.getElementById("items").insertBefore(item_quant, addBtn);
	document.getElementById("items").insertBefore(item_quant_label, item_quant);

	document.getElementById("items").insertBefore(createBreak, item_date_label);
	prepareItems();

}

/** ADDING BORROWERS **/
function addBorrower() {
    var id = document.getElementById("user_id").value.trim();
    var name = document.getElementById("user_name").value.trim();
    var quantityBorrow = document.getElementById("item_quantityBorrow").value.trim();
    var selectedItem = document.getElementById("item_description").selectedIndex;
    var item = document.getElementsByTagName("option")[selectedItem].value;
    var date = document.getElementById("date_return").value;
    var dateBorrowed = new Date();
    var tempArray = [];
    tempArray = JSON.parse(localStorage.itemsRecord);


    if (id === "" || name === "" || quantityBorrow === "" || date === "") {
        alert("Complete the information needed");
    } else if (isNaN(quantityBorrow) || isNaN(id)) {
        alert("Quantity and ID expecting number format");
    } else {
        for (var i = 0; i < tempArray.length; i++) {
            if (item === tempArray[i].Description) {
                if (tempArray[i].Quantity < quantityBorrow || quantityBorrow <= 0 ) {
                    alert("The Quantity not valid");
                } else {
                    tempArray[i].Quantity -= quantityBorrow;
                    localStorage.itemsRecord = JSON.stringify(tempArray);
                    var borrowersObj = {
                        'Idnum': id,
                        'Name': name,
                        'Item': item,
                        'Quantity': quantityBorrow,
                        'DateBorrowed': dateBorrowed,
                        'Duedate': date
                    };

                    borrowersArray.push(borrowersObj);

                    localStorage.loanRecord = JSON.stringify(borrowersArray);
                    initBorrow();
                    break;
                }
            }
        }
    }
}

function generateTableBorrower(i,id, name, item, quantityBorrow, date, dateBorrowed) {
    //Query table
    var table = document.querySelector("#mabody");
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
    colAction.innerHTML = '<a href ="viewdetails.html"><button onclick="viewQueue('+i+')"> view details </button></a>'

    //Clear the values of the input
    document.getElementById("user_id").value = "";
    document.getElementById("user_name").value = "";
    document.getElementById("date_return").value = "";
    document.getElementById("item_description").value = "";
    document.getElementById("input_quantityBorrow").value = "";
}

function viewQueue(i){
	var myArray = [];
	myArray.push(i);

	localStorage.viewQueue = JSON.stringify(myArray);

}

function viewDetails(){
	if(localStorage.viewQueue){
		var viewQueueArray = [];
		var index;

		//store the index of who pressed the viewDetails
		viewQueueArray = JSON.parse(localStorage.viewQueue);
		index = viewQueueArray[0];
		console.log(index);

		if(index != undefined){
			
			

			//Now Remove it in order for the others to access their details
			viewQueueArray.splice(0,1);
			localStorage.viewQueue = JSON.stringify(viewQueueArray);

			
			//Show Them all!
			document.getElementById("idnumLabel").style.display = "";
			document.getElementById("idnum").style.display = "";

			document.getElementById("nameLabel").style.display = "";
			document.getElementById("name").style.display = "";

			document.getElementById("itemLabel").style.display = "";
			document.getElementById("item").style.display = "";

			document.getElementById("quantityLabel").style.display = "";
			document.getElementById("quantity").style.display = "";

			document.getElementById("duedateLabel").style.display = "";
			document.getElementById("duedate").style.display = "";

			document.getElementById("datereturnLabel").style.display = "";
			document.getElementById("datereturn").style.display = "";


			document.getElementById("return_button").style.display = "";

			//Get Elements and the local storage
			var retbtn = document.getElementById("return_button");
			var borrowersArray = JSON.parse(localStorage.loanRecord);

			document.getElementById("idnum").textContent = borrowersArray[index].Idnum;
			document.getElementById("name").textContent  = borrowersArray[index].Name;
			document.getElementById("item").textContent = borrowersArray[index].Item;
			document.getElementById("quantity").textContent  = borrowersArray[index].Quantity;
			document.getElementById("duedate").textContent  = borrowersArray[index].DateBorrowed;
			document.getElementById("datereturn").textContent  = borrowersArray[index].Duedate;



		}
	}
}

function prepareItems() {
    var items = JSON.parse(localStorage.itemsRecord);
    var itemChoice = document.getElementsByClassName("item_choice");

    //console.log(itemChoice);
    //console.log(itemChoice.length);


	var tempItem = itemChoice[itemIndex-1];
	console.log(tempItem);
	    for (var i = 0; i < items.length; i++) {
	        var optionEl = document.createElement("option");
	        optionEl.setAttribute("value", items[i].Description);
	        tempItem.appendChild(optionEl);
	        optionEl.textContent = items[i].Description;
	    }


}

function search() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("search_box");
    filter = input.value.toUpperCase();
    table = document.querySelector("table[name=borrowerTable]");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        tdId = tr[i].getElementsByTagName("td")[0];
        tdName = tr[i].getElementsByTagName("td")[1];
        tdItem = tr[i].getElementsByTagName("td")[2];
        tdDate = tr[i].getElementsByTagName("td")[5];
        if (tdId || tdName) {
            if (tdId.innerHTML.toUpperCase().indexOf(filter) > -1 || tdName.innerHTML.toUpperCase().indexOf(filter) > -1 || tdItem.innerHTML.toUpperCase().indexOf(filter) > -1 || tdDate.innerHTML.toUpperCase().indexOf(filter) > -1){
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}