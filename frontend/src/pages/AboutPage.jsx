import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Georgia, serif', color: '#333', lineHeight: '1.8' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#2d2d2d' }}>À propos de Harmonie Joy</h1>
      <hr style={{ marginBottom: '30px', borderColor: '#eee' }} />

      <p>Harmonie Joy est un média indépendant consacré au bien-être humain, au bien-être félin et aux gestes qui facilitent une cohabitation attentive. Les sujets abordés vont du sommeil et des routines quotidiennes à l’environnement du chat d’intérieur et à la relation humain-animal.</p>

      <h2>Notre méthode éditoriale</h2>
      <p>Nous privilégions les conseils réalisables dans la vie courante et les sources identifiables. Lorsqu’un article traite de santé humaine ou animale, il indique ses références et rappelle les limites de l’information générale. Un article ne remplace ni un diagnostic, ni une consultation avec un médecin, un vétérinaire ou un autre professionnel qualifié.</p>
      <p>Nous ne présentons pas un produit, un complément ou une pratique comme un traitement. Les situations inhabituelles, persistantes ou inquiétantes doivent être discutées avec un professionnel de santé adapté.</p>

      <h2>Indépendance et liens partenaires</h2>
      <p>Harmonie Joy peut percevoir une commission lorsqu’un lecteur effectue un achat après avoir suivi certains liens partenaires. Cette possibilité est signalée à proximité du lien concerné. Elle ne finance pas un avis médical ou vétérinaire et ne change pas notre méthode de sélection éditoriale.</p>

      <h2>Contact</h2>
      <p>
        Pour une question éditoriale, une correction ou une demande relative à vos données, écrivez à{' '}
        <a href="mailto:contact@felinejoy.com" style={{ color: '#6b8f71' }}>contact@felinejoy.com</a>
      </p>
      <p>Consultez aussi notre <Link to="/privacy" style={{ color: '#6b8f71' }}>politique de confidentialité</Link> et nos <Link to="/legal" style={{ color: '#6b8f71' }}>mentions légales</Link>.</p>
    </main>
  );
};

export default AboutPage;
