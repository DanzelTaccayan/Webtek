var itemsArray = [];
var borrowersArray = [];
var itemIndex = 1;
var RepopItemsArray = [];


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
            generateTableBorrower(i,borrowersArray[i].Idnum, borrowersArray[i].Name,  borrowersArray[i].DateBorrowed);
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

        document.getElementById("input_description").value = "";
        document.getElementById("input_quantity").value = "";

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
	var container = document.createElement("container");
	var createBreak = document.createElement('br');
	var addBtn = document.getElementById('addInput');

	var item_date = document.createElement("input");
	var item_date_label = document.createElement("label");

	var item_desc = document.createElement("select");
	var item_desc_label = document.createElement("label");

	var item_quant = document.createElement("input");
	var item_quant_label = document.createElement("label");

	var removeBtn = document.createElement("button");

	var itemLeft = document.createElement("span");

	var previousItems = "";

	removeBtn.setAttribute('onclick','removeInput('+itemIndex+')');
	removeBtn.textContent = "x"

	container.setAttribute('id','container_'+itemIndex);

	//Date
	item_date.setAttribute('type','date');
	item_date.setAttribute('id','date_return_'+itemIndex);
	item_date_label.setAttribute('for','date_return_'+itemIndex);
	item_date_label.textContent = 'Due Date: ';

	//Item Description
	item_desc.setAttribute('type','select');
	item_desc.setAttribute('id','item_description_'+itemIndex);
	item_desc.setAttribute('class','item_choice');
	item_desc.setAttribute('onchange', 'itemQtyLeft('+itemIndex+')');
	item_desc.setAttribute('onfocus', 'itemQtyLeft('+itemIndex+')');
	item_desc_label.setAttribute('for','item_description_'+itemIndex);
	item_desc_label.textContent = ' Item: ';


	//The Item Left for a certain Item
	itemLeft.setAttribute('id', 'item_left_'+itemIndex);


	//The Quantity you would like to get
	item_quant.setAttribute('type','input');
	item_quant.setAttribute('id','item_quantityBorrow_'+itemIndex);
	item_quant_label.setAttribute('for','item_quantityBorrow_'+itemIndex);
	item_quant_label.textContent = ' Item Quantity: ';

	


	container.appendChild(item_date_label);
	container.appendChild(item_date);

	
	container.appendChild(item_desc_label);
	container.appendChild(item_desc);

	container.appendChild(itemLeft);
	
	container.appendChild(item_quant_label);
	container.appendChild(item_quant);
	
	container.appendChild(removeBtn);

	container.insertBefore(createBreak, item_date_label);
	document.getElementById("items").appendChild(container);
	itemIndex++;
	if(itemIndex == JSON.parse(localStorage.itemsRecord).length){
		document.getElementById('requestForm').removeChild(addBtn);
	}
	var item_choice = document.getElementsByClassName("item_choice")[itemIndex-2];
	item_choice.setAttribute('disabled', 'disabled');

	for(var i = 0; i < document.getElementsByClassName("item_choice").length - 1; i++){
		var tempChoice = document.getElementsByClassName("item_choice")[i];

		previousItems += tempChoice[tempChoice.selectedIndex].value+" ";
		
	}

	prepareNewlyAddedItems(previousItems);
	itemQtyLeft(itemIndex-1);


}


function prepareNewlyAddedItems(prev_item) {
    var items = JSON.parse(localStorage.itemsRecord);
    var itemChoice = document.getElementsByClassName("item_choice");
    var add_btn = document.createElement('button');

    add_btn.setAttribute('id','addInput');
    add_btn.setAttribute('onclick','addInput()');
    add_btn.textContent = "+";

    if(!document.getElementById("addInput")){
	    if(JSON.parse(localStorage.itemsRecord).length > itemIndex){
	    	document.getElementById("requestForm").appendChild(add_btn);
	    }
	}

	var tempItem = itemChoice[itemIndex-1];

	var prev_item_array = prev_item.split(" ");
	
	    for(var i =0 ;i < items.length; i++) {
	    	if(prev_item_array.indexOf(items[i].Description) >= 0){
	    		continue;
	    	}
	    	else{
		        var optionEl = document.createElement("option");
		        optionEl.setAttribute("value", items[i].Description);
		        tempItem.appendChild(optionEl);
		        optionEl.textContent = items[i].Description;
	        }
	    }


}


function itemQtyLeft(index){
	var showQty = document.getElementById("item_left_"+index);
	var selectElem = document.getElementById("item_description_"+index);
	var itemList = [];
	var qty;

	itemList = JSON.parse(localStorage.itemsRecord)

	for(var i = 0; i < itemList.length; i++){
		if(selectElem[selectElem.selectedIndex].value == itemList[i].Description){
			qty = itemList[i].Quantity;
			break;
		}

	}
	showQty.textContent = "Item Left: "+qty;


}


function repopulateItems(index) {

    for(var i = 0; i < index; i++){

		var container = document.createElement("container");
		var createBreak = document.createElement('br');
		var addBtn = document.getElementById('addInput');

		var item_date = document.createElement("input");
		var item_date_label = document.createElement("label");

		var item_desc = document.createElement("select");
		var item_desc_label = document.createElement("label");

		var item_quant = document.createElement("input");
		var item_quant_label = document.createElement("label");

		var removeBtn = document.createElement("button");

		var itemLeft = document.createElement("span");

		var previousItems = "";

		removeBtn.setAttribute('onclick','removeInput('+itemIndex+')');
		removeBtn.textContent = "x"

		container.setAttribute('id','container_'+itemIndex);


		//The Due Date of the Item
		item_date.setAttribute('type','date');
		item_date.setAttribute('id','date_return_'+itemIndex);
		item_date.setAttribute('value',RepopItemsArray[i].DueDate);
		item_date_label.setAttribute('for','date_return_'+itemIndex);
		item_date_label.textContent = 'Due Date: ';

		//The Description of the Item
		item_desc.setAttribute('type','select');
		item_desc.setAttribute('id','item_description_'+itemIndex);
		item_desc.setAttribute('class','item_choice');
		item_desc.setAttribute('onchange', 'itemQtyLeft('+itemIndex+')');
		item_desc.setAttribute('onfocus', 'itemQtyLeft('+itemIndex+')');
		item_desc_label.setAttribute('for','item_description_'+itemIndex);
		item_desc_label.textContent = ' Item: ';

		//The Item Left for a certain Item
		itemLeft.setAttribute('id', 'item_left_'+itemIndex);

		//The Quantity you would like to get
		item_quant.setAttribute('type','input');
		item_quant.setAttribute('id','item_quantityBorrow_'+itemIndex);
		item_quant.setAttribute('value', RepopItemsArray[i].itemQuant);
		item_quant_label.setAttribute('for','item_quantityBorrow_'+itemIndex);
		item_quant_label.textContent = ' Item Quantity: ';

		container.appendChild(item_date_label);
		container.appendChild(item_date);

		
		container.appendChild(item_desc_label);
		container.appendChild(item_desc);

		container.appendChild(itemLeft);
		
		container.appendChild(item_quant_label);
		container.appendChild(item_quant);
		

		document.getElementById("items").appendChild(container);

		if(i != 0){
			container.appendChild(removeBtn);
			container.insertBefore(createBreak, item_date_label);
		}

		itemIndex++;

		if(itemIndex == JSON.parse(localStorage.itemsRecord).length){
			document.getElementById('requestForm').removeChild(addBtn);
		}
		if(itemIndex > 1){
			var item_choice = document.getElementsByClassName("item_choice")[itemIndex-2];
			item_choice.setAttribute('disabled', 'disabled');

			for(var c = 0; c < document.getElementsByClassName("item_choice").length - 1; c++){
				var tempChoice = document.getElementsByClassName("item_choice")[c];

				previousItems += tempChoice[tempChoice.selectedIndex].value+" ";
				
			}

			console.log(previousItems);

			prepareNewlyAddedItems(previousItems);

			
		}else{
			prepareItems();

		}

		for(var b = 0; b < document.getElementById('item_description_'+i).childNodes.length; b++) {
			var tempChildren = document.getElementById('item_description_'+i).childNodes;

			if(tempChildren[b].value == RepopItemsArray[i].ItemSelected){
				document.getElementById('item_description_'+i).childNodes[b].selected = true;
				itemQtyLeft(itemIndex-1);
			}
		}

    }
        RepopItemsArray = [];

}

function removeInput(index) {
	itemIndex = 0;
	var tempCont = document.getElementById("items");
	var tempContLength = tempCont.children.length-1;


	
    for(var c = 0; c < tempCont.children.length; c++){
        var dueDate =  document.getElementById("date_return_"+c).value;
        var itemDescSelected = document.getElementById("item_description_"+c);

        var itemQuant = document.getElementById("item_quantityBorrow_"+c).value;

        if(c == index){
            continue
        }
        else {
            var tempItemsObj = {
                'DueDate': dueDate,
                'ItemSelected': itemDescSelected[itemDescSelected.selectedIndex].value,
                'itemQuant': itemQuant
            };
            RepopItemsArray.push(tempItemsObj);
        }

    }


    tempCont.innerHTML = '';
	repopulateItems(tempContLength);
	
}

/** ADDING BORROWERS **/
function addBorrower() {
    var id = document.getElementById("user_id").value.trim();
    var name = document.getElementById("user_name").value.trim();

    var dateBorrowed = new Date();
    var tempArray = [];
    var tempItemArray = [];
    var borrowersObj = {};

    tempArray = JSON.parse(localStorage.itemsRecord);


    //Put the info: Name and ID and initialize the Items array
    borrowersObj = {
                    'Idnum': id,
                    'Name': name,
                    'DateBorrowed':dateBorrowed,
                    'Items': []
                };

    //Put the Items
    for(c = 0; c < itemIndex; c++ ){
    	var selectedItem = document.getElementById("item_description_"+c).selectedIndex;

        var quantityBorrow = document.getElementById("item_quantityBorrow_"+c).value.trim();
        var item = document.getElementById("item_description_"+c).childNodes[selectedItem].value;
        var date = document.getElementById("date_return_"+c).value;


    	for (var i = 0; i < tempArray.length; i++) {
            if (item === tempArray[i].Description) {
                    tempArray[i].Quantity -= quantityBorrow;
                    localStorage.itemsRecord = JSON.stringify(tempArray);

                    var itemObj = {
                        'ItemName':item,
                        'Quantity':quantityBorrow,
                        'Duedate':date
                    };

                    tempItemArray.push(itemObj);
                    

                   
                    break;            
            }
    	}

    }
    borrowersObj.Items = tempItemArray;
    borrowersArray.push(borrowersObj);
    localStorage.loanRecord = JSON.stringify(borrowersArray);
    alert("Request Successfully Added");
    location.reload();
    itemIndex = 1;
}

function addBorrowerChecker() {
    var id = document.getElementById("user_id").value.trim();
    var name = document.getElementById("user_name").value.trim();
    var errors = 0;

    var dateBorrowed = new Date();
    var tempArray = [];

    tempArray = JSON.parse(localStorage.itemsRecord);

    //First check the Id and the name
    if (id === "" || name === "") {
        alert("Complete the information needed");
        errors++;
    } else if (isNaN(id)) {
        alert("ID expecting number format");
        errors++;
    }

    //If No Errors Continue
    if(errors == 0){
	    for(c = 0; c < itemIndex; c++ ){
	    	var selectedItem = document.getElementById("item_description_"+c).selectedIndex;

	        var quantityBorrow = document.getElementById("item_quantityBorrow_"+c).value.trim(); 
	        var item = document.getElementById("item_description_"+c).childNodes[selectedItem].value;
	        var date = document.getElementById("date_return_"+c).value;

	        if (quantityBorrow === "" || date === "") {
	            alert("Complete the information needed");
	            errors++;
	            break;
	        } else if (isNaN(quantityBorrow)) {
	            alert("Quantity expecting number format");
	            errors++;
	            break;
	        } else {
	            for (var i = 0; i < tempArray.length; i++) {
	                if (item === tempArray[i].Description) {
	                    if (tempArray[i].Quantity < quantityBorrow || quantityBorrow <= 0 ) {
	                    	errors++;
	                        alert("The Quantity that you have entered on the item: "+tempArray[i].Description+" which is "+quantityBorrow+" is greater than the current item inventory");
	                        c = itemIndex+1;
	                        break;
	                    }
	                }
	            }

	        }

	    }

	    //If still no errors, add it to the local Storage
	    if(errors == 0){
	    	addBorrower();
	    }
	}
}


function generateTableBorrower(i,id, name, dateBorrowed) {
    //Query table
    var table = document.querySelector("#mabody");
    //Insert a row into the table
    var tabRow = table.insertRow();

    //Insert into the first and second column of the tabRow var
    var colStudentId = tabRow.insertCell(0);
    var colStudentName = tabRow.insertCell(1);
    var colDateBorrow = tabRow.insertCell(2);
    var colAction = tabRow.insertCell(3);

    //put some values
    colStudentId.textContent = id;
    colStudentName.textContent = name;
    colDateBorrow.textContent = dateBorrowed;
    colAction.innerHTML = '<a href ="viewdetails.html"><button onclick="viewQueue('+i+')"> view details </button></a>'

    //Clear the values of the input
    document.getElementById("user_id").value = "";
    document.getElementById("user_name").value = "";
    
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

			document.getElementById("duedateLabel").style.display = "";
			document.getElementById("duedate").style.display = "";

			document.getElementById("return_button").style.display = "";

			//Get Elements and the local storage
			var retbtn = document.getElementById("return_button");
			var borrowersArray = JSON.parse(localStorage.loanRecord);

			document.getElementById("idnum").textContent = borrowersArray[index].Idnum;
			document.getElementById("name").textContent  = borrowersArray[index].Name;
            document.getElementById("duedate").textContent  = borrowersArray[index].DateBorrowed;

            var outerContainer = document.querySelector(".itemdetails");
            var temp = borrowersArray[index].Items;
               
            for (var c = 0; c < temp.length; c++) {
                var pItem = document.createElement("p");
                var pQuant = document.createElement("p");
                var pReturn = document.createElement("p");
                var pAction = document.createElement("p");

                pItem.setAttribute("id","desc"+c);
                pQuant.setAttribute("id","quant"+c);
                pReturn.setAttribute("id","rdate"+c);
                pAction.setAttribute("id", "action"+c);

                pItem.innerHTML  = borrowersArray[index].Items[c].ItemName;  
                pQuant.innerHTML  = borrowersArray[index].Items[c].Quantity;  
                pReturn.innerHTML  = borrowersArray[index].Items[c].Duedate; 
                pAction.innerHTML = '<input type = "text" id = "rText'+c+'"> <input type = "button" id = "retbtn'+c+'" value = "Return" onclick = "returnItem()"> ';

                outerContainer.appendChild(pItem);
                outerContainer.appendChild(pQuant);
                outerContainer.appendChild(pReturn);
                outerContainer.appendChild(pAction);
                
			}	
		}
	}
}

function prepareItems() {
    var items = JSON.parse(localStorage.itemsRecord);
    var itemChoice = document.getElementsByClassName("item_choice");
    var add_btn = document.createElement('button');

    add_btn.setAttribute('id','addInput');
    add_btn.setAttribute('onclick','addInput()');
    add_btn.textContent = "+";

    if(!document.getElementById("addInput")){
	    if(JSON.parse(localStorage.itemsRecord).length > itemIndex){
	    	document.getElementById("requestForm").appendChild(add_btn);
	    }
	}


	var tempItem = itemChoice[itemIndex-1];

	    for(var i =0 ;i < items.length; i++) {
	        var optionEl = document.createElement("option");
	        optionEl.setAttribute("value", items[i].Description);
	        tempItem.appendChild(optionEl);
	        optionEl.textContent = items[i].Description;
	    }
	itemQtyLeft(0);

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
        tdDate = tr[i].getElementsByTagName("td")[2];
        if (tdId || tdName) {
            if (tdId.innerHTML.toUpperCase().indexOf(filter) > -1 || tdName.innerHTML.toUpperCase().indexOf(filter) > -1 ||  tdDate.innerHTML.toUpperCase().indexOf(filter) > -1){
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function returnAll() {  
    var borrowersArray = [];
    borrowersArray= JSON.parse(localStorage.loanRecord);
    var itemsArray = [];
    itemsArray = JSON.parse(localStorage.itemsRecord);
    for (var c = 0; c < borrowersArray.length; c++) {
        if (borrowersArray[c].Idnum == document.getElementById('idnum').textContent) {
           
            for (var i = 0; i < borrowersArray.length; i++) {
                if (borrowersArray[c].Items[i] != 0) {

                    for (var x = 0; x < itemsArray.length; x++) {
                        if (itemsArray[x].Description == borrowersArray[c].Items[i].ItemName ) {
                            itemsArray[x].Quantity += parseInt(borrowersArray[c].Items[i].Quantity);
                            borrowersArray[c].Items[i].Quantity = 0;
                            i++;
                            x = -1;

                            if (borrowersArray[c].Items.length == (i)) {
                                break;
                            }
                        }
                    }
                }   
            } 
        }  
    }

    alert("Successfully return all the Items borrowed!");
    localStorage.loanRecord = JSON.stringify(borrowersArray);
    localStorage.itemsRecord = JSON.stringify(itemsArray);        

}

function returnItem() {
    var borrowersArray = [];
    var itemsArray = [];     
    itemsArray = JSON.parse(localStorage.itemsRecord);
    borrowersArray = JSON.parse(localStorage.loanRecord);

    for (var a = 0; a < 10000; a++) {
        var value = document.getElementById('rText'+a).value;
        var item = document.getElementById('desc'+a).textContent;
        
        if (value != "") {
            for (var i = 0; i < borrowersArray.length; i++) { 
                if (borrowersArray[i].Idnum == document.getElementById('idnum').textContent) {

                    for (var c = 0; c < borrowersArray[i].Items.length; c++) {
                        if (item == borrowersArray[i].Items[c].ItemName) {
                            borrowersArray[i].Items[c].Quantity -= parseInt(value);
                            break;
                        }
                        continue;
                    }

                    for (var x = 0; x < borrowersArray[i].Items.length; x++) {
                        if (item == itemsArray[x].Description) {
                            itemsArray[x].Quantity += parseInt(value);
                            break;
                        }
                        continue;
                    }
                }
                
            }     
        }

        if (value != "") {
            break;
        }      
    }

    alert("Successfully returned the partial Quantity Items borrowed!");
    localStorage.loanRecord = JSON.stringify(borrowersArray);
    localStorage.itemsRecord = JSON.stringify(itemsArray); 
}                