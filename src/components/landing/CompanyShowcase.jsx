import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import googleLogo from '../../assets/images/google.png';
import metaLogo from '../../assets/images/meta.png';
import amazonLogo from '../../assets/images/amazon.png';
import microsoftLogo from '../../assets/images/microsoft.png';
import netflixLogo from '../../assets/images/netflix.png';
import appleLogo from '../../assets/images/apple.png';

const CompanyShowcase = () => {
    const navigate = useNavigate();

    const companies = [
        { logo: googleLogo, name: 'Google', rounds: 5 },
        { logo: metaLogo, name: 'Meta', rounds: 4 },
        { logo: amazonLogo, name: 'Amazon', rounds: 5 },
        { logo: microsoftLogo, name: 'Microsoft', rounds: 4 },
        { logo: netflixLogo, name: 'Netflix', rounds: 4 },
        { logo: appleLogo, name: 'Apple', rounds: 5 },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                        Practice Interview Simulations Of Top Companies
                    </h2>
                    <p className="text-lg text-gray-600">
                        Realistic interview loops modeled after actual hiring processes
                    </p>
                </div>

                {/* Company Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                    {companies.map((company, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => navigate('/dashboard/all-popular-interviews')}
                        >
                            {/* Company Logo */}
                            <div className="flex items-center justify-center mb-4">
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="h-12 object-contain"
                                />
                            </div>

                            {/* Company Name */}
                            <h3 className="text-center text-lg font-semibold text-black mb-2">
                                {company.name}
                            </h3>

                            {/* Hover Arrow */}
                            <div className="flex items-center justify-center mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                <span className="text-sm font-medium text-black">View Details</span>
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All CTA */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/dashboard/all-popular-interviews')}
                        className="px-8 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                    >
                        View All Company Simulations
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CompanyShowcase;
