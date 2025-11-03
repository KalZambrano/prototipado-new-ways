import Swal from "sweetalert2"

export default function NoWhere(){
    const handleClick = () => {
        Swal.fire({
            icon: "warning",
            title: "Error",
            text: "Conflicto de horario detectado",
        })
    }
    return (
        <button onClick={handleClick} className="bg-purple-400 px-8 py-4 rounded-xl">No hay donde ir</button>
    )
}