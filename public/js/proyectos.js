// proyectos.js
function mostrarFormularioEditar(proyecto) {
    const formEditar = document.getElementById('formEditar');
    formEditar.style.display = 'block';

    // Rellenar los campos del formulario con los datos del proyecto
    formEditar.querySelector('input[name="titulo"]').value = proyecto.titulo;
    formEditar.querySelector('textarea[name="descripcion"]').value = proyecto.descripcion;
    formEditar.querySelector('input[name="fecha_entrega"]').value = proyecto.fecha_entrega.toISOString().split('T')[0];
    formEditar.querySelector('input[name="hora_entrega"]').value = proyecto.hora_entrega;
    
    // Cambiar la acción del formulario para que apunte a la ruta de edición
    formEditar.action = `/proyectos/editar/${proyecto.id}`;
}
