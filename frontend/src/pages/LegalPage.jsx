const LegalPage = () => {
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: "Georgia, serif", color: "#333", lineHeight: "1.8" }}>
      <h1>Mentions légales</h1>
      <p><strong>Site :</strong> Harmonie Joy — www.harmoniejoy.net</p>
      <p><strong>Contact :</strong> <a href="mailto:contact@felinejoy.com">contact@felinejoy.com</a></p>

      <h2>Édition et direction de publication</h2>
      <p>Harmonie Joy est édité sous ce nom. Le responsable de publication peut être contacté à l’adresse e-mail ci-dessus. Les coordonnées d’identification complémentaires, lorsqu’elles sont requises selon le statut de l’éditeur, sont communiquées sur demande légitime.</p>

      <h2>Hébergement</h2>
      <p>Le site est diffusé via Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>

      <h2>Contenus et responsabilités</h2>
      <p>Les contenus publiés ont une vocation informative. Ils ne remplacent pas un avis médical, vétérinaire, juridique ou professionnel. En cas de symptôme, de douleur, de changement inquiétant ou de question concernant un animal, consultez un professionnel compétent.</p>

      <h2>Liens partenaires</h2>
      <p>Certains liens externes peuvent être des liens partenaires susceptibles de donner lieu à une commission. Cette relation commerciale est distincte du contenu éditorial et ne vaut pas recommandation médicale ou vétérinaire.</p>
    </main>
  );
};

export default LegalPage;
