import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../providers/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import TeamsForm from '../../components/TeamsForm';

import { auth } from "../../../firebaseConfig"; // Asegúrate de que la ruta sea correcta
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import App from '../../App';
import Login from '../../components/Login';

describe('TeamsForm', () => {
    it('renders without error', async () => {

        const mockLogin = async (email, password) => {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            return (userCredential.user);
        };

        const user = await mockLogin('stivenjcr@gmail.com', '123456');

        const { getByText, container } = render(
            <AuthProvider value={{ user, login: mockLogin }}>
                <BrowserRouter>
                    <App>
                        <Login />
                    </App>
                </BrowserRouter>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(getByText("Correo Electrónico")).toBeInTheDocument();
        });

        //expect(screen.getByText('Texto esperado')).toBeInTheDocument();
        // Agrega más expectativas según sea necesario
    });

    // Agrega más pruebas según sea necesario
});