import React from 'react';

const PrivacyPage = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Georgia, serif', color: '#333' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Politique de confidentialité</h1>
      <p style={{ color: '#888', marginBottom: '40px' }}>Dernière mise à jour : mai 2026</p>

      <h2>Éditeur du site</h2>
      <p>Harmonie Joy — harmoniejoy.net<br />
      Contact : contact@felinejoy.com</p>

      <h2>Collecte des données</h2>
      <p>Ce site collecte des données via les formulaires de contact et d'inscription à la newsletter (nom, adresse email). Ces données sont utilisées uniquement pour l'envoi de contenus bien-être et ne sont jamais transmises à des tiers.</p>

      <h2>Cookies et publicités</h2>
      <p>Ce site utilise Google AdSense pour afficher des publicités. Google peut utiliser des cookies pour personnaliser les annonces affichées selon vos centres d'intérêt. Vous pouvez désactiver ces cookies via les paramètres de votre navigateur ou via <a href="http://aboutads.info" target="_blank" rel="noreferrer">aboutads.info</a>.</p>

      <h2>Google Analytics</h2>
      <p>Ce site utilise Google Analytics pour analyser le trafic de manière anonyme. Aucune donnée personnelle identifiable n'est collectée.</p>

      <h2>Vos droits</h2>
      <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour toute demande : contact@felinejoy.com</p>

      <h2>Hébergement</h2>
      <p>Ce site est hébergé par Vercel Inc. (frontend) et Render (backend API), deux services conformes aux standards de sécurité internationaux.</p>
    </div>
  );
};

export default PrivacyPage;
