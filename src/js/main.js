
import { alerrcorret, alerterror } from "./alerts"
const urlApi = "http://localhost:3000/coders"

const $name = document.getElementById("name")
const $age = document.getElementById("age")
const $email = document.getElementById("email")
const $password = document.getElementById("password")
const $clan = document.getElementById("clan")
const $form = document.getElementById("form")


$form.addEventListener("submit", function (event) {  //para capturar al evento de submit
    event.preventDefault()
    createCoder()
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