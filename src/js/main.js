import { alerrcorret, alerterror, empty } from "./alerts"
import Swal from "sweetalert2"


const urlApi = "http://localhost:3000/coders"
const $name = document.getElementById("name")
const $amount = document.getElementById("amount")
const $price = document.getElementById("preci")
const $form = document.getElementById("form")
const $productTableBody = document.getElementById("product-table-body")
const $getProduct = document.getElementById("get-product")



$form.addEventListener("submit", function (event) {
    event.preventDefault()
    if ($name.value === "" || $amount.value === "" || $price.value === "") {
        empty()
    } else {
        postProduct().then(() => getProducts())
    }
})

$getProduct.addEventListener("click", function () {
    getProducts()
})


function resetForm() {
    $name.value = ""
    $amount.value = ""
    $price.value = ""
}


async function postProduct() {
    const newProduct = {
        name: $name.value,
        amount: $amount.value,
        price: $price.value
    }

    try {
        let response = await fetch(urlApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProduct)
        })

        if (!response.ok) {
            throw new Error("Error en la petición POST")
        }

        alerrcorret()
    } catch (error) {
        alerterror()
        console.error("Error en el sistema:", error)
    }

    resetForm()
}


async function getProducts() {
    try {
        let response = await fetch(urlApi)
        if (!response.ok) throw new Error("Error al obtener productos")

        let data = await response.json()
        $productTableBody.innerHTML = ""
        data.forEach(product => createRow(product))
    } catch (error) {
        alerterror()

    }
}


function createRow(product) {
    let nuevaFila = $productTableBody.insertRow()

    let cellId = nuevaFila.insertCell(0)
    let cellName = nuevaFila.insertCell(1)
    let cellAmount = nuevaFila.insertCell(2)
    let cellPrice = nuevaFila.insertCell(3)
    let cellAccion = nuevaFila.insertCell(4)

    cellId.textContent = product.id
    cellName.textContent = product.name
    cellAmount.textContent = product.amount
    cellPrice.textContent = product.price

    let btnEliminar = document.createElement("button")
    btnEliminar.innerText = "Eliminar"
    btnEliminar.id = "btn-delete"
    btnEliminar.onclick = function () {
        deleteProduct(nuevaFila, product.id);
    };

    let btnUpdate = document.createElement("button")
    btnUpdate.innerText = "Editar"
    btnUpdate.id = "btn-update"

    cellAccion.appendChild(btnEliminar)
    cellAccion.appendChild(btnUpdate)
}


async function deleteProduct(fila, id) {
    Swal.fire({
        title: "¿DESEAS BORRAR?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${urlApi}/${id}`, {
                method: 'DELETE'
            })
            fila.remove();
            Swal.fire({
                title: "ELIMINADO!",
                text: "Fue eliminado correctamente.",
                icon: "success"
            });
        }
    });
}
