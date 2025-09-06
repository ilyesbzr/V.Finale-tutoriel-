import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  inProgress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  low: 'text-gray-600',
  normal: 'text-blue-600',
  high: 'text-orange-600',
  urgent: 'text-red-600'
};

export default function TicketList({ tickets = [] }) {
  // Données de démonstration pour les tickets
  const demoTickets = [
    {
      id: 1,
      subject: "Question sur les objectifs",
      type: "support",
      priority: "normal",
      status: "resolved",
      created_at: "2025-01-15T10:30:00Z"
    },
    {
      id: 2,
      subject: "Problème d'affichage graphique",
      type: "bug",
      priority: "high",
      status: "inProgress",
      created_at: "2025-01-14T14:20:00Z"
    }
  ];
  
  const displayTickets = tickets.length > 0 ? tickets : demoTickets;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Mes tickets</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sujet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(ticket.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.type === 'support' ? 'Support technique' :
                     ticket.type === 'bug' ? 'Signalement de bug' :
                     ticket.type === 'feature' ? 'Suggestion' :
                     'Question'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${priorityColors[ticket.priority]}`}>
                      {ticket.priority === 'low' ? 'Basse' :
                       ticket.priority === 'normal' ? 'Normale' :
                       ticket.priority === 'high' ? 'Haute' :
                       'Urgente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[ticket.status]}`}>
                      {ticket.status === 'new' ? 'Nouveau' :
                       ticket.status === 'inProgress' ? 'En cours' :
                       ticket.status === 'resolved' ? 'Résolu' :
                       'Fermé'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}