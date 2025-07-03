
import { alerrcorret, alerterror, empty } from "./alerts"
const urlApi = "http://localhost:3000/coders"
const $name = document.getElementById("name")
const $age = document.getElementById("age")
const $email = document.getElementById("email")
const $password = document.getElementById("password")
const $clan = document.getElementById("clan")
const $form = document.getElementById("form")


$form.addEventListener("submit", function (event) {  //para capturar al evento de submit
    if ($name.value === "" || $age.value === "" || $clan.value == "" || $email.value == "" || $password == "") {
        empty()
    } else {
        event.preventDefault()
        createCoder()
        addRowToTable()
        
    }

})



function resetForm() {
    $name.value = ""
    $age.value = ""
    $clan.value = ""
    $email.value = ""
    $password.value = ""
}
async function createCoder() {
    const newCoder = {
        name: $name.value,
        age: $age.value,
        email: $email.value,
        password: $password.value,
        clan: $clan.value,
    }
    try {
        let response = await fetch(urlApi, {
            method: "POST",
            header: {
                "Cotent-type": "application/json"
            },
            body: JSON.stringify(newCoder)
        })

        if (!response.ok) {
            throw new Error
        }
        alerrcorret()
    } catch (error) {
        alerterror()
        console.log("aqui esta el error en el sistema")
    }
    resetForm()
}

function addRowToTable(product) {
    let nuevaFila = $productTableBody.insertRow();

    let cellId = nuevaFila.insertCell(0);
    let cellNombre = nuevaFila.insertCell(1);
    let cellPrecio = nuevaFila.insertCell(2);
    let cellAccion = nuevaFila.insertCell(3);

    cellId.innerHTML = product.id;
    cellNombre.innerHTML = product.name;
    cellPrecio.innerHTML = product.precio;

    let btnEliminar = document.createElement("button");
    btnEliminar.innerText = "Eliminar";
    btnEliminar.id = "btn-delete";
    btnEliminar.onclick = function () {
        deleteProduct(nuevaFila, product.id);
    };

    let btnUpdate = document.createElement("button");
    btnUpdate.innerText = "Editar";
    btnUpdate.id = "btn-update";
    btnUpdate.onclick = () => {
        editProduct(product);
    };

    cellAccion.appendChild(btnEliminar);
    cellAccion.appendChild(btnUpdate);
}