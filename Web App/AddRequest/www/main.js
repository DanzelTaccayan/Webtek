var itemsArray = [];
var borrowersArray = [];
var itemIndex = 1;
var RepopItemsArray = [];
var returnersArray = [];


function DateToday() {
    var month, day, year, hour, minute;
    var dateAtm = new Date();
    month = dateAtm.getMonth();
    day = dateAtm.getDate();
    year = dateAtm.getFullYear();
    hour = dateAtm.getHours();
    minute = dateAtm.getMinutes();
    month++;
    if (month < 10) {
        month = "0" + month;
    }

    if (minute < 10) {
        minute = "0" + minute;
    }
    var date = year + '-' + month + '-' + day;
    var time = hour + ":" + minute;
    return date + " at " + time + " ";
}

function lateRequestChecker(date) {
    var dueDate = new Date(date);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dueDate <= today) {
        return false;
    } else {
        return true;
    }
}

function statusChecker(index) {
    returnersArray = JSON.parse(localStorage.returnLog);
    var returnersItems = [];
    var status = " All are in Good Condition ";
    returnersItems = returnersArray[index].Items;

    for (var i = 0; i < returnersItems.length; i++) {
        if (returnersItems[i].DefectiveItemsReturned != "") {
            status = " Defective Items Returned ";
            break;
        }
    }
    return status;
}
/** ADDING ITEMS **/
//when the body of the html loads do this function
function initItem() {
    console.log("body loaded");
    var bottom = document.querySelector(".bottom");
    bottom.innerHTML = "";
    if (localStorage.itemsRecord) {
        itemsArray = JSON.parse(localStorage.itemsRecord);
        for (var i = 0; i < itemsArray.length; i++) {
            generateDiv(i, itemsArray[i].Description, itemsArray[i].Quantity);
        }
    }
}

function initBorrow() {
    if (localStorage.loanRecord) {
        document.querySelector("#mabody").innerHTML = "";
        borrowersArray = JSON.parse(localStorage.loanRecord);
        for (var i = 0; i < borrowersArray.length; i++) {
            generateTableBorrower(i, borrowersArray[i].Idnum, borrowersArray[i].Name, borrowersArray[i].DateBorrowed);
        }
    }
}

function initReturner() {
    if (localStorage.returnLog) {
        document.querySelector("#mabody").innerHTML = "";
        returnersArray = JSON.parse(localStorage.returnLog)
        for (var i = 0; i < returnersArray.length; i++) {
            generateTableReturner(i, returnersArray[i].Idnum, returnersArray[i].Name, returnersArray[i].DateBorrowed, statusChecker(i));
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

function generateDiv(i, desc, quant) {
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
    spanItem.setAttribute("id", "desc:" + i);
    spanQuant.setAttribute("id", "quant:" + i);

    //Put the values
    spanItem.innerHTML = desc;
    spanQuant.innerHTML = quant;
    spanDelete.innerHTML = '<button onclick="removeItem(' + i + ')" >Delete</button><button style="display:none" id="save_button' + i + '" onclick = "saveItem(' + i + ')">Save</button><button id = "edit_button' + i + '" onclick = "editItem(' + i + ')">Edit</button>';

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
    itemsArray.splice(i, 1);

    //Put them in the Local storage and reinitialize the Webpage
    localStorage.itemsRecord = JSON.stringify(itemsArray);
    initItem();
}


function editItem(i) {

    //Hide the edit button and show the save button
    document.getElementById("edit_button" + i).style.display = "none";
    document.getElementById("save_button" + i).style.display = "inline";

    //Query the row who called the EditItem
    var item = document.getElementById("desc:" + i);
    var quant = document.getElementById("quant:" + i);

    //Store the old values of the items in a variable
    var item_data = item.innerHTML;
    var quant_data = quant.innerHTML;

    //Add <input> in the <span> element
    item.innerHTML = '<input class="editInput" type="text" id="new_item:' + i + '" value="' + item_data + '">';
    quant.innerHTML = '<input class="editInput" type="text" id="new_quant:' + i + '" value="' + quant_data + '">';

}

function saveItem(i) {

    //Get the entered values in the newly created <input> element
    var newItem = document.getElementById("new_item:" + i).value;
    var newQuant = document.getElementById("new_quant:" + i).value;

    //Validate
    if (newItem === "" || isNaN(newQuant) || newQuant === "") {
        alert("Please input a number");
    } else if (validateSaveItem(i)) {
        alert("not allowed");
    } else {
        //Change the values in the <span> element
        document.getElementById("desc:" + i).innerHTML = newItem;
        document.getElementById("quant:" + i).innerHTML = newQuant;

        //Hide the Save button and show the edit button
        document.getElementById("edit_button" + i).style.display = "block";
        document.getElementById("save_button" + i).style.display = "none";

        //change the values of the item in the array and then put it in the local storage
        itemsArray[i].Description = newItem;
        itemsArray[i].Quantity = newQuant;
        localStorage.itemsRecord = JSON.stringify(itemsArray);
    }
}


function validateSaveItem(itemNo) {
    var validate = false;
    var description = document.getElementById("new_item:" + itemNo).value;
    for (var i = 0; i < itemsArray.length; i++) {
        if (i == itemNo) {
            continue
        } else if (description === itemsArray[i].Description) {
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
    var container = document.createElement("div");
    var createBreak = document.createElement('br');
    var addBtn = document.getElementById('addInput');

    var item_date = document.createElement("input");

    var item_desc = document.createElement("select");

    var item_quant = document.createElement("input");

    var removeBtn = document.createElement("button");

    var itemLeft = document.createElement("span");

    var previousItems = "";

    var itemHeader = document.createElement('h3');
    itemHeader.textContent = "Item " + (itemIndex + 1);

    removeBtn.setAttribute('onclick', 'removeInput(' + itemIndex + ')');
    removeBtn.textContent = "Delete Item"
    removeBtn.setAttribute('class', 'deleteItem');
    container.setAttribute('id', 'container_' + itemIndex);
    container.setAttribute('class', 'wrapper_container');
    container.appendChild(itemHeader);


    //Date
    item_date.setAttribute('type', 'date');
    item_date.setAttribute('id', 'date_return_' + itemIndex);
    item_date.setAttribute("class", "modal_form");



    //Item Description
    item_desc.setAttribute('type', 'select');
    item_desc.setAttribute('id', 'item_description_' + itemIndex);

    item_desc.setAttribute('class', 'item_choice select-style');

    item_desc.setAttribute('onchange', 'itemQtyLeft(' + itemIndex + ')');
    item_desc.setAttribute('onfocus', 'itemQtyLeft(' + itemIndex + ')');


    //The Item Left for a certain Item
    itemLeft.setAttribute('id', 'item_left_' + itemIndex);


    //The Quantity you would like to get
    item_quant.setAttribute('type', 'text');
    item_quant.setAttribute('id', 'item_quantityBorrow_' + itemIndex);
    item_quant.setAttribute('placeholder', 'Item Quantity')
    item_quant.setAttribute("class", "")


    container.appendChild(item_date);

    container.appendChild(item_desc);

    container.appendChild(itemLeft);

    container.appendChild(item_quant);

    container.appendChild(removeBtn);



    document.getElementById("items").appendChild(container);
    itemIndex++;
    if (itemIndex == JSON.parse(localStorage.itemsRecord).length) {
        document.getElementById('requestForm').removeChild(addBtn);
    }

    //remove button for first item
    if (itemIndex == 2) {
        var rmv_btn0 = document.createElement('button');
        rmv_btn0.setAttribute('onclick', 'removeInput(0)');
        rmv_btn0.setAttribute('name', 'remove_buttonAt0');
        rmv_btn0.setAttribute('class', 'deleteItem');
        rmv_btn0.textContent = "Delete Item";
        document.getElementById('container_0').appendChild(rmv_btn0);
    }

    var item_choice = document.getElementsByClassName("item_choice")[itemIndex - 2];
    item_choice.setAttribute('disabled', 'disabled');

    for (var i = 0; i < document.getElementsByClassName("item_choice").length - 1; i++) {
        var tempChoice = document.getElementsByClassName("item_choice")[i];

        previousItems += tempChoice[tempChoice.selectedIndex].value + " ";

    }


    prepareNewlyAddedItems(previousItems);
    itemQtyLeft(itemIndex - 1);


}


function prepareNewlyAddedItems(prev_item) {
    var items = JSON.parse(localStorage.itemsRecord);
    var itemChoice = document.getElementsByClassName("item_choice");
    var add_btn = document.createElement('button');

    add_btn.setAttribute('id', 'addInput');
    add_btn.setAttribute('onclick', 'addInput()');
    add_btn.textContent = "+";

    if (!document.getElementById("addInput")) {
        if (JSON.parse(localStorage.itemsRecord).length > itemIndex) {
            document.getElementById("requestForm").appendChild(add_btn);
        }
    }

    var tempItem = itemChoice[itemIndex - 1];

    var prev_item_array = prev_item.split(" ");

    for (var i = 0; i < items.length; i++) {
        if (prev_item_array.indexOf(items[i].Description) >= 0) {
            continue;
        } else {
            var optionEl = document.createElement("option");
            optionEl.setAttribute("value", items[i].Description);
            tempItem.appendChild(optionEl);
            optionEl.textContent = items[i].Description;
        }
    }


}

function itemQtyLeft(index) {
    var showQty = document.getElementById("item_left_" + index);
    var selectElem = document.getElementById("item_description_" + index);
    var itemList = [];
    var qty;

    itemList = JSON.parse(localStorage.itemsRecord)

    for (var i = 0; i < itemList.length; i++) {
        if (selectElem[selectElem.selectedIndex].value == itemList[i].Description) {
            qty = itemList[i].Quantity;
            break;
        }

    }
    showQty.textContent = "Item Left: " + qty;


}


function repopulateItems(index) {

    for (var i = 0; i < index; i++) {
        var itemHeader = document.createElement('h3');

        var container = document.createElement("div");
        var createBreak = document.createElement('br');
        var addBtn = document.getElementById('addInput');

        var item_date = document.createElement("input");


        var item_desc = document.createElement("select");

        var item_quant = document.createElement("input");


        var removeBtn = document.createElement("button");

        var itemLeft = document.createElement("span");

        var previousItems = "";

        itemHeader.textContent = "Item " + (itemIndex + 1);

        removeBtn.setAttribute('onclick', 'removeInput(' + itemIndex + ')');
        removeBtn.setAttribute('class', 'deleteItem');
        removeBtn.textContent = "Delete Item"

        container.setAttribute('id', 'container_' + itemIndex);
        container.setAttribute('class', 'wrapper_container');

        //The Due Date of the Item
        item_date.setAttribute('type', 'date');
        item_date.setAttribute('id', 'date_return_' + itemIndex);
        item_date.setAttribute('class', 'modal_form');
        item_date.setAttribute('value', RepopItemsArray[i].DueDate);

        //The Description of the Item
        item_desc.setAttribute('type', 'select');
        item_desc.setAttribute('id', 'item_description_' + itemIndex);
        item_desc.setAttribute('class', 'item_choice select-style');
        item_desc.setAttribute('onchange', 'itemQtyLeft(' + itemIndex + ')');
        item_desc.setAttribute('onfocus', 'itemQtyLeft(' + itemIndex + ')');

        //The Item Left for a certain Item
        itemLeft.setAttribute('id', 'item_left_' + itemIndex);

        //The Quantity you would like to get

        item_quant.setAttribute('type', 'text');
        item_quant.setAttribute('id', 'item_quantityBorrow_' + itemIndex);
        item_quant.setAttribute('value', RepopItemsArray[i].itemQuant);

        container.appendChild(itemHeader);


        container.appendChild(item_date);


        container.appendChild(item_desc);

        container.appendChild(itemLeft);


        container.appendChild(item_quant);


        document.getElementById("items").appendChild(container);

        if (i != 0) {
            container.appendChild(removeBtn);
        }

        itemIndex++;

        if (itemIndex == JSON.parse(localStorage.itemsRecord).length) {
            document.getElementById('requestForm').removeChild(addBtn);
        }

        //adding of remove button first item
        if (itemIndex > 1) {
            if (!document.querySelector("button[name=remove_buttonAt0]")) {
                var rmv_btn0 = document.createElement('button');
                rmv_btn0.setAttribute('onclick', 'removeInput(0)');
                rmv_btn0.setAttribute('name', 'remove_buttonAt0');
                rmv_btn0.setAttribute('class', 'deleteItem');
                rmv_btn0.textContent = "Delete Item";
                document.getElementById('container_0').appendChild(rmv_btn0);
            }
        }




        if (itemIndex > 1) {
            var item_choice = document.getElementsByClassName("item_choice")[itemIndex - 2];
            item_choice.setAttribute('disabled', 'disabled');

            for (var c = 0; c < document.getElementsByClassName("item_choice").length - 1; c++) {
                var tempChoice = document.getElementsByClassName("item_choice")[c];

                previousItems += tempChoice[tempChoice.selectedIndex].value + " ";

            }

            console.log(previousItems);

            prepareNewlyAddedItems(previousItems);


        } else {
            prepareItems();

        }

        for (var b = 0; b < document.getElementById('item_description_' + i).childNodes.length; b++) {
            var tempChildren = document.getElementById('item_description_' + i).childNodes;

            if (tempChildren[b].value == RepopItemsArray[i].ItemSelected) {
                document.getElementById('item_description_' + i).childNodes[b].selected = true;
                itemQtyLeft(itemIndex - 1);
            }
        }

    }
    RepopItemsArray = [];

}

function removeInput(index) {
    itemIndex = 0;
    var tempCont = document.getElementById("items");
    var tempContLength = tempCont.children.length - 1;



    for (var c = 0; c < tempCont.children.length; c++) {
        var dueDate = document.getElementById("date_return_" + c).value;
        var itemDescSelected = document.getElementById("item_description_" + c);

        var itemQuant = document.getElementById("item_quantityBorrow_" + c).value;

        if (c == index) {
            continue
        } else {
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
    var school = document.getElementById("school");
    var contact = document.getElementById("contactNumber").value.trim();

    var dateBorrowed = DateToday();
    var tempArray = [];
    var tempItemArray = [];
    var borrowersObj = {};

    tempArray = JSON.parse(localStorage.itemsRecord);


    //Put the info: Name and ID and initialize the Items array
    borrowersObj = {
        'Idnum': id,
        'Name': name,
        'DateBorrowed': dateBorrowed,
        'School': school[school.selectedIndex].value,
        'ContactNum': contact,
        'Items': []
    };

    //Put the Items
    for (c = 0; c < itemIndex; c++) {
        var selectedItem = document.getElementById("item_description_" + c).selectedIndex;

        var quantityBorrow = document.getElementById("item_quantityBorrow_" + c).value.trim();
        var item = document.getElementById("item_description_" + c).childNodes[selectedItem].value;
        var date = document.getElementById("date_return_" + c).value;


        for (var i = 0; i < tempArray.length; i++) {
            if (item === tempArray[i].Description) {
                tempArray[i].Quantity -= quantityBorrow;
                localStorage.itemsRecord = JSON.stringify(tempArray);

                var itemObj = {
                    'ItemName': item,
                    'Quantity': quantityBorrow,
                    'Duedate': date,
                    'QuantityReturned': '0',
                    'ReturnDate': '',
                    'GoodConditionItemsReturned': '',
                    'DefectiveItemsReturned': ''
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

function borrowerExist(idnum) {
    if (localStorage.loanRecord) {
        borrowersArray = JSON.parse(localStorage.loanRecord);

        for (var i = 0; i < borrowersArray.length; i++) {
            if (borrowersArray[i].Idnum == idnum) {
                return i;
                break;
            }
        }
    } else {
        return -1;
    }
}

function returnerExist(idnum) {
    if (localStorage.returnLog) {
        returnersArray = JSON.parse(localStorage.returnLog);

        for (var i = 0; i < returnersArray.length; i++) {
            if (returnersArray[i].Idnum == idnum) {
                return i
                break;
            }
        }
    } else {
        return false;
    }

}

function addBorrowerChecker() {
    var id = document.getElementById("user_id").value.trim();
    var name = document.getElementById("user_name").value.trim();
    var contact = document.getElementById("contactNumber").value.trim();
    var errors = 0;

    var dateBorrowed = DateToday();
    var tempArray = [];

    tempArray = JSON.parse(localStorage.itemsRecord);

    //First check the Id and the name
    if (id === "" || name === "" || contact === "") {
        alert("Complete the information needed");
        errors++;
    } else if (isNaN(id)) {
        alert("ID expecting number format");
        errors++;
    } else if (borrowerExist(id) > -1) {
        alert("Borrower Already Exists");
        errors++;
    } else if (isNaN(contact)) {
        alert("Contact Number expecting number format");
        errors++;
    }
    //If No Errors Continue
    if (errors == 0) {
        for (c = 0; c < itemIndex; c++) {
            var selectedItem = document.getElementById("item_description_" + c).selectedIndex;

            var quantityBorrow = document.getElementById("item_quantityBorrow_" + c).value.trim();
            var item = document.getElementById("item_description_" + c).childNodes[selectedItem].value;
            var date = document.getElementById("date_return_" + c).value;

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
                        if (tempArray[i].Quantity < quantityBorrow || quantityBorrow <= 0) {
                            errors++;
                            alert("The Quantity that you have entered on the item: " + tempArray[i].Description + " which is " + quantityBorrow + " is greater than the current item inventory");
                            c = itemIndex + 1;
                            break;
                        }
                    }
                }

            }

        }

        //If still no errors, add it to the local Storage
        if (errors == 0) {
            addBorrower();
        }
    }
}


function generateTableBorrower(i, id, name, dateBorrowed) {
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
    colAction.innerHTML = '<a href ="viewdetails.html"><button onclick="viewQueue(' + i + ')"> view details </button></a>'

    //Clear the values of the input
    document.getElementById("user_id").value = "";
    document.getElementById("user_name").value = "";

}

function generateTableReturner(i, id, name, dateBorrowed, status) {
    //Query table
    var table = document.querySelector("#mabody");
    //Insert a row into the table
    var tabRow = table.insertRow();

    //Insert into the first and second column of the tabRow var
    var colStudentId = tabRow.insertCell(0);
    var colStudentName = tabRow.insertCell(1);
    var colDateBorrow = tabRow.insertCell(2);
    var colStatus = tabRow.insertCell(3);
    var colAction = tabRow.insertCell(4);

    //put some values
    colStudentId.textContent = id;
    colStudentName.textContent = name;
    colDateBorrow.textContent = dateBorrowed;
    colStatus.textContent = status;
    colAction.innerHTML = '<a href ="viewdetails.html"><button onclick="viewQueueReturner(' + i + ')"> view details </button></a>'

}

function viewQueue(i) {
    var myArray = [];
    myArray.push(i);

    localStorage.viewQueue = JSON.stringify(myArray);

}

function viewQueueReturner(i) {
    var myArray = [];
    myArray.push(i);

    localStorage.viewQueueReturner = JSON.stringify(myArray);
}

function viewDetails() {
    if (localStorage.viewQueue) {
        var checkerBorrowerQueue = [];
        checkerBorrowerQueue = JSON.parse(localStorage.viewQueue);
    }

    if (localStorage.viewQueueReturner) {
        var checkerReturnerQueue = [];
        checkerReturnerQueue = JSON.parse(localStorage.viewQueueReturner);
    }

    if (checkerBorrowerQueue[0] != undefined) {
        var viewQueueArray = [];
        var index;

        //store the index of who pressed the viewDetails
        viewQueueArray = JSON.parse(localStorage.viewQueue);
        index = viewQueueArray[0];

        if (index != undefined) {

            //Now Remove it in order for the others to access their details
            viewQueueArray.splice(0, 1);
            localStorage.viewQueue = JSON.stringify(viewQueueArray);


            //Show Them all!
            document.getElementById("idnumLabel").style.display = "";
            document.getElementById("idnum").style.display = "";

            document.getElementById("nameLabel").style.display = "";
            document.getElementById("name").style.display = "";

            document.getElementById("schoolLabel").style.display = "";
            document.getElementById("school").style.display = "";

            document.getElementById("contactnumLabel").style.display = "";
            document.getElementById("contactnum").style.display = "";

            document.getElementById("itemDet").style.display = "";

            document.getElementById("duedateLabel").style.display = "";
            document.getElementById("duedate").style.display = "";

            document.getElementById("return_button").style.display = "";
            document.getElementById("add_items").style.display = "";

            //Get Elements and the local storage
            var retbtn = document.getElementById("return_button");
            var borrowersArray = JSON.parse(localStorage.loanRecord);

            document.getElementById("idnum").textContent = borrowersArray[index].Idnum;
            document.getElementById("name").textContent = borrowersArray[index].Name;
            document.getElementById("duedate").textContent = borrowersArray[index].DateBorrowed;
            document.getElementById("school").textContent = borrowersArray[index].School;
            document.getElementById("contactnum").textContent = borrowersArray[index].ContactNum;

            var outerContainer = document.querySelector(".itemdetails");
            var temp = borrowersArray[index].Items;

            for (var c = 0; c < temp.length; c++) {
                var pItemContainer = document.createElement("div")
                var pItem = document.createElement("span");
                var pItemLabel = document.createElement("span");

                var pQuantContainer = document.createElement("div");
                var pQuant = document.createElement("span");
                var pQuantLabel = document.createElement("span");

                var pReturnContainer = document.createElement("div");
                var pReturn = document.createElement("span");
                var pReturnLabel = document.createElement("span");

                var pAction = document.createElement("p");
                var pActionLabel = document.createElement("p");


                pItem.setAttribute("id", "desc" + c);
                pQuant.setAttribute("id", "quant" + c);
                pReturn.setAttribute("id", "rdate" + c);
                pAction.setAttribute("id", "action" + c);

                pItemLabel.style.fontWeight = "bold";
                pQuantLabel.style.fontWeight = "bold";
                pReturnLabel.style.fontWeight = "bold";
                pActionLabel.style.fontWeight = "bold";

                pItemLabel.textContent = "Item Name: ";
                pItem.innerHTML = borrowersArray[index].Items[c].ItemName;

                pQuantLabel.textContent = "Quantity Borrowed: ";
                pQuant.innerHTML = borrowersArray[index].Items[c].Quantity;


                pReturnLabel.textContent = "Item Due Date: ";
                pReturn.innerHTML = borrowersArray[index].Items[c].Duedate;

                pActionLabel.textContent = "Partialy Return Items: ";
                pAction.innerHTML = 'Return Items that are in Good Condition: <input type = "text" id = "rGoodCondition' + c + '"><br>Return Items that are Defective: <input type = "text" id = "rDefective' + c + '"><br><input type = "button" value = "Return" onclick = "returnItem(' + c + ')"><br>';

                pItemContainer.appendChild(pItemLabel);
                pItemContainer.appendChild(pItem);
                outerContainer.appendChild(pItemContainer);

                pQuantContainer.appendChild(pQuantLabel);
                pQuantContainer.appendChild(pQuant);
                outerContainer.appendChild(pQuantContainer);

                pReturnContainer.appendChild(pReturnLabel);
                pReturnContainer.appendChild(pReturn);
                outerContainer.appendChild(pReturnContainer);

                outerContainer.appendChild(pActionLabel);
                outerContainer.appendChild(pAction);

            }
        }
    } else if (checkerReturnerQueue[0] != undefined) {
        var viewQueueReturnerArray = [];
        var index;

        //store the index of who pressed the viewDetails
        viewQueueReturnerArray = JSON.parse(localStorage.viewQueueReturner);
        index = viewQueueReturnerArray[0];

        if (index != undefined) {

            //Now Remove it in order for the others to access their details
            viewQueueReturnerArray.splice(0, 1);
            localStorage.viewQueueReturner = JSON.stringify(viewQueueReturnerArray);


            //Show Them all!
            document.getElementById("idnumLabel").style.display = "";
            document.getElementById("idnum").style.display = "";

            document.getElementById("nameLabel").style.display = "";
            document.getElementById("name").style.display = "";

            document.getElementById("schoolLabel").style.display = "";
            document.getElementById("school").style.display = "";

            document.getElementById("contactnumLabel").style.display = "";
            document.getElementById("contactnum").style.display = "";

            document.getElementById("itemDet").style.display = "";


            document.getElementById("duedateLabel").style.display = "";
            document.getElementById("duedate").style.display = "";

            //Get Elements and the local storage
            var retbtn = document.getElementById("return_button");
            var returnersArray = JSON.parse(localStorage.returnLog);

            document.getElementById("idnum").textContent = returnersArray[index].Idnum;
            document.getElementById("name").textContent = returnersArray[index].Name;
            document.getElementById("duedate").textContent = returnersArray[index].DateBorrowed;
            document.getElementById("school").textContent = returnersArray[index].School;
            document.getElementById("contactnum").textContent = returnersArray[index].ContactNum;

            var outerContainer = document.querySelector(".itemdetails");
            var temp = returnersArray[index].Items;

            for (var c = 0; c < temp.length; c++) {
                var innerContainer = document.createElement("div");

                var pItemContainer = document.createElement("div");
                var pItemLabel = document.createElement("span");
                var pItem = document.createElement("span");

                var pQuantContainer = document.createElement("div");
                var pQuantLabel = document.createElement("span");
                var pQuant = document.createElement("span");

                var pReturnContainer = document.createElement("div");
                var pReturnLabel = document.createElement("span");
                var pReturn = document.createElement("span");

                var pDefectiveContainer = document.createElement("div");
                var pDefectiveLabel = document.createElement("span");
                var pDefective = document.createElement("span");


                var pGoodConditionContainer = document.createElement("div");
                var pGoodConditionLabel = document.createElement("span");
                var pGoodCondition = document.createElement("span");

                var pTotalContainer = document.createElement("div");
                var pTotalLabel = document.createElement("span");
                var pTotal = document.createElement("span");


                var pConvertLabel = document.createElement("label");
                var pConvert = document.createElement("input");
                var pConvertButton = document.createElement("button");


                pItemLabel.style.fontWeight = "bold";
                pQuantLabel.style.fontWeight = "bold";
                pReturnLabel.style.fontWeight = "bold";
                pDefectiveLabel.style.fontWeight = "bold";
                pGoodConditionLabel.style.fontWeight = "bold";
                pTotalLabel.style.fontWeight = "bold";
                pConvertLabel.style.fontWeight = "bold";


                pItem.setAttribute("id", "desc" + c);
                pQuant.setAttribute("id", "quant" + c);
                pReturn.setAttribute("id", "rdate" + c);
                pDefective.setAttribute("id", "DefectiveQuant" + c);
                pGoodCondition.setAttribute("id", "GoodConditionQuant" + c);
                pTotal.setAttribute("id", "total" + c);
                pConvert.setAttribute("id", "NumDefective" + c);
                pConvertLabel.setAttribute("for", "NumDefective" + c);
                pConvertButton.setAttribute("onClick", 'restoreDefectiveItems(' + index + ',' + c + ')');

                pItemLabel.textContent = "Item Name: ";
                pItem.textContent = returnersArray[index].Items[c].ItemName;

                pQuantLabel.textContent = "Quantity Borrowed Left: ";
                pQuant.textContent = returnersArray[index].Items[c].Quantity;

                pConvertLabel.textContent = "Number of Defective Items Restored/Repaired: ";
                pConvertButton.textContent = "Enter";


                if (statusChecker(index) === " All are in Good Condition " || returnersArray[index].Items[c].DefectiveItemsReturned === "") {
                    var totalItemsRet = parseInt(returnersArray[index].Items[c].GoodConditionItemsReturned);
                } else if (returnersArray[index].Items[c].GoodConditionItemsReturned === "") {
                    var totalItemsRet = parseInt(returnersArray[index].Items[c].DefectiveItemsReturned);
                } else {
                    var totalItemsRet = parseInt(returnersArray[index].Items[c].GoodConditionItemsReturned) + parseInt(returnersArray[index].Items[c].DefectiveItemsReturned);
                }

                pTotalLabel.textContent = "Total Items Returned: ";
                pTotal.textContent = totalItemsRet;

                pGoodConditionLabel.textContent = "Good Condition Items Returned: ";
                pGoodCondition.textContent = returnersArray[index].Items[c].GoodConditionItemsReturned;

                pDefectiveLabel.textContent = "Defective Items Returned: ";
                pDefective.textContent = returnersArray[index].Items[c].DefectiveItemsReturned;

                pReturnLabel.textContent = "Returned At: ";
                pReturn.textContent = returnersArray[index].Items[c].ReturnDate;

                pItemContainer.appendChild(pItemLabel);
                pItemContainer.appendChild(pItem);

                pQuantContainer.appendChild(pQuantLabel);
                pQuantContainer.appendChild(pQuant);

                innerContainer.appendChild(pItemContainer);
                innerContainer.appendChild(pQuantContainer);
                outerContainer.appendChild(innerContainer);

                if (returnersArray[index].Items[c].DefectiveItemsReturned === "") {
                    pTotalContainer.appendChild(pTotalLabel);
                    pTotalContainer.appendChild(pTotal);
                    innerContainer.appendChild(pTotalContainer);
                } else {
                    pGoodConditionContainer.appendChild(pGoodConditionLabel);
                    pGoodConditionContainer.appendChild(pGoodCondition);

                    pDefectiveContainer.appendChild(pDefectiveLabel);
                    pDefectiveContainer.appendChild(pDefective);

                    pTotalContainer.appendChild(pTotalLabel);
                    pTotalContainer.appendChild(pTotal);
                    pTotalContainer.appendChild(pTotal);

                    innerContainer.appendChild(pGoodConditionContainer);
                    innerContainer.appendChild(pDefectiveContainer);
                    innerContainer.appendChild(pTotalContainer);

                    innerContainer.appendChild(pConvertLabel);
                    innerContainer.appendChild(pConvert);
                    innerContainer.appendChild(pConvertButton);
                }
                if (returnersArray[index].Items[c].GoodConditionItemsReturned === "") {
                    innerContainer.removeChild(pGoodConditionContainer);
                }

                pReturnContainer.appendChild(pReturnLabel);
                pReturnContainer.appendChild(pReturn);
                innerContainer.appendChild(pReturnContainer);

            }

        }
    }
}

function restoreDefectiveItems(returnerIndex, index) {
    returnersArray = JSON.parse(localStorage.returnLog);
    var returnersItemsArray = returnersArray[returnerIndex].Items;

    var quantityRestored = document.getElementById("NumDefective" + index).value.trim();
    if (quantityRestored == "") {
        alert("Please Don't Leave the Number of Defective Items Restored/Repaired input blank!");
    } else if (isNaN(quantityRestored)) {
        alert("Please Enter a Number");
    } else if (parseInt(returnersItemsArray[index].DefectiveItemsReturned) < parseInt(quantityRestored)) {
        alert("The Quantity you have Entered is Greater than the Quantity of the Defective Item!");
    } else if (quantityRestored == 0) {
        alert("Invalid Input, The Quantity you have entered should be greater than 0");
    } else {
        returnersItemsArray[index].DefectiveItemsReturned = parseInt(returnersItemsArray[index].DefectiveItemsReturned) - parseInt(quantityRestored);
        if (returnersItemsArray[index].GoodConditionItemsReturned == "") {
            returnersItemsArray[index].GoodConditionItemsReturned = parseInt(quantityRestored);
        } else {
            returnersItemsArray[index].GoodConditionItemsReturned = parseInt(returnersItemsArray[index].GoodConditionItemsReturned) + parseInt(quantityRestored);
        }
        returnersItemsArray[index].ReturnDate = DateToday();

        itemsArray = JSON.parse(localStorage.itemsRecord);
        var itemIndex = itemExist(returnersItemsArray[index].ItemName);

        itemsArray[itemIndex].Quantity = parseInt(itemsArray[itemIndex].Quantity) + parseInt(quantityRestored);
        localStorage.itemsRecord = JSON.stringify(itemsArray);
        alert('Successfully Restored/Repaired ' + quantityRestored + ' ' + itemsArray[itemIndex].Description);

        if (parseInt(returnersItemsArray[index].DefectiveItemsReturned) == 0) {
            returnersItemsArray[index].DefectiveItemsReturned = "";
        }

        returnersArray[returnerIndex].Items = returnersItemsArray;
        localStorage.returnLog = JSON.stringify(returnersArray);
        viewQueueReturner(returnerIndex);
        window.location.href = "viewdetails.html";
    }
}


function prepareItems() {
    var items = JSON.parse(localStorage.itemsRecord);
    var itemChoice = document.getElementsByClassName("item_choice");
    var add_btn = document.createElement('button');

    add_btn.setAttribute('id', 'addInput');
    add_btn.setAttribute('onclick', 'addInput()');
    add_btn.textContent = "New Item";

    if (!document.getElementById("addInput")) {
        if (JSON.parse(localStorage.itemsRecord).length > itemIndex) {
            document.getElementById("requestForm").appendChild(add_btn);
        }
    }


    var tempItem = itemChoice[itemIndex - 1];

    for (var i = 0; i < items.length; i++) {
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
            if (tdId.innerHTML.toUpperCase().indexOf(filter) > -1 || tdName.innerHTML.toUpperCase().indexOf(filter) > -1 || tdDate.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function returnAll() {
    var borrowersArray = [];
    var itemsArray = [];
    var retDate = DateToday();

    borrowersArray = JSON.parse(localStorage.loanRecord);
    itemsArray = JSON.parse(localStorage.itemsRecord);

    if (localStorage.returnLog) {
        returnersArray = JSON.parse(localStorage.returnLog);
    }


    for (var c = 0; c < borrowersArray.length; c++) {
        if (borrowersArray[c].Idnum == document.getElementById('idnum').textContent) {

            for (var i = 0; i < borrowersArray.length; i++) {
                if (borrowersArray[c].Items[i] != 0) {

                    for (var x = 0; x < itemsArray.length; x++) {
                        if (itemsArray[x].Description == borrowersArray[c].Items[i].ItemName) {
                            itemsArray[x].Quantity += parseInt(borrowersArray[c].Items[i].Quantity);

                            borrowersArray[c].Items[i].ReturnDate = retDate;

                            //Check if their is already an existing item returned
                            if (borrowersArray[c].Items[i].GoodConditionItemsReturned === "" || borrowersArray[c].Items[i].GoodConditionItemsReturned === null) {
                                borrowersArray[c].Items[i].GoodConditionItemsReturned = borrowersArray[c].Items[i].Quantity;
                            } else {
                                borrowersArray[c].Items[i].GoodConditionItemsReturned = parseInt(borrowersArray[c].Items[i].GoodConditionItemsReturned) + parseInt(borrowersArray[c].Items[i].Quantity);
                            }

                            if (borrowersArray[c].Items[i].QuantityReturned === "" || borrowersArray[c].Items[i].QuantityReturned === null) {
                                borrowersArray[c].Items[i].QuantityReturned = borrowersArray[c].Items[i].Quantity;
                            } else {
                                borrowersArray[c].Items[i].QuantityReturned = parseInt(borrowersArray[c].Items[i].QuantityReturned) + parseInt(borrowersArray[c].Items[i].Quantity);
                            }

                            borrowersArray[c].Items[i].Quantity = 0;
                            i++;
                            x = -1;

                            if (borrowersArray[c].Items.length == (i)) {
                                if (isNaN(returnerExist(document.getElementById('idnum').textContent))) {
                                    returnArray.push(borrowersArray[c]);
                                } else {

                                    var returnerLocation = returnerExist(document.getElementById('idnum').textContent);
                                    returnersArray[returnerLocation] = borrowersArray[c];
                                }

                                borrowersArray.splice(c, 1);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    alert("Successfully return all the Items borrowed!");
    localStorage.returnLog = JSON.stringify(returnersArray);
    localStorage.loanRecord = JSON.stringify(borrowersArray);
    localStorage.itemsRecord = JSON.stringify(itemsArray);
    window.location.href = "loan.html";

}

function returnItem(index) {
    var borrowersArray = [];
    var itemsArray = [];
    var id_num = document.getElementById('idnum').textContent;
    var valueGoodCondition = document.getElementById('rGoodCondition' + index).value;
    var valueDefective = document.getElementById('rDefective' + index).value;
    var item = document.getElementById('desc' + index).textContent;
    var trueTest = false;

    var i = borrowerExist(id_num);
    var c = borrowerItemExist(i, item);

    itemsArray = JSON.parse(localStorage.itemsRecord);
    borrowersArray = JSON.parse(localStorage.loanRecord);

    if (localStorage.returnLog) {
        returnersArray = JSON.parse(localStorage.loanRecord);
    }



    if (valueGoodCondition != "" || valueDefective != "") {

        if (valueDefective == "") {

            if (!isNaN(valueGoodCondition)) {

                if (valueGoodCondition <= 0 || parseInt(borrowersArray[i].Items[c].Quantity) < valueGoodCondition) {

                    alert('The quantity of the Good Condition item/s:"' + item + '" you have entered is greater than or less than what you have borrowed');
                } else {
                    //Subtract the Quantity Borrowed to the Quantity Returned
                    borrowersArray[i].Items[c].Quantity -= parseInt(valueGoodCondition);

                    //Check if the GoodConditionItemsReturned is empty
                    if (borrowersArray[i].Items[c].GoodConditionItemsReturned = "") {

                        borrowersArray[i].Items[c].GoodConditionItemsReturned = parseInt(valueGoodCondition);
                    } else {
                        borrowersArray[i].Items[c].GoodConditionItemsReturned += parseInt(valueGoodCondition);
                    }

                    //Store the Quantity Returned by the User
                    borrowersArray[i].Items[c].QuantityReturned = parseInt(borrowersArray[i].Items[c].QuantityReturned) + parseInt(valueGoodCondition);
                    borrowersArray[i].Items[c].ReturnDate = DateToday();

                    /**==================== Store The Borrower as a Returner =========================**/
                    var returnerObject = {
                        'Idnum': borrowersArray[i].Idnum,
                        'Name': borrowersArray[i].Name,
                        'DateBorrowed': borrowersArray[i].DateBorrowed,
                        'School': borrowersArray[i].School,
                        'ContactNum': borrowersArray[i].ContactNum,
                        'Items': []
                    };

                    returnerObject.Items.push(borrowersArray[i].Items[c]);


                    if (localStorage.returnLog) {
                        if (!isNaN(returnerExist(borrowersArray[i].Idnum))) {
                            var returnerIndex = returnerExist(borrowersArray[i].Idnum);

                            if (isNaN(returnerItemExist(i, item))) {
                                returnersArray[returnerIndex].Items.push(borrowersArray[i].Items[c]);
                            } else {
                                var returnerItemIndex = returnerItemExist(i, item);
                                returnersArray[returnerIndex].Items[returnerItemIndex] = borrowersArray[i].Items[c];
                            }

                        } else {
                            returnersArray.push(returnerObject);

                        }
                    } else {
                        returnersArray.push(returnerObject);

                    }
                    localStorage.returnLog = JSON.stringify(returnersArray);
                    /**========================== Up until Here ========================================**/

                    //If the returner has returned all items remove him from the loanrecord Storage
                    if (borrowersArray[i].Items[c].Quantity == 0) {

                        borrowersArray[i].Items.splice(c, 1);

                        if (!borrowersArray[i].Items[0]) {
                            trueTest = true;
                            borrowersArray.splice(i, 1);
                        }
                    }


                    //Change the value of the original Items
                    var x = itemExist(item);
                    itemsArray[x].Quantity += parseInt(valueGoodCondition);
                    alert("Successfully returned the partial Quantity Items borrowed!");


                }

            } else {
                alert('The quantity of the Good Condition item:"' + item + '" you have entered is not a number!');
            }
        } else if (valueGoodCondition == "") {

            if (!isNaN(valueDefective)) {

                if (valueDefective <= 0 || parseInt(borrowersArray[i].Items[c].Quantity) < valueDefective) {

                    alert('The quantity of the Defective item/s:"' + item + '" you have entered is greater than or less than what you have borrowed');
                } else {
                    //Subtract the Quantity Borrowed to the Quantity Returned
                    borrowersArray[i].Items[c].Quantity -= parseInt(valueDefective);

                    //Check if the GoodConditionItemsReturned is empty
                    if (borrowersArray[i].Items[c].DefectiveItemsReturned = "") {

                        borrowersArray[i].Items[c].DefectiveItemsReturned = parseInt(valueDefective);
                    } else {
                        borrowersArray[i].Items[c].DefectiveItemsReturned += parseInt(valueDefective);
                    }

                    //Store the Quantity Returned by the User
                    borrowersArray[i].Items[c].QuantityReturned = parseInt(borrowersArray[i].Items[c].QuantityReturned) + parseInt(valueDefective);
                    borrowersArray[i].Items[c].ReturnDate = DateToday();

                    /**==================== Store The Borrower as a Returner =========================**/
                    var returnerObject = {
                        'Idnum': borrowersArray[i].Idnum,
                        'Name': borrowersArray[i].Name,
                        'DateBorrowed': borrowersArray[i].DateBorrowed,
                        'School': borrowersArray[i].School,
                        'ContactNum': borrowersArray[i].ContactNum,
                        'Items': []
                    };

                    returnerObject.Items.push(borrowersArray[i].Items[c]);


                    if (localStorage.returnLog) {
                        if (!isNaN(returnerExist(borrowersArray[i].Idnum))) {
                            var returnerIndex = returnerExist(borrowersArray[i].Idnum);

                            if (isNaN(returnerItemExist(i, item))) {
                                returnersArray[returnerIndex].Items.push(borrowersArray[i].Items[c]);
                            } else {
                                var returnerItemIndex = returnerItemExist(i, item);
                                returnersArray[returnerIndex].Items[returnerItemIndex] = borrowersArray[i].Items[c];
                            }

                        } else {
                            returnersArray.push(returnerObject);

                        }
                    } else {
                        returnersArray.push(returnerObject);

                    }
                    localStorage.returnLog = JSON.stringify(returnersArray);
                    /**========================== Up until Here ========================================**/

                    //If the returner has returned all items remove him from the loanrecord Storage
                    if (borrowersArray[i].Items[c].Quantity == 0) {

                        borrowersArray[i].Items.splice(c, 1);

                        if (!borrowersArray[i].Items[0]) {
                            trueTest = true;
                            borrowersArray.splice(i, 1);
                        }
                    }


                    alert('Successfully returned ' + valueDefective + ' ' + item + ' borrowed!');


                }

            } else {
                alert('The quantity of the Defective item/s:"' + item + '" you have entered is not a number!');
            }

        } else {


            if (!isNaN(valueDefective) && !isNaN(valueGoodCondition)) {
                var total = parseInt(valueDefective) + parseInt(valueGoodCondition);
                if (total <= 0 || parseInt(borrowersArray[i].Items[c].Quantity) < total) {

                    alert('The quantity of the Defective or Good Condition item/s:"' + item + '" you have entered is greater than or less than what you have borrowed');
                } else {
                    //Subtract the Quantity Borrowed to the Quantity Returned
                    borrowersArray[i].Items[c].Quantity -= parseInt(total);

                    //Check if the DefectiveItemsReturned is empty
                    if (borrowersArray[i].Items[c].DefectiveItemsReturned = "") {

                        borrowersArray[i].Items[c].DefectiveItemsReturned = parseInt(valueDefective);
                    } else {
                        borrowersArray[i].Items[c].DefectiveItemsReturned += parseInt(valueDefective);
                    }

                    //Check if the GoodConditionItemsReturned is empty
                    if (borrowersArray[i].Items[c].GoodConditionItemsReturned = "") {

                        borrowersArray[i].Items[c].GoodConditionItemsReturned = parseInt(valueGoodCondition);
                    } else {
                        borrowersArray[i].Items[c].GoodConditionItemsReturned += parseInt(valueGoodCondition);
                    }

                    //Store the Quantity Returned by the User
                    borrowersArray[i].Items[c].QuantityReturned = parseInt(borrowersArray[i].Items[c].QuantityReturned) + parseInt(total);
                    borrowersArray[i].Items[c].ReturnDate = DateToday();

                    /**==================== Store The Borrower as a Returner =========================**/
                    var returnerObject = {
                        'Idnum': borrowersArray[i].Idnum,
                        'Name': borrowersArray[i].Name,
                        'DateBorrowed': borrowersArray[i].DateBorrowed,
                        'School': borrowersArray[i].School,
                        'ContactNum': borrowersArray[i].ContactNum,
                        'Items': []
                    };

                    returnerObject.Items.push(borrowersArray[i].Items[c]);


                    if (localStorage.returnLog) {
                        if (!isNaN(returnerExist(borrowersArray[i].Idnum))) {
                            var returnerIndex = returnerExist(borrowersArray[i].Idnum);

                            if (isNaN(returnerItemExist(i, item))) {
                                returnersArray[returnerIndex].Items.push(borrowersArray[i].Items[c]);
                            } else {
                                var returnerItemIndex = returnerItemExist(i, item);
                                returnersArray[returnerIndex].Items[returnerItemIndex] = borrowersArray[i].Items[c];
                            }

                        } else {
                            returnersArray.push(returnerObject);

                        }
                    } else {
                        returnersArray.push(returnerObject);

                    }
                    localStorage.returnLog = JSON.stringify(returnersArray);
                    /**========================== Up until Here ========================================**/

                    //If the returner has returned all items remove him from the loanrecord Storage
                    if (borrowersArray[i].Items[c].Quantity == 0) {

                        borrowersArray[i].Items.splice(c, 1);

                        if (!borrowersArray[i].Items[0]) {
                            trueTest = true;
                            borrowersArray.splice(i, 1);
                        }
                    }

                    //Change the value of the original Items
                    var x = itemExist(item);
                    itemsArray[x].Quantity += parseInt(valueGoodCondition);
                    alert('Successfully returned ' + total + ' ' + item + ' borrowed!(' + valueGoodCondition + ' Good Condition Items ' + valueDefective + ' Defective Items)');


                }

            } else {
                alert('The either the quantity of the Defective or Good Condition item/s:"' + item + '" you have entered is not a number!');
            }

        }

        localStorage.loanRecord = JSON.stringify(borrowersArray);
        localStorage.itemsRecord = JSON.stringify(itemsArray);
        viewQueue(i);
        if (trueTest) {
            window.location.href = "loan.html"
        } else {
            window.location.href = "viewdetails.html";
        }
    } else {
        alert("Please Enter a value on either the Return Good Condition Items or the Return Defective Items input");
    }
}

function itemExist(itemName) {
    itemsArray = JSON.parse(localStorage.itemsRecord);

    for (var i = 0; i < itemsArray.length; i++) {
        if (itemName == itemsArray[i].Description) {
            return i;
            break;
        }
    }
}

function borrowerItemExist(borrowerIndex, itemName) {
    borrowersArray = JSON.parse(localStorage.loanRecord);

    for (var i = 0; i < borrowersArray[borrowerIndex].Items.length; i++) {
        if (itemName == borrowersArray[borrowerIndex].Items[i].ItemName) {
            return i;
            break;
        }

    }
}

function returnerItemExist(returnerIndex, itemName) {
    returnersArray = JSON.parse(localStorage.returnLog);

    for (var i = 0; i < returnersArray[returnerIndex].Items.length; i++) {
        if (itemName == returnersArray[returnerIndex].Items[i].ItemName) {
            return i;
            break;
        }

    }
}

function addNewItems() {
    document.getElementById('requestForm').style.display = "";
    prepareItems();
}




function addNewItemsToBorrowerChecker() {
    var errors = 0;


    var dateBorrowed = DateToday();
    var tempArray = [];

    tempArray = JSON.parse(localStorage.itemsRecord);

    for (c = 0; c < itemIndex; c++) {
        var selectedItem = document.getElementById("item_description_" + c).selectedIndex;

        var quantityBorrow = document.getElementById("item_quantityBorrow_" + c).value.trim();
        var item = document.getElementById("item_description_" + c).childNodes[selectedItem].value;
        var date = document.getElementById("date_return_" + c).value;

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
                    if (tempArray[i].Quantity < quantityBorrow || quantityBorrow <= 0) {
                        errors++;
                        alert("The Quantity that you have entered on the item: " + tempArray[i].Description + " which is " + quantityBorrow + " is greater than the current item inventory");
                        c = itemIndex + 1;
                        break;
                    }
                }
            }

        }

    }

    //If still no errors, add it to the local Storage
    if (errors == 0) {
        addNewItemsToBorrower();
    }

}

/** ADDING BORROWERS **/
function addNewItemsToBorrower() {
    var id = document.getElementById("idnum").textContent;

    var index = borrowerExist(id);

    var dateBorrowed = DateToday();
    var tempArray = [];
    var borrowersItemArray = [];


    tempArray = JSON.parse(localStorage.itemsRecord);
    borrowersArray = JSON.parse(localStorage.loanRecord);
    borrowersItemArray = borrowersArray[index].Items;



    //Put the Items
    for (c = 0; c < itemIndex; c++) {
        var selectedItem = document.getElementById("item_description_" + c).selectedIndex;

        var quantityBorrow = document.getElementById("item_quantityBorrow_" + c).value.trim();
        var item = document.getElementById("item_description_" + c).childNodes[selectedItem].value;
        var date = document.getElementById("date_return_" + c).value;



        for (var i = 0; i < tempArray.length; i++) {
            if (item === tempArray[i].Description) {
                tempArray[i].Quantity -= quantityBorrow;
                localStorage.itemsRecord = JSON.stringify(tempArray);

                if (borrowerItemExist(index, item) > -1) {
                    var z = borrowerItemExist(index, item);
                    borrowersItemArray[z].Quantity = parseInt(borrowersItemArray[z].Quantity) + parseInt(quantityBorrow);
                    borrowersItemArray[z].Duedate = date;
                } else {
                    var itemObj = {
                        'ItemName': item,
                        'Quantity': quantityBorrow,
                        'Duedate': date,
                        'QuantityReturned': '0',
                        'ReturnDate': '',
                        'GoodConditionItemsReturned': '',
                        'DefectiveItemsReturned': ''
                    };
                    borrowersItemArray.push(itemObj);
                }


                break;
            }
        }

    }
    borrowersArray[index].Items = borrowersItemArray;
    localStorage.loanRecord = JSON.stringify(borrowersArray);
    alert("New Items Successfully Added");
    viewQueue(index);
    window.location.href = "viewdetails.html";
    itemIndex = 1;
}

function saveToServer() {
    try {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "json-handler-items.json", false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(localStorage.getItem("itemsRecord"));

        xmlhttp.open("POST", "json-handler-loan.json", false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(localStorage.getItem("loanRecord"));

        xmlhttp.open("POST", "json-handler-return.json", false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(localStorage.getItem("returnLog"));
        alert('Successfully added the files into the server');
    } catch (error) {
        alert("You don't have network connection can't save data to the server.");
    }

}

function downloadData() {
    var xhr = new XMLHttpRequest();
    try {
        xhr.open("GET", "http://localHost/WebTek/json-handler-items.json", false);
        xhr.open("GET", "http://localHost/WebTek/json-handler-loan.json", false);
        xhr.open("GET", "http://localHost/WebTek/json-handler-return.json", false);
        xhr.send(null);
        if (xhr.status == 200) {
            // w8  
        }

    } catch (error) {
        alert('No Network connection.');
    }
}