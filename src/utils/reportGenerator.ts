import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatNumber, formatCurrency } from './formatters';
import { MockData } from '../types';

interface ReportData {
  text: string;
  html: string;
  subject: string;
}

/**
 * Génère un rapport textuel moderne pour l'envoi par email
 */
export function generateTextReport(data: MockData, date: Date, site: string): string {
  const formattedDate = format(date, 'dd MMMM yyyy', { locale: fr });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
  let report = '';
  
  // En-tête moderne avec émojis
  report += `📊 RAPPORT D'ACTIVITÉ APRÈS-VENTE\n`;
  report += `═══════════════════════════════════════\n\n`;
  report += `🏢 Site: ${site}\n`;
  report += `📅 Date d'analyse: ${format(subDays(date, 1), 'EEEE dd MMMM yyyy', { locale: fr }).charAt(0).toUpperCase() + format(subDays(date, 1), 'EEEE dd MMMM yyyy', { locale: fr }).slice(1)}\n`;
  report += `⏰ Généré le: ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}\n\n`;
  
  // Résumé exécutif avec indicateurs visuels
  report += `📈 RÉSUMÉ EXÉCUTIF\n`;
  report += `─────────────────\n\n`;
  
  // Calculer les totaux pour le résumé
  const totalHoursTarget = data.departments.mechanical.hoursTarget + data.departments.quickService.hoursTarget + data.departments.bodywork.hoursTarget;
  const totalHoursSold = data.departments.mechanical.hoursSold + data.departments.quickService.hoursSold + data.departments.bodywork.hoursSold;
  const totalRevenueTarget = data.departments.mechanical.revenueTarget + data.departments.quickService.revenueTarget + data.departments.bodywork.revenueTarget;
  const totalRevenue = data.departments.mechanical.revenue + data.departments.quickService.revenue + data.departments.bodywork.revenue;
  
  const hoursProgress = Math.round((totalHoursSold / totalHoursTarget) * 100);
  const revenueProgress = Math.round((totalRevenue / totalRevenueTarget) * 100);
  
  // Fonction pour obtenir l'émoji de performance
  const getPerformanceEmoji = (percentage: number): string => {
    if (percentage >= 90) return '🟢';
    if (percentage >= 75) return '🟡';
    return '🔴';
  };
  
  report += `${getPerformanceEmoji(hoursProgress)} Heures vendues: ${formatNumber(totalHoursSold)}h / ${formatNumber(totalHoursTarget)}h (${hoursProgress}%)\n`;
  report += `${getPerformanceEmoji(revenueProgress)} Chiffre d'affaires: ${formatCurrency(totalRevenue)} / ${formatCurrency(totalRevenueTarget)} (${revenueProgress}%)\n`;
  report += `💰 CA/H moyen: ${formatCurrency(totalHoursSold ? Math.round(totalRevenue / totalHoursSold) : 0)}\n\n`;
  
  // Section Chiffre d'affaires
  report += `💰 CHIFFRE D'AFFAIRES\n`;
  report += `═══════════════════\n\n`;
  
  // Mécanique
  const mechanicalRevenuePercent = Math.round((data.departments.mechanical.revenue / data.departments.mechanical.revenueTarget) * 100);
  const mechanicalRevenuePerHour = data.departments.mechanical.hoursSold ? Math.round(data.departments.mechanical.revenue / data.departments.mechanical.hoursSold) : 0;
  
  report += `🔧 MÉCANIQUE\n`;
  report += `   • CA: ${formatCurrency(data.departments.mechanical.revenue)}\n`;
  report += `   • Obj: ${formatCurrency(data.departments.mechanical.revenueTarget)}\n`;
  report += `   • Avanc: ${getPerformanceEmoji(mechanicalRevenuePercent)} ${mechanicalRevenuePercent}%\n`;
  report += `   • CA/H: ${formatCurrency(mechanicalRevenuePerHour)}\n\n`;
  
  // Service Rapide
  const quickServiceRevenuePercent = Math.round((data.departments.quickService.revenue / data.departments.quickService.revenueTarget) * 100);
  const quickServiceRevenuePerHour = data.departments.quickService.hoursSold ? Math.round(data.departments.quickService.revenue / data.departments.quickService.hoursSold) : 0;
  
  report += `⚡ SERVICE RAPIDE\n`;
  report += `   • CA: ${formatCurrency(data.departments.quickService.revenue)}\n`;
  report += `   • Obj: ${formatCurrency(data.departments.quickService.revenueTarget)}\n`;
  report += `   • Avanc: ${getPerformanceEmoji(quickServiceRevenuePercent)} ${quickServiceRevenuePercent}%\n`;
  report += `   • CA/H: ${formatCurrency(quickServiceRevenuePerHour)}\n\n`;
  
  // Carrosserie
  const bodyworkRevenuePercent = Math.round((data.departments.bodywork.revenue / data.departments.bodywork.revenueTarget) * 100);
  const bodyworkRevenuePerHour = data.departments.bodywork.hoursSold ? Math.round(data.departments.bodywork.revenue / data.departments.bodywork.hoursSold) : 0;
  
  report += `🚗 CARROSSERIE\n`;
  report += `   • CA: ${formatCurrency(data.departments.bodywork.revenue)}\n`;
  report += `   • Obj: ${formatCurrency(data.departments.bodywork.revenueTarget)}\n`;
  report += `   • Avanc: ${getPerformanceEmoji(bodyworkRevenuePercent)} ${bodyworkRevenuePercent}%\n`;
  report += `   • CA/H: ${formatCurrency(bodyworkRevenuePerHour)}\n\n`;
  
  // Section Heures vendues
  report += `⏰ HEURES VENDUES\n`;
  report += `═══════════════\n\n`;
  
  // Mécanique
  const mechanicalHoursPercent = Math.round((data.departments.mechanical.hoursSold / data.departments.mechanical.hoursTarget) * 100);
  
  report += `🔧 MÉCANIQUE\n`;
  report += `   • H. Réal: ${formatNumber(data.departments.mechanical.hoursSold)}h\n`;
  report += `   • Obj: ${formatNumber(data.departments.mechanical.hoursTarget)}h\n`;
  report += `   • Avanc: ${getPerformanceEmoji(mechanicalHoursPercent)} ${mechanicalHoursPercent}%\n`;
  report += `   • J-1: ${formatNumber(data.departments.mechanical.previousDayBilling)}h\n\n`;
  
  // Service Rapide
  const quickServiceHoursPercent = Math.round((data.departments.quickService.hoursSold / data.departments.quickService.hoursTarget) * 100);
  
  report += `⚡ SERVICE RAPIDE\n`;
  report += `   • H. Réal: ${formatNumber(data.departments.quickService.hoursSold)}h\n`;
  report += `   • Obj: ${formatNumber(data.departments.quickService.hoursTarget)}h\n`;
  report += `   • Avanc: ${getPerformanceEmoji(quickServiceHoursPercent)} ${quickServiceHoursPercent}%\n`;
  report += `   • J-1: ${formatNumber(data.departments.quickService.previousDayBilling)}h\n\n`;
  
  // Carrosserie
  const bodyworkHoursPercent = Math.round((data.departments.bodywork.hoursSold / data.departments.bodywork.hoursTarget) * 100);
  
  report += `🚗 CARROSSERIE\n`;
  report += `   • H. Réal: ${formatNumber(data.departments.bodywork.hoursSold)}h\n`;
  report += `   • Obj: ${formatNumber(data.departments.bodywork.hoursTarget)}h\n`;
  report += `   • Avanc: ${getPerformanceEmoji(bodyworkHoursPercent)} ${bodyworkHoursPercent}%\n`;
  report += `   • J-1: ${formatNumber(data.departments.bodywork.previousDayBilling)}h\n\n`;
  
  // Pied de page moderne
  report += `${'═'.repeat(50)}\n`;
  report += `📧 Rapport AutoDashboard - Confidentiel\n`;
  report += `🤖 Généré automatiquement par le système\n`;
  report += `🌐 Accédez à votre espace : https://app.auto-dashboard.com/login\n`;
  report += `📞 Support: contact@autodashboard.com\n`;
  report += `${'═'.repeat(50)}\n`;
  
  return report;
}

/**
 * Génère un rapport HTML moderne pour l'envoi par email
 */
export function generateHtmlReport(data: MockData, date: Date, site: string): string {
  const formattedDate = format(date, 'dd MMMM yyyy', { locale: fr });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
  let html = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport d'activité - ${site}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6; 
        color: #1f2937; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin: 0; 
        padding: 20px;
      }
      
      .container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        overflow: hidden;
      }
      
      .header {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        color: white;
        padding: 40px 30px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        opacity: 0.3;
        animation: float 20s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      .header h1 {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;
        position: relative;
        z-index: 1;
      }
      
      .header .subtitle {
        font-size: 16px;
        opacity: 0.9;
        position: relative;
        z-index: 1;
      }
      
      .content {
        padding: 30px;
      }
      
      .section {
        margin-bottom: 40px;
      }
      
      .section-title {
        font-size: 20px;
        font-weight: 600;
        color: #4f46e5;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .section-title::after {
        content: '';
        flex: 1;
        height: 2px;
        background: linear-gradient(90deg, #4f46e5, transparent);
      }
      
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .summary-card {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        border: 1px solid #e2e8f0;
        transition: transform 0.2s ease;
      }
      
      .summary-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      }
      
      .summary-card .icon {
        font-size: 24px;
        margin-bottom: 8px;
      }
      
      .summary-card .value {
        font-size: 24px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 4px;
      }
      
      .summary-card .label {
        font-size: 14px;
        color: #6b7280;
        font-weight: 500;
      }
      
      .performance-indicator {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
      }
      
      .performance-good {
        background: #dcfce7;
        color: #166534;
      }
      
      .performance-warning {
        background: #fef3c7;
        color: #92400e;
      }
      
      .performance-danger {
        background: #fee2e2;
        color: #991b1b;
      }
      
      .modern-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      
      .modern-table th {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        color: white;
        padding: 16px 12px;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .modern-table td {
        padding: 16px 12px;
        border-bottom: 1px solid #f3f4f6;
        font-size: 14px;
      }
      
      .modern-table tr:last-child td {
        border-bottom: none;
      }
      
      .modern-table tr:nth-child(even) {
        background: #f9fafb;
      }
      
      .modern-table tr:hover {
        background: #f3f4f6;
      }
      
      .service-row {
        font-weight: 600;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
      }
      
      .total-row {
        font-weight: 700;
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
        color: white;
      }
      
      .progress-bar {
        width: 60px;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
        display: inline-block;
        margin-left: 8px;
      }
      
      .progress-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
      }
      
      .progress-good { background: #10b981; }
      .progress-warning { background: #f59e0b; }
      .progress-danger { background: #ef4444; }
      
      .crescendo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
      }
      
      .crescendo-card {
        background: white;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
      }
      
      .crescendo-card h3 {
        color: #4f46e5;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .product-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f3f4f6;
      }
      
      .product-item:last-child {
        border-bottom: none;
      }
      
      .product-name {
        font-weight: 500;
        color: #374151;
      }
      
      .product-stats {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .footer {
        background: #f9fafb;
        padding: 25px 30px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
      }
      
      .footer p {
        color: #6b7280;
        font-size: 14px;
        margin-bottom: 5px;
      }
      
      .badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .badge-success {
        background: #dcfce7;
        color: #166534;
      }
      
      .badge-warning {
        background: #fef3c7;
        color: #92400e;
      }
      
      .badge-danger {
        background: #fee2e2;
        color: #991b1b;
      }
      
      @media (max-width: 600px) {
        .container {
          margin: 10px;
          border-radius: 12px;
        }
        
        .header {
          padding: 30px 20px;
        }
        
        .content {
          padding: 20px;
        }
        
        .modern-table {
          font-size: 12px;
        }
        
        .modern-table th,
        .modern-table td {
          padding: 12px 8px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📊 Rapport d'Activité Après-Vente</h1>
        <div class="subtitle">
          <strong>${site}</strong> • ${capitalizedDate}
        </div>
      </div>
      
      <div class="content">
  `;
  
  // Résumé exécutif
  const totalHoursTarget = data.departments.mechanical.hoursTarget + data.departments.quickService.hoursTarget + data.departments.bodywork.hoursTarget;
  const totalHoursSold = data.departments.mechanical.hoursSold + data.departments.quickService.hoursSold + data.departments.bodywork.hoursSold;
  const totalRevenueTarget = data.departments.mechanical.revenueTarget + data.departments.quickService.revenueTarget + data.departments.bodywork.revenueTarget;
  const totalRevenue = data.departments.mechanical.revenue + data.departments.quickService.revenue + data.departments.bodywork.revenue;
  
  const hoursProgress = Math.round((totalHoursSold / totalHoursTarget) * 100);
  const revenueProgress = Math.round((totalRevenue / totalRevenueTarget) * 100);
  const totalRevenuePerHour = totalHoursSold ? Math.round(totalRevenue / totalHoursSold) : 0;
  
  // Fonction pour obtenir la classe de performance
  const getPerformanceClass = (percentage: number): string => {
    if (percentage >= 90) return 'performance-good';
    if (percentage >= 75) return 'performance-warning';
    return 'performance-danger';
  };
  
  // Fonction pour obtenir la classe de badge
  const getBadgeClass = (percentage: number): string => {
    if (percentage >= 90) return 'badge-success';
    if (percentage >= 75) return 'badge-warning';
    return 'badge-danger';
  };
  
  html += `
        <div class="section">
          <h2 class="section-title">
            🎯 Résumé Exécutif
          </h2>
          <div class="summary-grid">
            <div class="summary-card">
              <div class="icon">⏱️</div>
              <div class="value">${formatNumber(totalHoursSold)}h</div>
              <div class="label">Heures vendues</div>
              <div class="performance-indicator ${getPerformanceClass(hoursProgress)}">
                ${hoursProgress}% de l'objectif
              </div>
            </div>
            <div class="summary-card">
              <div class="icon">💰</div>
              <div class="value">${formatCurrency(totalRevenue)}</div>
              <div class="label">Chiffre d'affaires</div>
              <div class="performance-indicator ${getPerformanceClass(revenueProgress)}">
                ${revenueProgress}% de l'objectif
              </div>
            </div>
            <div class="summary-card">
              <div class="icon">📊</div>
              <div class="value">${formatCurrency(totalRevenuePerHour)}</div>
              <div class="label">CA/H moyen</div>
              <div class="performance-indicator ${getPerformanceClass(Math.round((totalRevenuePerHour / 300) * 100))}">
                ${Math.round((totalRevenuePerHour / 300) * 100)}% de l'objectif
              </div>
            </div>
          </div>
        </div>
  `;
  
  // Section Chiffre d'affaires
  html += `
        <div class="section">
          <h2 class="section-title">
            💰 Chiffre d'Affaires
          </h2>
          <div class="crescendo-grid">
  `;
  
  // Données pour le tableau de bord
  const dashboardData = [
    {
      service: '🔧 Mécanique',
      hoursTarget: data.departments.mechanical.hoursTarget,
      hoursSold: data.departments.mechanical.hoursSold,
      hoursPercent: Math.round((data.departments.mechanical.hoursSold / data.departments.mechanical.hoursTarget) * 100),
      previousDayBilling: data.departments.mechanical.previousDayBilling,
      revenueTarget: data.departments.mechanical.revenueTarget,
      revenue: data.departments.mechanical.revenue,
      revenuePercent: Math.round((data.departments.mechanical.revenue / data.departments.mechanical.revenueTarget) * 100),
      revenuePerHour: data.departments.mechanical.hoursSold ? Math.round(data.departments.mechanical.revenue / data.departments.mechanical.hoursSold) : 0
    },
    {
      service: '⚡ Service Rapide',
      hoursTarget: data.departments.quickService.hoursTarget,
      hoursSold: data.departments.quickService.hoursSold,
      hoursPercent: Math.round((data.departments.quickService.hoursSold / data.departments.quickService.hoursTarget) * 100),
      previousDayBilling: data.departments.quickService.previousDayBilling,
      revenueTarget: data.departments.quickService.revenueTarget,
      revenue: data.departments.quickService.revenue,
      revenuePercent: Math.round((data.departments.quickService.revenue / data.departments.quickService.revenueTarget) * 100),
      revenuePerHour: data.departments.quickService.hoursSold ? Math.round(data.departments.quickService.revenue / data.departments.quickService.hoursSold) : 0
    },
    {
      service: '🚗 Carrosserie',
      hoursTarget: data.departments.bodywork.hoursTarget,
      hoursSold: data.departments.bodywork.hoursSold,
      hoursPercent: Math.round((data.departments.bodywork.hoursSold / data.departments.bodywork.hoursTarget) * 100),
      previousDayBilling: data.departments.bodywork.previousDayBilling,
      revenueTarget: data.departments.bodywork.revenueTarget,
      revenue: data.departments.bodywork.revenue,
      revenuePercent: Math.round((data.departments.bodywork.revenue / data.departments.bodywork.revenueTarget) * 100),
      revenuePerHour: data.departments.bodywork.hoursSold ? Math.round(data.departments.bodywork.revenue / data.departments.bodywork.hoursSold) : 0
    }
  ];
  
  // Ajouter les cartes pour chaque service
  dashboardData.forEach(row => {
    if (row.service !== 'TOTAL') {
      const revenueProgressClass = row.revenuePercent >= 90 ? 'progress-good' : row.revenuePercent >= 75 ? 'progress-warning' : 'progress-danger';
      
      html += `
            <div class="crescendo-card">
              <h3>${row.service}</h3>
              <div class="product-item">
                <div class="product-name">CA Réalisé</div>
                <div class="product-stats">
                  <span class="badge ${getBadgeClass(row.revenuePercent)}">${formatCurrency(row.revenue)}</span>
                </div>
              </div>
              <div class="product-item">
                <div class="product-name">CA Objectif</div>
                <div class="product-stats">
                  <span>${formatCurrency(row.revenueTarget)}</span>
                </div>
              </div>
              <div class="product-item">
                <div class="product-name">Avancement</div>
                <div class="product-stats">
                  <span class="badge ${getBadgeClass(row.revenuePercent)}">${row.revenuePercent}%</span>
                  <div class="progress-bar">
                    <div class="progress-fill ${revenueProgressClass}" style="width: ${Math.min(row.revenuePercent, 100)}%"></div>
                  </div>
                </div>
              </div>
              <div class="product-item">
                <div class="product-name">CA/H</div>
                <div class="product-stats">
                  <span><strong>${formatCurrency(row.revenuePerHour)}</strong></span>
                </div>
              </div>
            </div>
      `;
    }
  });
  
  html += `
          </div>
        </div>
  `;
  
  // Section Heures vendues
  html += `
        <div class="section">
          <h2 class="section-title">
            ⏰ Heures Vendues
          </h2>
          <div class="crescendo-grid">
  `;
  
  // Ajouter les cartes pour chaque service
  dashboardData.forEach(row => {
    if (row.service !== 'TOTAL') {
      const hoursProgressClass = row.hoursPercent >= 90 ? 'progress-good' : row.hoursPercent >= 75 ? 'progress-warning' : 'progress-danger';
      
      html += `
            <div class="crescendo-card">
              <h3>${row.service}</h3>
              <div class="product-item">
                <div class="product-name">Heures Réalisées</div>
                <div class="product-stats">
                  <span class="badge ${getBadgeClass(row.hoursPercent)}">${formatNumber(row.hoursSold)}h</span>
                </div>
              </div>
              <div class="product-item">
                <div class="product-name">Heures Objectif</div>
                <div class="product-stats">
                  <span>${formatNumber(row.hoursTarget)}h</span>
                </div>
              </div>
              <div class="product-item">
                <div class="product-name">Avancement</div>
                <div class="product-stats">
                  <span class="badge ${getBadgeClass(row.hoursPercent)}">${row.hoursPercent}%</span>
                  <div class="progress-bar">
                    <div class="progress-fill ${hoursProgressClass}" style="width: ${Math.min(row.hoursPercent, 100)}%"></div>
                  </div>
                </div>
              </div>
              <div class="product-item">
                <div class="product-name">Fact. J-1</div>
                <div class="product-stats">
                  <span>${formatNumber(row.previousDayBilling)}h</span>
                </div>
              </div>
            </div>
      `;
    }
  });
  
  html += `
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>📧 AutoDashboard</strong> - Rapport confidentiel à usage interne</p>
        <p>🤖 Généré automatiquement le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}</p>
        <p>📞 Support technique: <a href="mailto:contact@autodashboard.com" style="color: #4f46e5;">contact@autodashboard.com</a></p>
      </div>
    </div>
  </body>
  </html>
  `;
  
  return html;
}

/**
 * Génère un rapport et le prépare pour l'envoi par email
 */
export async function generateEmailReport(data: MockData, date: Date, site: string): Promise<ReportData> {
  // Simulation optimisée pour la démonstration
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const textReport = generateTextReport(data, date, site);
  const htmlReport = generateHtmlReport(data, date, site);
  
  return {
    text: textReport,
    html: htmlReport,
    subject: `📊 Rapport d'activité ${site} - ${format(date, 'dd/MM/yyyy', { locale: fr })}`
  };
}

/**
 * Télécharge le rapport au format texte
 */
export function downloadTextReport(data: MockData, date: Date, site: string): void {
  const textReport = generateTextReport(data, date, site);
  const blob = new Blob([textReport], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Rapport_${site.replace(/\s+/g, '_')}_${format(date, 'yyyy-MM-dd', { locale: fr })}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}