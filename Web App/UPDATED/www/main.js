var itemsArray = [];
var borrowersArray = [];


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
        borrowersArray = JSON.parse(localStorage.loanRecord);
        for (var i = 0; i < borrowersArray.length; i++) {
            generateTableBorrower(borrowersArray[i].Idnum, borrowersArray[i].Name, borrowersArray[i].Item,
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

/** ADDING BORROWERS **/
function addBorrower() {
    var id = document.getElementById("user_id").value.trim();
    var name = document.getElementById("user_name").value.trim();
    var quantityBorrow = document.getElementById("input_quantityBorrow").value.trim();
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
                    generateTableBorrower(id, name, item, quantityBorrow, date, dateBorrowed);
                    break;
                }
            }
        }
    }
}

function generateTableBorrower(id, name, item, quantityBorrow, date, dateBorrowed) {
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

function prepareItems() {
    var items = JSON.parse(localStorage.itemsRecord);
    var itemChoice = document.querySelector("select[name=item_choice]");

    for (var i = 0; i < items.length; i++) {
        var optionEl = document.createElement("option");
        optionEl.setAttribute("value", items[i].Description);
        itemChoice.appendChild(optionEl);
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