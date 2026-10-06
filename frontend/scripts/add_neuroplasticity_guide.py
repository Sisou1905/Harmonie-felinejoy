from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "data" / "editorialArticles.js"
START_MARKER = "export const editorialArticles = "
END_MARKER = "\n];\n\nexport const editorialArticleBySlug"

ARTICLE = {
    "title": "Neuroplasticité : un carnet de 14 jours pour apprendre avec plus de réalisme",
    "slug": "neuroplasticite-carnet-14-jours-apprendre-realisme",
    "excerpt": "La neuroplasticité décrit la capacité du cerveau à modifier ses réseaux avec l’expérience. Ce guide propose un carnet de 14 jours pour pratiquer une compétence, observer ce qui aide vraiment et éviter les promesses de transformation rapide.",
    "content": "La **neuroplasticité** désigne la capacité du cerveau à ajuster ses connexions et son fonctionnement au fil de l’expérience, de l’apprentissage et de l’environnement. Elle aide à comprendre pourquoi une compétence travaillée peut devenir plus familière. Elle ne permet pas de promettre qu’une pensée positive, un complément ou un programme en ligne guérira une maladie.\n\nCe guide propose un carnet de quatorze jours pour apprendre de façon plus nette. Il ne mesure pas votre cerveau et ne remplace pas un soin. Il vous aide à choisir une compétence, à la pratiquer, à laisser des traces de vos essais et à repérer ce qui mérite d’être ajusté.\n\n## Ce que la neuroplasticité veut vraiment dire\n\nLe cerveau n’est pas figé à l’âge adulte. Les expériences, les apprentissages et les répétitions participent à la modification de réseaux neuronaux. La mémoire repose notamment sur des connexions qui évoluent avec l’expérience, et l’activation répétée d’un réseau peut contribuer à consolider ou à faire oublier une information.\n\nCette idée est utile quand elle reste concrète. Apprendre une recette, retrouver un geste, comprendre un dossier, mémoriser un mot de langue ou reprendre une activité après une interruption demandent du temps, des essais et un retour sur erreur. La plasticité ne supprime pas les limites liées à la fatigue, à une douleur, à un trouble de santé, au stress ou à un manque de sommeil.\n\nLa formule la plus honnête est simple : le cerveau peut s’adapter, mais il ne répond pas à une injonction. Il répond à une expérience répétée, à un contexte et à des conditions de vie qui varient d’une personne à l’autre.\n\n## Ce que ce guide ne promet pas\n\nLa neuroplasticité est parfois utilisée pour vendre des résultats démesurés. Ce mot ne justifie pas de dire qu’une personne pourrait guérir une maladie chronique en changeant ses pensées, ni qu’un produit ou une méthode sans preuve remplacerait un traitement.\n\nUn apprentissage peut devenir plus accessible sans que tout devienne facile. Une personne peut aussi avoir besoin d’un médecin, d’un psychologue, d’un orthophoniste, d’un ergothérapeute, d’un enseignant ou d’un autre professionnel selon la difficulté rencontrée. Chercher un appui adapté fait partie d’une démarche réaliste.\n\nSur Harmonie Joy, le carnet proposé ci dessous sert à observer une pratique. Il ne sert pas à vous juger, à comparer votre cerveau à celui d’une autre personne ou à retarder une consultation.\n\n## Le carnet R E P E R E\n\nLe principe est de revenir chaque jour sur une seule compétence. Vous n’avez pas besoin de consacrer une heure entière au carnet. Dix minutes de pratique attentive peuvent suffire pour commencer. Gardez une feuille, un cahier ou une note privée sur votre téléphone.\n\n### 1. Relever une compétence précise\n\nChoisissez une action que vous pouvez voir ou vérifier. Évitez les objectifs comme « devenir meilleur » ou « retrouver toute mon énergie ». Préférez « expliquer une idée en trois phrases », « mémoriser cinq mots », « faire une marche courte selon mes possibilités » ou « réaliser une étape d’un logiciel sans aide ».\n\nÉcrivez une phrase : « Pendant quatorze jours, je veux pouvoir… ». Ajoutez une limite réaliste. Par exemple : « Je pratique dix minutes après le déjeuner » ou « Je m’arrête si mon corps me dit de ralentir ».\n\nCette étape évite un piège fréquent : changer de méthode chaque jour parce qu’on ne sait pas encore ce que l’on cherche à consolider.\n\n### 2. Essayer avant de vérifier\n\nCommencez par une tentative sans regarder tout de suite votre support. Expliquez la notion à voix haute, écrivez ce dont vous vous souvenez, refaites un geste ou répondez à une question. Ensuite seulement, comparez avec une source fiable, une correction ou une consigne.\n\nNotez une seule chose qui manque. Pas dix. Une erreur précise donne une prochaine action possible. « Je confonds les étapes deux et trois » est plus utile que « je suis nul ».\n\nLe fait de chercher une réponse avant de la relire aide à séparer la familiarité de la capacité à réutiliser une information. Vous ne cherchez pas une performance parfaite. Vous cherchez l’endroit où la pratique doit revenir.\n\n### 3. Pratiquer dans un format un peu différent\n\nRefaire exactement la même chose peut rassurer. Pour vérifier une compétence, changez légèrement le contexte. Si vous avez lu une définition, inventez un exemple. Si vous avez regardé une vidéo, décrivez ensuite les étapes sans l’ouvrir. Si vous avez appris un mot, placez le dans une phrase.\n\nLe changement doit rester petit. L’objectif n’est pas de vous mettre en difficulté pour prouver quelque chose. Il est de voir si vous pouvez utiliser ce que vous avez travaillé hors du support initial.\n\n### 4. Espacer les retours\n\nNe relisez pas tout en boucle le même soir. Laissez un peu de temps puis revenez à votre question. Le lendemain, prenez deux minutes pour rappeler ce qui a été pratiqué. Quelques jours plus tard, refaites un essai bref.\n\nL’espacement fait apparaître ce qui tient réellement. Une réponse oubliée n’est pas un échec moral. C’est une information utile pour la prochaine séance.\n\n### 5. Respecter les conditions du cerveau\n\nLe sommeil, l’activité physique adaptée et les relations sociales font partie des facteurs associés au fonctionnement de la mémoire et à la santé cognitive. Cela ne veut pas dire qu’une bonne nuit résout tout ni qu’une marche remplace un soin. Cela signifie que l’apprentissage se déroule dans un corps entier, avec ses besoins et ses contraintes.\n\nPendant ces quatorze jours, notez seulement un repère sur votre contexte : sommeil suffisant ou non, douleur inhabituelle, journée très chargée, moment calme ou interruption répétée. Ne cherchez pas à contrôler chaque variable. Le but est de repérer une tendance qui vous appartient.\n\nSi une fatigue durable, une tristesse marquée, une douleur, une difficulté d’attention nouvelle ou tout autre symptôme vous inquiète, le carnet ne suffit pas. Parlez en à un professionnel de santé.\n\n### 6. Évaluer sans vous raconter d’histoire\n\nÀ la fin de chaque séance, répondez à quatre questions. Qu’ai je essayé ? Qu’est ce qui a résisté ? Qu’est ce qui m’a aidé ? Quelle action minuscule vais je refaire demain ?\n\nLe dernier jour, relisez vos notes. Cherchez une décision, pas une grande conclusion. Vous pouvez conserver un créneau, raccourcir une séance, demander une explication, changer de support ou faire une pause. Le carnet devient utile quand il débouche sur un choix faisable.\n\n## Un exemple de quatorze jours\n\nLe premier jour, choisissez la compétence et faites un essai très court. Le deuxième jour, corrigez un point précis. Le troisième jour, réessayez sans support. Le quatrième jour, utilisez cette compétence dans un exemple différent. Le cinquième jour, faites une pause ou une version très légère.\n\nDu sixième au dixième jour, alternez pratique courte, rappel sans support et correction. Les jours onze et douze, choisissez l’erreur qui revient le plus souvent. Le treizième jour, demandez si possible un retour à une personne compétente. Le quatorzième jour, faites un dernier essai puis écrivez ce que vous gardez pour la suite.\n\nCette trame est volontairement souple. Une maladie chronique, une période de soin, une douleur, des obligations familiales ou un sommeil perturbé peuvent changer votre disponibilité. Adapter la durée n’annule pas la démarche.\n\n## Trois pièges qui font abandonner trop vite\n\nLe premier piège est de confondre quantité et apprentissage. Passer beaucoup de temps sur un sujet ne dit pas toujours ce que vous pourrez réutiliser demain. Un essai court suivi d’une correction peut être plus révélateur qu’une longue relecture passive.\n\nLe deuxième piège est de chercher la méthode parfaite. Le bon outil est souvent celui que vous pouvez reprendre dans une semaine. Avant d’acheter une application, un complément ou une formation, demandez vous si l’action de base a déjà été tentée : définir une compétence, pratiquer brièvement, vérifier puis revenir plus tard.\n\nLe troisième piège est de prendre une difficulté comme une preuve que rien ne changera. Une difficulté peut avoir de nombreuses causes. Elle peut demander plus de temps, un autre support, du repos ou une aide professionnelle. Elle ne se résume pas à votre volonté.\n\n## Questions fréquentes\n\n### Faut il faire ce carnet tous les jours ?\n\nPas forcément. Quatorze jours donnent un cadre, pas une obligation. Si vous avez besoin de repos, gardez une trace très courte ou reportez la séance. L’important est de revenir à une pratique possible, pas de remplir des cases.\n\n### La neuroplasticité permet elle de soigner une maladie chronique ?\n\nNon. La neuroplasticité décrit des mécanismes d’adaptation du cerveau. Elle ne remplace pas un diagnostic, un traitement, un suivi médical ou l’avis d’un professionnel. Méfiez vous des méthodes qui promettent de guérir une maladie en modifiant seulement votre pensée ou votre routine.\n\n### Quel résultat faut il attendre après quatorze jours ?\n\nAttendez une observation, pas une transformation spectaculaire. Vous pourrez peut être dire quelle pratique vous aide à comprendre, à retenir ou à reprendre une activité. Vous pourrez aussi constater qu’un obstacle reste présent et qu’il faut demander de l’aide. Ces deux résultats sont utiles.\n\n> **Limite importante :** cet article explique un mécanisme général et propose un carnet de pratique. Il ne permet pas de diagnostiquer un trouble neurologique, psychologique ou de l’apprentissage. Il ne remplace pas un médecin, un psychologue, un orthophoniste, un ergothérapeute ou tout autre professionnel compétent. Ne modifiez jamais un traitement à partir de ce guide.",
    "category": "human",
    "image_url": "/images/neuroplasticite-pratique.jpg",
    "sources": [
        {
            "title": "Inserm : Plasticité cérébrale et santé du cerveau",
            "url": "https://www.inserm.fr/actualite/plasticite-cerebrale-et-si-on-soccupait-de-la-sante-de-notre-cerveau/",
        },
        {
            "title": "Inserm : Mémoire",
            "url": "https://www.inserm.fr/dossier/memoire/",
        },
        {
            "title": "Marzola et collègues : Neuroplasticity in Development, Aging, and Neurodegeneration",
            "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10741468/",
        },
        {
            "title": "Conseil scientifique de l Éducation nationale : La métacognition",
            "url": "https://www.csen.education.gouv.fr/publications/la-metacognition/",
        },
    ],
    "tags": [
        "neuroplasticité",
        "apprentissage",
        "mémoire",
        "pratique réaliste",
    ],
    "author": "Sissou, fondatrice d’Harmonie Joy",
    "created_at": "2026-10-06T21:00:00.000Z",
    "updated_at": "2026-10-06T21:00:00.000Z",
    "reading_time": "10",
}


def main() -> None:
    raw = SOURCE.read_text(encoding="utf-8")
    start = raw.index(START_MARKER) + len(START_MARKER)
    end = raw.index(END_MARKER, start) + 2
    articles = json.loads(raw[start:end])
    articles = [article for article in articles if article["slug"] != ARTICLE["slug"]]
    articles.insert(0, ARTICLE)
    replacement = json.dumps(articles, ensure_ascii=False, indent=2)
    source_content = raw[:start] + replacement + raw[end:]
    SOURCE.write_text(source_content, encoding="utf-8")

    forbidden = {"-", "–", "—"}
    if any(character in ARTICLE["content"] for character in forbidden):
        raise ValueError("Article body contains a dash character")
    print(f"Published guide source: {ARTICLE['slug']}")


if __name__ == "__main__":
    main()
