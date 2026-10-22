// Les huit rubriques principales du site (voir AGENTS.md).
// Les slugs sont communs à toutes les langues ; les libellés viennent des dictionnaires.
export const sections = [
  "patrimoine",
  "bibliotheque",
  "recherche",
  "evenements",
  "publications",
  "association",
  "contact",
] as const;

export type Section = (typeof sections)[number];

export const isSection = (value: string): value is Section =>
  (sections as readonly string[]).includes(value);

// Rubriques éditoriales (rendues par app/[lang]/[section]) : pour chaque
// sous-rubrique, dans l’ordre des `items` du dictionnaire, les articles liés.
export const editorialSections = {
  patrimoine: [
    ["de-cordoue-a-tlemcen-aux-origines-de-la-musique-andalouse"],
    ["tlemcen-alger-constantine-trois-ecoles-un-heritage", "les-tbou-modes-de-l-ecole-de-tlemcen"],
    ["anatomie-d-une-nouba-tlemcenienne", "le-hawzi-la-poesie-chantee-de-tlemcen"],
    ["les-instruments-de-l-orchestre-gharnati"],
    ["cheikh-larbi-bensari-le-patriarche-de-l-ecole-de-tlemcen", "abdelkrim-dali-de-tlemcen-a-radio-alger"],
    ["abdelkrim-dali-de-tlemcen-a-radio-alger", "tlemcen-alger-constantine-trois-ecoles-un-heritage"],
  ],
  recherche: [[], [], [], [], ["tlemcen-alger-constantine-trois-ecoles-un-heritage"], [], []],
  association: [[], [], [], [], [], []],
} satisfies Partial<Record<Section, string[][]>>;

export type EditorialSection = keyof typeof editorialSections;
