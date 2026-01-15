import React, { useState } from 'react';
import { seedInterviews } from '../utils/seedInterviews';
import Navbar from '../components/Navbar';

const AdminSeed = () => {
    const [status, setStatus] = useState('');

    const handleSeed = async () => {
        setStatus('Seeding...');
        try {
            await seedInterviews();
            setStatus('Seeding Complete! Check console and Supabase.');
        } catch (error) {
            console.error(error);
            setStatus('Error seeding data.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Admin Data Seeding</h1>
                <p className="mb-4">Click the button below to upload TechnicalInterviews.js data to Supabase.</p>
                <button
                    onClick={handleSeed}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Seed Interviews Data
                </button>
                {status && <p className="mt-4 font-semibold">{status}</p>}
            </div>
        </div>
    );
};

export default AdminSeed;
