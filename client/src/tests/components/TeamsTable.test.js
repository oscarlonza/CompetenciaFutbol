import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import TeamsTable from '../../components/TeamsTable';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../../providers/AuthContext'; // Importa el proveedor de autenticación

// Mock de axios
jest.mock('axios');

describe('TeamsTable', () => {
  const mockTableData = [
    { idEquipo: 1, grupoEquipo: 'Grupo A', nombreEquipo: 'Equipo 1', createAt: '2023-01-01' },
    { idEquipo: 2, grupoEquipo: 'Grupo B', nombreEquipo: 'Equipo 2', createAt: '2023-02-01' },
  ];
  const mockUser = {
    email: 'stivenjcr@gmail.com',
    password: '123456',
  };

  const mockFetchTable = () => {
    axios.get.mockResolvedValue({ data: mockTableData });
  };

  const renderComponent = async () => {
    await act(async () => {
      render(
        <Router>
          <AuthProvider> {mockUser}
            <TeamsTable onUserDeleted={jest.fn()} onUserAdded={jest.fn()} />
          </AuthProvider>
        </Router>
      );
    });
  };

  beforeEach(() => {
    mockFetchTable();
  });

});

/*import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import TeamsTable from '../../components/TeamsTable';
import { BrowserRouter as Router } from 'react-router-dom';
 
// Mock de axios
jest.mock('axios');
 
describe('TeamsTable', () => {
  const mockTableData = [
    { idEquipo: 1, grupoEquipo: 'Grupo A', nombreEquipo: 'Equipo 1', createAt: '2023-01-01' },
    { idEquipo: 2, grupoEquipo: 'Grupo B', nombreEquipo: 'Equipo 2', createAt: '2023-02-01' },
  ];
 
  const mockFetchTable = () => {
    axios.get.mockResolvedValue({ data: mockTableData });
  };
 
  const renderComponent = async () => {
    await act(async () => {
      render(
<Router>
<TeamsTable onUserDeleted={jest.fn()} onUserAdded={jest.fn()} />
</Router>
      );
    });
  };
 
  beforeEach(() => {
    mockFetchTable();
  });
 
  test('should render table with fetched data', async () => {
    await renderComponent();
 
    // Espera a que los datos se carguen y se rendericen en la tabla
    await waitFor(() => {
      expect(screen.getByText('Equipo 1')).toBeInTheDocument();
      expect(screen.getByText('Equipo 2')).toBeInTheDocument();
    });
  });
 
  test('should filter table data based on search input', async () => {
    await renderComponent();
 
    // Espera a que los datos se carguen y se rendericen en la tabla
    await waitFor(() => {
      expect(screen.getByText('Equipo 1')).toBeInTheDocument();
      expect(screen.getByText('Equipo 2')).toBeInTheDocument();
    });
 
    // Simula la entrada de búsqueda
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'Equipo 1' } });
 
    // Espera a que se aplique el filtro
    await waitFor(() => {
      expect(screen.getByText('Equipo 1')).toBeInTheDocument();
      expect(screen.queryByText('Equipo 2')).not.toBeInTheDocument();
    });
  });
 
  /*test('should delete a team when delete button is clicked', async () => {
    axios.delete.mockResolvedValue({});
    await renderComponent();
 
    // Espera a que los datos se carguen y se rendericen en la tabla
    await waitFor(() => {
      expect(screen.getByText('Equipo 1')).toBeInTheDocument();
    });
 
    // Simula el clic en el botón de eliminar
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
 
    // Confirma la eliminación en el modal de confirmación
    await waitFor(() => {
      expect(screen.getByText('¿Estas seguro que quieres borrar este equipo?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Yes, delete it!'));
 
    // Espera a que el equipo sea eliminado y la tabla se actualice
    await waitFor(() => {
      expect(screen.queryByText('Equipo 1')).not.toBeInTheDocument();
    });
  });*/
 
  // Puedes agregar más pruebas para otras funcionalidades del componente

/* import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import TeamsTable from '../../components/TeamsTable';
import { BrowserRouter as Router } from 'react-router-dom';
 
// Mock de axios
jest.mock('axios');
 
describe('TeamsTable', () => {
  const mockTableData = [
    { idEquipo: 1, grupoEquipo: 'Grupo A', nombreEquipo: 'Equipo 1', createAt: '2023-01-01' },
    { idEquipo: 2, grupoEquipo: 'Grupo B', nombreEquipo: 'Equipo 2', createAt: '2023-02-01' },
  ];
 
  const mockFetchTable = () => {
    axios.get.mockResolvedValue({ data: mockTableData });
  };
 
  const renderComponent = async () => {
    await act(async () => {
      render(
<Router>
<TeamsTable onUserDeleted={jest.fn()} onUserAdded={jest.fn()} />
</Router>
      );
    });
  };
 
  beforeEach(() => {
    mockFetchTable();
  });
 
  test('should render table with fetched data', async () => {
    await renderComponent();
 
    // Espera a que los datos se carguen y se rendericen en la tabla
    await waitFor(() => {
      expect(screen.getByText('Equipo 1')).toBeInTheDocument();
      expect(screen.getByText('Equipo 2')).toBeInTheDocument();
    });
  });
 
  test('should filter table data based on search input', async () => {
    await renderComponent();
 
    // Espera a que los datos se carguen y se rendericen en la tabla
    await waitFor(() => {
      expect(screen.getByText('Equipo 1')).toBeInTheDocument();
      expect(screen.getByText('Equipo 2')).toBeInTheDocument();
    });
 
    // Simula la entrada de búsqueda
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'Equipo 1' } });
 
    // Espera a que se aplique el filtro
    await waitFor(() => {
      expect(screen.getByText('Equipo 1')).toBeInTheDocument();
      expect(screen.queryByText('Equipo 2')).not.toBeInTheDocument();
    });
  });
 
  /*test('should delete a team when delete button is clicked', async () => {
    axios.delete.mockResolvedValue({});
    await renderComponent();
 
    // Espera a que los datos se carguen y se rendericen en la tabla
    await waitFor(() => {
      expect(screen.getByText('Equipo 1')).toBeInTheDocument();
    });
 
    // Simula el clic en el botón de eliminar
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
 
    // Confirma la eliminación en el modal de confirmación
    await waitFor(() => {
      expect(screen.getByText('¿Estas seguro que quieres borrar este equipo?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Yes, delete it!'));
 
    // Espera a que el equipo sea eliminado y la tabla se actualice
    await waitFor(() => {
      expect(screen.queryByText('Equipo 1')).not.toBeInTheDocument();
    });
  });*/
 
  // Puedes agregar más pruebas para otras funcionalidades del componente*/

  /*test('should filter table data based on search input', async () => {

    renderComponent();
 
    // Espera a que los datos se carguen y se rendericen en la tabla

    await waitFor(() => {

      expect(screen.getByText('Equipo 1')).toBeInTheDocument();

      expect(screen.getByText('Equipo 2')).toBeInTheDocument();

    });
 
    // Simula la entrada de búsqueda

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'Equipo 1' } });
 
    // Espera a que se aplique el filtro

    await waitFor(() => {

      expect(screen.getByText('Equipo 1')).toBeInTheDocument();

      expect(screen.queryByText('Equipo 2')).not.toBeInTheDocument();

    });

  });
 
  test('should delete a team when delete button is clicked', async () => {

    axios.delete.mockResolvedValue({});

    renderComponent();
 
    // Espera a que los datos se carguen y se rendericen en la tabla

    await waitFor(() => {

      expect(screen.getByText('Equipo 1')).toBeInTheDocument();

    });
 
    // Simula el clic en el botón de eliminar

    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
 
    // Confirma la eliminación en el modal de confirmación

    await waitFor(() => {

      expect(screen.getByText('¿Estas seguro que quieres borrar este equipo?')).toBeInTheDocument();

    });

    fireEvent.click(screen.getByText('Yes, delete it!'));
 
    // Espera a que el equipo sea eliminado y la tabla se actualice

    await waitFor(() => {

      expect(screen.queryByText('Equipo 1')).not.toBeInTheDocument();

    });

  });*/

  // Puedes agregar más pruebas para otras funcionalidades del componente

/*import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import TeamsTable from '../../components/TeamsTable';

jest.mock('axios');

describe('TeamsTable', () => {
  test('renderiza correctamente y llama a fetchTable al montar', async () => {
    const mockData = [
      { id: 1, name: 'Equipo 1', group: 'Grupo A', createdAt: '2024-05-21' },
      { id: 2, name: 'Equipo 2', group: 'Grupo B', createdAt: '2024-05-22' },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    render(<TeamsTable />);

    expect(screen.getByText('Tabla de Equipos')).toBeInTheDocument();

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/data');
  });
});*/

/*import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from 'axios';
import Swal from 'sweetalert2';
import TeamsTable from '../../src/components/TeamsTable';

// Mock axios
jest.mock('axios');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

const mockData = [
  { idEquipo: 1, grupoEquipo: "Grupo A", nombreEquipo: "Equipo 1", createAt: "2023-01-01" },
  { idEquipo: 2, grupoEquipo: "Grupo B", nombreEquipo: "Equipo 2", createAt: "2023-02-01" },
];

describe('TeamsTable', () => {
    beforeEach(() => {
      axios.get.mockResolvedValue({ data: mockData });
      axios.delete.mockResolvedValue({});
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('renders TeamsTable component', async () => {
      render(<TeamsTable onUserDeleted={jest.fn()} onUserAdded={jest.fn()} />);
  
      expect(screen.getByText('Tabla de Equipos')).toBeInTheDocument();
      expect(screen.getByText('Se muestra toda la informacion acerca de todos los equipos')).toBeInTheDocument();
  
      await waitFor(() => {
        expect(screen.getByText('Equipo 1')).toBeInTheDocument();
        expect(screen.getByText('Equipo 2')).toBeInTheDocument();
      });
    });
});*/