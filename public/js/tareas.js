document.addEventListener('DOMContentLoaded', () => {
    const editarButtons = document.querySelectorAll('.editar-button');

    editarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const formEditar = document.getElementById('formEditar');
            const editarTareaForm = document.getElementById('editarTareaForm');

            formEditar.style.display = 'block';
            editarTareaForm.action = '/tareas/editar/' + button.getAttribute('data-id');
            editarTareaForm.titulo.value = button.getAttribute('data-titulo');
            editarTareaForm.descripcion.value = button.getAttribute('data-descripcion');
            editarTareaForm.fecha_entrega.value = button.getAttribute('data-fecha');
            editarTareaForm.hora_entrega.value = button.getAttribute('data-hora');
        });
    });
});
