console.log("link Script läuft");
const apiUrl = "http://localhost:3000/";
// const apiUrl = "http://apigateway.awslambda.amazonaws.com/";

//const container = document.getElementById('link-container');
const tbody = document.getElementById('link-tbody');
let list;

function getLinks() {
    tbody.innerHTML = '';
    let source = document.getElementById('link-item-template').innerHTML;
    let template = Handlebars.compile(source);
    fetch(apiUrl + "links")
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            let links = data.links;
            links.forEach((link, index) => {
                link.index = index + 1;
                const html = template(link);
                tbody.innerHTML += html;
            });
        });
}

function sendLink() {
    // Value vom input auslesen und an die Api via POST senden
    const input = document.getElementById('link-item');
    if (input.value) {
        console.log(input.value);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "link": input.value })
        }
        fetch(apiUrl + "link", options)
            .then(response => {
                console.log("Response: ", response);
                getLinks();
            })
    } else {
        alert("link Item darf nicht leer sein!");
    }

}

function deleteLink(id) {
    console.log("Delete Link ", id);
    const options = {
        method: "DELETE"
    }
    fetch(apiUrl + 'link/' + id, options)
        .then(response => {
            getLinks();
            console.log("DELETE Response", response);
        })
}

function updateLinkItem(link, id) {
    console.log("Update Todo ", id);
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "link": link })
    }
    fetch(apiUrl + 'link/' + id, options)
        .then(response => {
            console.log("PATCH Response", response);
            getTodos();
        })
}


function editLink(id) {
    fetch(apiUrl + 'link/' + id)
        .then(response => response.json())
        .then(item => {
            console.log("ITEM", item.link[0])
            let itemData = item.link[0];
            const myModal = new bootstrap.Modal('#myModal', {});
            const iteminput = document.getElementById('item');
            const closebutton = document.getElementById('dialog-close');
            const savebutton = document.getElementById('dialog-save');
            closebutton.onclick = () => myModal.hide();
            savebutton.onclick = () => {
                myModal.hide();
                updateLinkItem(iteminput.value, id);
            }
            iteminput.value = itemData.link;
            myModal.show();
        });
}


getLinks();


