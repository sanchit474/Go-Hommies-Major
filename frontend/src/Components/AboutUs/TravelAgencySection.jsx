import React from 'react';
import { MapPin, Award, Users, Compass, Globe, Shield } from 'lucide-react';

const TravelAgencySection = () => {
  const agencies = [
    {
      name: "GoHomies Travel Co.",
      logo: "🌍",
      description: "Premier travel agency specializing in curated adventure packages for wanderlust seekers.",
      specialties: ["Adventure Tourism", "Group Travel", "Customized Itineraries"],
      founded: "2018",
      contact: "contact@gohomies.com",
      phone: "+91-800-TRAVEL-1"
    },
    {
      name: "Global Nomads Collective",
      logo: "✈️",
      description: "Expert travel organizers creating unforgettable journeys across continents.",
      specialties: ["International Tours", "Visa Assistance", "Budget Planning"],
      founded: "2019",
      contact: "info@globalnomads.com",
      phone: "+91-800-NOMADS-1"
    },
    {
      name: "Adventure Hub Expeditions",
      logo: "⛰️",
      description: "Specialists in off-the-beaten-path experiences and sustainable travel.",
      specialties: ["Eco-Tourism", "Trekking", "Cultural Immersion"],
      founded: "2020",
      contact: "explore@adventurehub.com",
      phone: "+91-800-EXPLORE-1"
    }
  ];

  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certified & Trusted",
      description: "Licensed travel agencies with proven track records"
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: "Expert Guides",
      description: "Experienced travel consultants for perfect itineraries"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Guaranteed Safety",
      description: "Comprehensive travel insurance and 24/7 support"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Network",
      description: "Partners across 50+ countries worldwide"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Specialists",
      description: "Experts in organizing group travel experiences"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Destination Experts",
      description: "Deep knowledge of unique travel destinations"
    }
  ];

  return (
    <div className="bg-[#fefaf6] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-[poppins]">
            Our Travel Agency Partners
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We partner with leading travel agencies to bring you the best curated travel experiences and unforgettable adventures.
          </p>
        </div>

        {/* Travel Agency Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {agencies.map((agency, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 border-t-4 border-blue-500"
            >
              <div className="text-5xl mb-4">{agency.logo}</div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {agency.name}
              </h3>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {agency.description}
              </p>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-500 mb-2">SPECIALTIES:</p>
                <div className="flex flex-wrap gap-2">
                  {agency.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Founded:</span> {agency.founded}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Email:</span> {agency.contact}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Phone:</span> {agency.phone}
                </p>
              </div>

              <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Learn More
              </button>
            </div>
          ))}
        </div>

        {/* Why Partner With Us */}
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center font-[poppins]">
            Why Choose Our Travel Agency Partners
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Book Your Adventure?</h3>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Connect with our travel agency partners to plan your next unforgettable journey.
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors duration-200">
            Contact a Travel Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelAgencySection;
