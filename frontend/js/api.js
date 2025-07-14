// Archivo para conectar el frontend con el backend
// Este archivo reemplazará el almacenamiento local con llamadas a la API

// URLs base para la API
const API_URL = 'http://localhost:5000/api';

// Clase para gestionar las llamadas a la API
class ApiService {
  // Métodos para voluntarios
  static async getVoluntarios() {
    try {
      const response = await fetch(`${API_URL}/voluntarios`);
      if (!response.ok) {
        throw new Error('Error al obtener voluntarios');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getVoluntarios:', error);
      throw error;
    }
  }

  static async createVoluntario(voluntario) {
    try {
      const response = await fetch(`${API_URL}/voluntarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voluntario),
      });
      if (!response.ok) {
        throw new Error('Error al crear voluntario');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en createVoluntario:', error);
      throw error;
    }
  }

  static async updateVoluntario(id, voluntario) {
    try {
      const response = await fetch(`${API_URL}/voluntarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voluntario),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar voluntario');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en updateVoluntario:', error);
      throw error;
    }
  }

  static async deleteVoluntario(id) {
    try {
      const response = await fetch(`${API_URL}/voluntarios/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar voluntario');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en deleteVoluntario:', error);
      throw error;
    }
  }

  // Métodos para llamados
  static async getLlamados() {
    try {
      const response = await fetch(`${API_URL}/llamados`);
      if (!response.ok) {
        throw new Error('Error al obtener llamados');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getLlamados:', error);
      throw error;
    }
  }

  static async getLlamadoById(id) {
    try {
      const response = await fetch(`${API_URL}/llamados/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener llamado');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getLlamadoById:', error);
      throw error;
    }
  }

  static async createLlamado(llamado) {
    try {
      const response = await fetch(`${API_URL}/llamados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(llamado),
      });
      if (!response.ok) {
        throw new Error('Error al crear llamado');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en createLlamado:', error);
      throw error;
    }
  }

  static async updateLlamado(id, llamado) {
    try {
      const response = await fetch(`${API_URL}/llamados/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(llamado),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar llamado');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en updateLlamado:', error);
      throw error;
    }
  }

  static async cerrarLlamado(id) {
    try {
      const response = await fetch(`${API_URL}/llamados/${id}/cerrar`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Error al cerrar llamado');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en cerrarLlamado:', error);
      throw error;
    }
  }

  static async registrarAsistencia(llamadoId, asistencia) {
    try {
      const response = await fetch(`${API_URL}/llamados/${llamadoId}/asistencia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(asistencia),
      });
      if (!response.ok) {
        throw new Error('Error al registrar asistencia');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en registrarAsistencia:', error);
      throw error;
    }
  }

  static async registrarIngreso(llamadoId, ingreso) {
    try {
      const response = await fetch(`${API_URL}/llamados/${llamadoId}/ingreso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingreso),
      });
      if (!response.ok) {
        throw new Error('Error al registrar ingreso');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en registrarIngreso:', error);
      throw error;
    }
  }

  static async registrarSalida(llamadoId, salida) {
    try {
      const response = await fetch(`${API_URL}/llamados/${llamadoId}/salida`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salida),
      });
      if (!response.ok) {
        throw new Error('Error al registrar salida');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en registrarSalida:', error);
      throw error;
    }
  }
}

// Exportar la clase para su uso en otros archivos
window.ApiService = ApiService;
