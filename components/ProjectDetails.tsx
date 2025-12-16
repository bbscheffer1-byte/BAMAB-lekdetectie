import React from 'react';
import { ReportData } from '../types';
import { User, MapPin, Calendar, Hash, Phone, Mail } from 'lucide-react';

interface ProjectDetailsProps {
  data: ReportData;
  onChange: (data: ReportData) => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
        <span className="bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm">1</span>
        Projectgegevens
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Naam Klant</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="clientName"
              value={data.clientName}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-slate-300 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 shadow-sm transition-colors"
              placeholder="Bijv. J. Jansen"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Referentienummer</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="referenceNumber"
              value={data.referenceNumber}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-slate-300 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 shadow-sm transition-colors"
              placeholder="Bijv. LD-2023-001"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Telefoonnummer</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="tel"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-slate-300 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 shadow-sm transition-colors"
              placeholder="06 12345678"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">E-mailadres</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-slate-300 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 shadow-sm transition-colors"
              placeholder="klant@email.nl"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Adres</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="address"
              value={data.address}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-slate-300 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 shadow-sm transition-colors"
              placeholder="Straatnaam 123"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Woonplaats</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="city"
              value={data.city}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-slate-300 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 shadow-sm transition-colors"
              placeholder="Amsterdam"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Datum Inspectie</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="date"
              name="date"
              value={data.date}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-slate-300 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 shadow-sm transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;