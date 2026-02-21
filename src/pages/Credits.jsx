import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { Zap, CreditCard, Clock, Check, ChevronRight, Shield } from 'lucide-react';

const CreditsPage = () => {
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
                if (userCreds?.id) {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/credits?userId=${userCreds.id}`);
                    const data = await response.json();
                    if (response.ok) {
                        setCredits(data.credits);
                    }
                }
            } catch (error) {
                console.error("Error fetching credits:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCredits();
    }, []);

    const packages = [
        {
            name: "Starter",
            credits: 5,
            price: "$9.99",
            features: ["5 Practice Interviews", "Basic Feedback", "Valid for 30 days"]
        },
        {
            name: "Pro",
            credits: 20,
            price: "$29.99",
            features: ["20 Practice Interviews", "Detailed Feedback", "Priority Support", "Valid for 90 days"],
            popular: true
        },
        {
            name: "Enterprise",
            credits: 100,
            price: "$99.99",
            features: ["100 Practice Interviews", "Advanced Analytics", "Team Access", "Unlimited Validity"]
        }
    ];

    const history = [
        { id: 1, type: "Purchase", amount: 20, date: "2024-03-15", status: "Completed" },
        { id: 2, type: "Usage", amount: -1, date: "2024-03-14", status: "Completed", detail: "Mock Interview #12" },
        { id: 3, type: "Bonus", amount: 5, date: "2024-03-01", status: "Completed", detail: "Welcome Bonus" },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar credits={credits} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

                {/* Header Section */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 shadow-2xl sm:px-12 sm:py-16">
                    <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white sm:text-4xl font-display">
                                Credits & Billing
                            </h1>
                            <p className="max-w-xl text-lg text-slate-300">
                                Manage your interview credits and subscription plan.
                                Use credits to start new mock interview sessions.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
                            <div className="rounded-xl bg-yellow-500/20 p-3">
                                <Zap className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-300">Current Balance</p>
                                <p className="text-3xl font-bold text-white tabular-nums">{loading ? "..." : credits}</p>
                            </div>
                        </div>
                    </div>

                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
                        <div className="h-64 w-64 rounded-full bg-cyan-500" />
                    </div>
                    <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 blur-3xl opacity-20">
                        <div className="h-64 w-64 rounded-full bg-blue-500" />
                    </div>
                </div>

                {/* Packages */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <CreditCard className="w-6 h-6 text-cyan-500" />
                        <h2 className="text-2xl font-bold text-slate-900">Purchase Credits</h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {packages.map((pkg) => (
                            <div key={pkg.name} className={`relative flex flex-col rounded-2xl border p-8 transition-all hover:shadow-xl ${pkg.popular ? 'border-cyan-500 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                {pkg.popular && (
                                    <span className="absolute -top-3 right-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                        MOST POPULAR
                                    </span>
                                )}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-slate-900">{pkg.name}</h3>
                                    <div className="mt-4 flex items-baseline">
                                        <span className="text-4xl font-bold text-slate-900">{pkg.price}</span>
                                        <span className="ml-2 text-sm text-slate-500">/one-time</span>
                                    </div>
                                    <p className="mt-2 text-sm text-cyan-600 font-medium">{pkg.credits} Credits</p>
                                </div>
                                <ul className="mb-8 flex-1 space-y-4">
                                    {pkg.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 shrink-0 text-cyan-500" />
                                            <span className="text-sm text-slate-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full rounded-xl py-3 font-semibold transition-all ${pkg.popular ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                                    Choose {pkg.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* History */}
                <section className="pb-10">
                    <div className="flex items-center gap-3 mb-8">
                        <Clock className="w-6 h-6 text-slate-400" />
                        <h2 className="text-2xl font-bold text-slate-900">Transaction History</h2>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-900">Date</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900">Type</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900">Details</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 text-right">Amount</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {history.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-500">{item.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.type === 'Purchase' || item.type === 'Bonus'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-slate-100 text-slate-800'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-900 font-medium">
                                                {item.type === 'Purchase' ? `Purchased ${item.amount} Credits` : item.detail || '-'}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold ${item.amount > 0 ? 'text-green-600' : 'text-slate-600'
                                                }`}>
                                                {item.amount > 0 ? '+' : ''}{item.amount}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-green-600 font-medium flex items-center justify-end gap-1.5">
                                                    <Check className="w-3.5 h-3.5" />
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default CreditsPage;
