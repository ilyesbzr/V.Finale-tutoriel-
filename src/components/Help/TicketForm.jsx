import React, { useState } from 'react';
import Button from '../UI/Button';
import Alert from '../UI/Alert';

export default function TicketForm() {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'normal',
    type: 'support',
    // Fields for user creation request
    requestType: 'support', // 'support' or 'user_creation'
    newUserEmail: '',
    newUserRole: 'user',
    newUserGroup: '',
    newUserEntity: '',
    newUserSites: []
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulation de création de ticket pour la démonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({
        subject: '',
        description: '',
        priority: 'normal',
        type: 'support',
        requestType: 'support',
        newUserEmail: '',
        newUserRole: 'user',
        newUserGroup: '',
        newUserEntity: '',
        newUserSites: []
      });
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du ticket");
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Créer un ticket de support</h2>
      
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      {success && (
        <Alert type="success" className="mb-4">
          Votre ticket a été créé avec succès. Nous vous répondrons dans les plus brefs délais.
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type de demande</label>
          <select
            value={formData.requestType}
            onChange={(e) => setFormData(prev => ({ ...prev, requestType: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="support">Support technique</option>
            <option value="bug">Signalement de bug</option>
            <option value="user_creation">Demande de création d'utilisateur</option>
          </select>
        </div>

        {formData.requestType === 'user_creation' ? (
          // Formulaire de création d'utilisateur
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email du nouvel utilisateur</label>
              <input
                type="email"
                value={formData.newUserEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, newUserEmail: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rôle souhaité</label>
              <select
                value={formData.newUserRole}
                onChange={(e) => setFormData(prev => ({ ...prev, newUserRole: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="user">Utilisateur</option>
                <option value="secretary">Secrétaire</option>
                <option value="manager">Manager</option>
                <option value="director">Directeur</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Groupe</label>
              <input
                type="text"
                value={formData.newUserGroup}
                onChange={(e) => setFormData(prev => ({ ...prev, newUserGroup: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Nom du groupe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Plaque</label>
              <input
                type="text"
                value={formData.newUserEntity}
                onChange={(e) => setFormData(prev => ({ ...prev, newUserEntity: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Nom de la plaque"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sites accessibles</label>
              <input
                type="text"
                value={formData.newUserSites.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  newUserSites: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Sites séparés par des virgules"
              />
            </div>
          </>
        ) : (
          // Formulaire standard
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priorité</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="normal">Normale</option>
                <option value="high">Haute</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sujet</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {formData.requestType === 'user_creation' ? 'Informations complémentaires' : 'Description détaillée'}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
        >
          Envoyer le ticket
        </Button>
      </form>
    </div>
  );
}