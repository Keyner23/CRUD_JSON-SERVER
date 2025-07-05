import { alerrcorret, alerterror, empty } from "./alerts"
import Swal from "sweetalert2"

const urlApi = "http://localhost:3000/products"
const $name = document.getElementById("name")
const $amount = document.getElementById("amount")
const $price = document.getElementById("preci")
const $form = document.getElementById("form")
const $productTableBody = document.getElementById("product-table-body")
const $getProduct = document.getElementById("get-product")
const $btnCalculate = document.getElementById("inventory")

// Variables to control editing
let isEditing = false
let editingProductId = null
let editingRow = null
let currentProducts = [] // This stores the current product list from the server

// Event for creating or editing a product
$form.addEventListener("submit", async function (event) {
    event.preventDefault()

    // Check if any field is empty
    if ($name.value === "" || $amount.value === "" || $price.value === "") {
        empty()
        return
    }

    // Avoid duplicate names (only when creating, not editing)
    const nameToCheck = $name.value.trim().toLowerCase()
    if (!isEditing && currentProducts.some(p => p.name.trim().toLowerCase() === nameToCheck)) {
        Swal.fire({
            icon: "error",
            text: "Ya existe un producto con este nombre."
        })
        return
    }

    if (isEditing) {
        // If editing, update the product
        await putProduct(editingProductId)
        updateRowInTable(editingRow, {
            id: editingProductId,
            name: $name.value,
            amount: $amount.value,
            price: $price.value
        })
        isEditing = false
        editingProductId = null
        editingRow = null
    } else {
        // If not editing, create a new product
        await postProduct()
        await getProducts()
    }

    resetForm()
})

// Event for calculating total inventory value
$btnCalculate.addEventListener("click", calculateInventory)

// Event for manually fetching products
$getProduct.addEventListener("click", function () {
    getProducts()
})

// Clears the form inputs
function resetForm() {
    $name.value = ""
    $amount.value = ""
    $price.value = ""
}

// Sends a new product to the server (POST)
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

// Gets the product list from the server and renders it in the table
async function getProducts() {
    try {
        let response = await fetch(urlApi)
        if (!response.ok) throw new Error("Error al obtener productos")

        let data = await response.json()
        currentProducts = data // Used to prevent duplicates and calculate inventory
        $productTableBody.innerHTML = ""
        data.forEach(product => createRow(product))
    } catch (error) {
        alerterror()
    }
}

// Creates a row in the table with product data and action buttons
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
        deleteProduct(nuevaFila, product.id)
    }

    let btnUpdate = document.createElement("button")
    btnUpdate.innerText = "Editar"
    btnUpdate.id = "btn-update"
    btnUpdate.onclick = function () {
        editProduct(product, nuevaFila)
    }

    cellAccion.appendChild(btnEliminar)
    cellAccion.appendChild(btnUpdate)
}

// Deletes a product and refreshes the list
async function deleteProduct(fila, id) {
    Swal.fire({
        title: "¿DESEAS BORRAR?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await fetch(`${urlApi}/${id}`, {
                    method: 'DELETE'
                })
                fila.remove()
                Swal.fire({
                    title: "¡ELIMINADO!",
                    text: "Fue eliminado correctamente.",
                    icon: "success"
                })

                await getProducts() // Refresh product list to keep data updated

            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo eliminar el producto."
                })
            }
        }
    })
}

// Fills the form fields with the product data for editing
function editProduct(product, row) {
    $name.value = product.name
    $amount.value = product.amount
    $price.value = product.price

    isEditing = true
    editingProductId = product.id
    editingRow = row
}

// Sends updated product data to the server (PUT)
async function putProduct(id) {
    const updatedProduct = {
        name: $name.value,
        amount: $amount.value,
        price: $price.value
    }

    try {
        const response = await fetch(`${urlApi}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
        })

        if (!response.ok) {
            throw new Error('Error al actualizar el producto')
        }

        const result = await response.json()
        console.log('Producto actualizado:', result)
        alerrcorret()
    } catch (error) {
        alerterror()
        console.error('Error:', error)
    }
}

// Updates the table row with the new product values after editing
function updateRowInTable(row, updatedProduct) {
    row.cells[1].textContent = updatedProduct.name
    row.cells[2].textContent = updatedProduct.amount
    row.cells[3].textContent = updatedProduct.price
}

// Calculates the total inventory value (amount * price for all products)
function calculateInventory() {
    let total = 0

    currentProducts.forEach(product => {
        const cantidad = parseFloat(product.amount)
        const precio = parseFloat(product.price)
        if (!isNaN(cantidad) && !isNaN(precio)) {
            total += cantidad * precio
        }
    })

    Swal.fire({
        icon: "info",
        title: "Total del Inventario",
        text: `El valor total del inventario es: $${total.toLocaleString()}`
    })
}
