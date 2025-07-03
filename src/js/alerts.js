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
        title: "creado correctamente"
    });
}
export function alerterror() {
    Toast.fire({
        icon: "error",
        title: "hubo un problema en el sistema "
    });
}