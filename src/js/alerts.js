import Swal from "sweetalert2"
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export function alerrcorret() {
    Toast.fire({
        icon: "success",
        title: "El producto se registro con exito"
    });
}
export function alerterror() {
    Toast.fire({
        icon: "error",
        title: "Hubo un error en el sistema"
    });
}

export function empty() {
    Swal.fire({
        title: "Error",
        text: "Favor llenar todos los campos.",
        icon: "error",
        timer: 2000
    });
    return;
}

