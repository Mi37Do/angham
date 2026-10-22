import type { Localized } from "../schema";
import type { resourceType } from "../schema";

type SeedResource = {
  /** Unique: the seed updates the resource with this URL. */
  url: string;
  type: (typeof resourceType.enumValues)[number];
  /** Bibliographic title in its original language (shown as-is in every language). */
  title: string;
  author: string | null;
  year: number | null;
  rights: string;
  description: Required<Localized>;
};

const openAccess = "Accès libre, sur le site de l’éditeur";

// Real references consulted for the seed articles. Titles are quoted as their
// publishers give them; anything not stated there (author, year) is left empty.
export const resources: SeedResource[] = [
  {
    url: "https://archives.crem-cnrs.fr/archives/items/CNRSMH_E_2011_002_042_008_003/",
    type: "audio",
    title: "Société littéraire, artistique et musicale (S.L.A.M.) Tlemcen : Nouba Dil",
    author: "Société littéraire, artistique et musicale de Tlemcen",
    year: null,
    rights: "Archives sonores du CREM-CNRS (conditions d’écoute de l’éditeur)",
    description: {
      fr: "Enregistrement ancien d’une nouba dans le mode Dil par une société musicale de Tlemcen, conservé dans les archives sonores du CNRS.",
      ar: "تسجيل قديم لنوبة في طبع الذيل أدّتها جمعية موسيقية تلمسانية، محفوظ في الأرشيف الصوتي للمركز الوطني للبحث العلمي الفرنسي.",
      en: "An early recording of a nouba in the Dil mode by a Tlemcen music society, held in the CNRS sound archives.",
      es: "Grabación antigua de una nuba en el modo Dil por una sociedad musical de Tremecén, conservada en los archivos sonoros del CNRS.",
    },
  },
  {
    url: "https://www.insaniyat.crasc.dz/en/article/analyse-historisante-du-thesaurus-sanaa-gharnata",
    type: "article",
    title: "Analyse historisante du thésaurus Sana’a-Gharnata",
    author: null,
    year: null,
    rights: openAccess,
    description: {
      fr: "Article de la revue Insaniyat (CRASC) qui réexamine l’histoire du répertoire Sana’a-Gharnata et ses anachronismes, et discute la présence de cette musique à Tlemcen avant 1492.",
      ar: "مقال في مجلة «إنسانيات» (مركز البحث في الأنثروبولوجيا الاجتماعية والثقافية) يعيد النظر في تاريخ رصيد الصنعة والغرناطي ومفارقاته الزمنية، ويناقش حضور هذه الموسيقى في تلمسان قبل 1492.",
      en: "An article in the journal Insaniyat (CRASC) re-examining the history of the Sana’a-Gharnata repertoire and its anachronisms, and discussing the presence of this music in Tlemcen before 1492.",
      es: "Artículo de la revista Insaniyat (CRASC) que reexamina la historia del repertorio Sana’a-Gharnata y sus anacronismos, y debate la presencia de esta música en Tremecén antes de 1492.",
    },
  },
  {
    url: "https://cahiers.crasc.dz/pdfs/n_30_el%20hassar_salim.pdf",
    type: "article",
    title: "Les Cahiers du CRASC, n° 30 — contribution de Salim El Hassar",
    author: "Salim El Hassar",
    year: null,
    rights: openAccess,
    description: {
      fr: "Étude sur la tradition poétique et musicale de Tlemcen, qui situe notamment Ahmed Ben Triki dans la lignée des poètes du hawzi.",
      ar: "دراسة حول التقليد الشعري والموسيقي في تلمسان، تضع خصوصًا أحمد بن التريكي في سلسلة شعراء الحوزي.",
      en: "A study of the poetic and musical tradition of Tlemcen, placing Ahmed Ben Triki in particular in the lineage of hawzi poets.",
      es: "Estudio sobre la tradición poética y musical de Tremecén, que sitúa en particular a Ahmed Ben Triki en la línea de los poetas del hawzi.",
    },
  },
  {
    url: "https://journals.univ-msila.dz/index.php/JAPL/article/view/5414",
    type: "article",
    title: "The movement of popular hawzi poetry in the Tlemcen region (Ibn Sahla Boumediene as a model)",
    author: null,
    year: null,
    rights: openAccess,
    description: {
      fr: "Article universitaire (Université de M’Sila) consacré à la poésie populaire hawzi de la région de Tlemcen, à travers l’œuvre de Boumediene Bensahla.",
      ar: "مقال جامعي (جامعة المسيلة) مخصّص للشعر الشعبي الحوزي في منطقة تلمسان، من خلال أعمال بومدين بن سهلة.",
      en: "An academic article (University of M’Sila) on the popular hawzi poetry of the Tlemcen region, through the work of Boumediene Bensahla.",
      es: "Artículo académico (Universidad de M’Sila) dedicado a la poesía popular hawzi de la región de Tremecén, a través de la obra de Boumediene Bensahla.",
    },
  },
  {
    url: "https://dspace.univ-tlemcen.dz/items/3d7cecc8-23f8-48ec-9d5e-40362d6b54cf/full",
    type: "livre",
    title: "A Bridge to the Past, a Story Meant to Last: The Cultural Legacy and Historical Ties Between Al-Andalus and Tlemcen",
    author: null,
    year: null,
    rights: "Dépôt institutionnel de l’Université de Tlemcen",
    description: {
      fr: "Travail universitaire déposé à l’Université de Tlemcen sur l’héritage culturel et les liens historiques entre al-Andalus et Tlemcen.",
      ar: "عمل جامعي مودَع في جامعة تلمسان حول الإرث الثقافي والروابط التاريخية بين الأندلس وتلمسان.",
      en: "A university work deposited at the University of Tlemcen on the cultural legacy and historical ties between al-Andalus and Tlemcen.",
      es: "Trabajo universitario depositado en la Universidad de Tremecén sobre el legado cultural y los vínculos históricos entre al-Ándalus y Tremecén.",
    },
  },
  {
    url: "https://bibliolmc.uniroma3.it/sites/default/files/2019-12/Musica%20arabo-andalusa%20In%20Africa%20settentrionale_2.pdf",
    type: "article",
    title: "Musica arabo-andalusa in Africa settentrionale",
    author: null,
    year: null,
    rights: "Document en ligne, Università Roma Tre",
    description: {
      fr: "Document de l’Université Roma Tre (en italien) sur la musique arabo-andalouse au Maghreb, qui décrit la structure de la nouba et le rôle central du msaddar.",
      ar: "وثيقة من جامعة روما الثالثة (بالإيطالية) حول الموسيقى العربية الأندلسية في المغرب الكبير، تصف بنية النوبة والدور المركزي للمصدّر.",
      en: "A Roma Tre University document (in Italian) on Arab-Andalusian music in North Africa, describing the structure of the nouba and the central role of the msaddar.",
      es: "Documento de la Universidad Roma Tre (en italiano) sobre la música arabo-andalusí en el Norte de África, que describe la estructura de la nuba y el papel central del msaddar.",
    },
  },
  {
    url: "https://ua.edu.lb/Library/Assets/Gallery/AntonineUniversity/rtm-6-2012-chichoune-et-salah-pour-une-semiotique-du-timbre.pdf",
    type: "article",
    title: "Pour une sémiotique du timbre",
    author: "Chichoune et Salah",
    year: 2012,
    rights: "Revue des traditions musicales n° 6, Université Antonine",
    description: {
      fr: "Article de la Revue des traditions musicales qui aborde notamment l’usage du terme « gharnati » pour distinguer l’école de Tlemcen.",
      ar: "مقال في «مجلة التقاليد الموسيقية» يتناول خصوصًا استعمال مصطلح «الغرناطي» لتمييز مدرسة تلمسان.",
      en: "An article in the Revue des traditions musicales that discusses, among other things, the use of the term “gharnati” to distinguish the Tlemcen school.",
      es: "Artículo de la Revue des traditions musicales que aborda, entre otras cosas, el uso del término «gharnati» para distinguir la escuela de Tremecén.",
    },
  },
  {
    url: "https://www.artsrn.ualberta.ca/ccewiki/index.php/North_African_nawba",
    type: "article",
    title: "North African nawba",
    author: "Canadian Centre for Ethnomusicology",
    year: null,
    rights: openAccess,
    description: {
      fr: "Notice du Canadian Centre for Ethnomusicology (Université d’Alberta) sur la nawba maghrébine, ses modes (ṭubūʿ) et leurs correspondances traditionnelles.",
      ar: "تعريف من المركز الكندي للإثنوموسيقى (جامعة ألبرتا) بالنوبة المغاربية وطبوعها ومقابلاتها التقليدية.",
      en: "An entry from the Canadian Centre for Ethnomusicology (University of Alberta) on the North African nawba, its modes (ṭubūʿ) and their traditional correspondences.",
      es: "Ficha del Canadian Centre for Ethnomusicology (Universidad de Alberta) sobre la nawba magrebí, sus modos (ṭubūʿ) y sus correspondencias tradicionales.",
    },
  },
];
