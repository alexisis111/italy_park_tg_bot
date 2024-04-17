import { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram.js';
import Header from '../components/Header/Header.jsx';

export default function App() {
    const { tg } = useTelegram();

    useEffect(() => {
        tg.ready();
    }, []);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        carNumber: ''
    });
    const [users, setUsers] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке данных');
            }

            alert('Данные успешно отправлены');
            // Опционально: сбросить значения формы после успешной отправки
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                carNumber: ''
            });
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке данных');
        }
    };

    const handleGetUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/users');
            if (!response.ok) {
                throw new Error('Ошибка при получении данных');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при получении данных');
        }
    };

    const handleContinueClick = async () => {
        try {
            const response = await fetch('http://localhost:8000/send-data-to-bot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to send data to bot');
            }

            alert('Data sent to bot successfully!');
            // Дополнительно можно обновить состояние вашего приложения, чтобы отобразить,
            // что данные были успешно отправлены
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send data to bot');
        }
    };


    useEffect(() => {
        if (formData.firstName && formData.lastName && formData.phone && formData.carNumber) {
            tg.sendData(JSON.stringify(formData));
            tg.MainButton.show(() => handleContinueClick);
        } else {
            tg.MainButton.hide();
        }
    }, [formData, tg]);

    return (
        <>
            <Header />
            <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold underline text-red-500 mb-5">
                    Заполните форму
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">Имя</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName}
                               onChange={handleChange}
                               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">Фамилия</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName}
                               onChange={handleChange}
                               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Телефон</label>
                        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                    </div>
                    <div>
                        <label htmlFor="carNumber" className="block text-gray-700 font-bold mb-2">Номер авто</label>
                        <input type="text" id="carNumber" name="carNumber" value={formData.carNumber}
                               onChange={handleChange}
                               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                    </div>
                    <button type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Отправить
                    </button>
                </form>
                <div className="mt-8">
                    <button onClick={handleGetUsers}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Получить
                        данные
                    </button>
                    <h2 className="text-xl font-bold mt-5">Данные из базы данных:</h2>
                    <ul className="list-disc list-inside">
                        {users.map(user => (
                            <li key={user.id} className="text-gray-800">
                                <p><span className="font-bold">Id:</span> {user.id}</p>
                                <p><span className="font-bold">Имя:</span> {user.firstName}</p>
                                <p><span className="font-bold">Фамилия:</span> {user.lastName}</p>
                                <p><span className="font-bold">Телефон:</span> {user.phone}</p>
                                <p><span className="font-bold">Номер авто:</span> {user.carNumber}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
