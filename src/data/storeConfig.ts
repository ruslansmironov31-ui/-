export type Language = 'ru' | 'ky';
export type CityId = 'kyzyl-kiya' | 'kadamjay';
export type CategoryId =
  | 'combo'
  | 'sets'
  | 'rolls'
  | 'pizza'
  | 'burgers'
  | 'wok'
  | 'drinks'
  | 'sauces';

export interface BranchConfig {
  id: CityId;
  name: Record<Language, string>;
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string; // формат 996XXXXXXXXX для https://wa.me/
  address: Record<Language, string>;
  hours: Record<Language, string>;
}

export interface DeliveryConfig {
  freeFrom: number;
  fee: number;
  currency: Record<Language, string>;
}

export interface PromoSlide {
  id: string;
  badge: Record<Language, string>;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  cta: Record<Language, string>;
  targetCategory: CategoryId | 'all';
  image: string;
}

export interface CategoryInfo {
  id: CategoryId;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  image: string;
}

export interface MenuVariant {
  id: string;
  label: Record<Language, string>;
  price: number;
}

export interface MenuItem {
  id: string;
  category: CategoryId;
  name: Record<Language, string>;
  description: Record<Language, string>;
  meta?: Record<Language, string>; // вес / количество штук
  price: number;
  variants?: MenuVariant[];
  image: string;
}

// ============================================================================
// НАСТРОЙКИ КАФЕ (редактируйте номера WhatsApp, телефоны, адреса и доставку)
// ============================================================================

export const DELIVERY_CONFIG: DeliveryConfig = {
  freeFrom: 1000,
  fee: 100,
  currency: {
    ru: 'сом',
    ky: 'сом',
  },
};

export const INSTAGRAM_HANDLE = 'sushistore_kg';
export const INSTAGRAM_URL = 'https://www.instagram.com/sushistore_kg';

export const BRANCHES: Record<CityId, BranchConfig> = {
  'kyzyl-kiya': {
    id: 'kyzyl-kiya',
    name: {
      ru: 'Кызыл-Кия',
      ky: 'Кызыл-Кыя',
    },
    phoneDisplay: '0221 300 777',
    phoneHref: 'tel:+996221300777',
    whatsappNumber: '996221300777',
    address: {
      ru: 'г. Кызыл-Кия, центральный филиал (ул. Асаналиева / центр)',
      ky: 'Кызыл-Кыя ш., борбордук филиал (Асаналиев көч. / борбор)',
    },
    hours: {
      ru: 'Ежедневно 11:00–00:00',
      ky: 'Күн сайын 11:00–00:00',
    },
  },
  kadamjay: {
    id: 'kadamjay',
    name: {
      ru: 'Кадамжай',
      ky: 'Кадамжай',
    },
    phoneDisplay: '0998 544 444',
    phoneHref: 'tel:+996998544444',
    whatsappNumber: '996998544444',
    address: {
      ru: 'г. Кадамжай, центральный филиал (центр города)',
      ky: 'Кадамжай ш., борбордук филиал (шаардын борбору)',
    },
    hours: {
      ru: 'Ежедневно 11:00–00:00',
      ky: 'Күн сайын 11:00–00:00',
    },
  },
};

// ============================================================================
// СЛАЙДЫ АКЦИЙ ВЕРХНЕГО БАННЕРА
// ============================================================================

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'happy-hour-sets',
    badge: {
      ru: 'Акция дня · 10:00–17:00',
      ky: 'Күндүн акциясы · 10:00–17:00',
    },
    title: {
      ru: 'Сеты «Кызыл-Кыя 1 и 2» по спеццене до 17:00',
      ky: '«Кызыл-Кыя Сет 1 жана 2» саат 17:00гө чейин арзандатуу менен',
    },
    subtitle: {
      ru: 'Кызыл-Кыя Сет 1 (70 шт.) — 1200 сом вместо 1500 сом. Кызыл-Кыя Сет 2 (82 шт.) — 1500 сом вместо 2000 сом.',
      ky: 'Кызыл-Кыя Сет 1 (70 даана) — 1500 сомдун ордуна 1200 сом. Кызыл-Кыя Сет 2 (82 даана) — 2000 сомдун ордуна 1500 сом.',
    },
    cta: {
      ru: 'Смотреть сеты',
      ky: 'Сеттерди көрүү',
    },
    targetCategory: 'sets',
    image: '/src/assets/images/promo_sushi_feast_1795661183084.jpg',
  },
  {
    id: 'free-delivery',
    badge: {
      ru: 'Доставка по городу',
      ky: 'Шаар ичинде жеткирүү',
    },
    title: {
      ru: 'Бесплатная доставка при заказе от 1000 сом',
      ky: '1000 сомдон жогору буйрутмаларга акысыз жеткирүү',
    },
    subtitle: {
      ru: 'Доставляем горячую пиццу, свежие роллы, комбо и бургеры каждый день с 11:00 до 00:00. До 1000 сом доставка — 100 сом.',
      ky: 'Ысык пицца, жаңы роллдор, комбо жана бургерлерди күн сайын 11:00дөн 00:00гө чейин жеткиребиз. 1000 сомго чейин — 100 сом.',
    },
    cta: {
      ru: 'Выбрать комбо',
      ky: 'Комбо тандоо',
    },
    targetCategory: 'combo',
    image: '/src/assets/images/cat_combo_1795661183639.jpg',
  },
  {
    id: 'take-away',
    badge: {
      ru: 'Take away or order',
      ky: 'Алып кетүү же жеткирүү',
    },
    title: {
      ru: 'Удобный самовывоз из филиала вашего города',
      ky: 'Өз шаарыңыздагы филиалдан ыңгайлуу алып кетүү',
    },
    subtitle: {
      ru: 'Оформите заказ на сайте заранее, и мы приготовим всё к вашему приходу — без очередей и лишнего ожидания.',
      ky: 'Сайттан алдын ала буйрутма бериңиз — келгениңизде баары даяр болот, кезек күтпөйсүз.',
    },
    cta: {
      ru: 'Перейти к меню',
      ky: 'Менюга өтүү',
    },
    targetCategory: 'rolls',
    image: '/src/assets/images/cat_sets_1795661183874.jpg',
  },
];

// ============================================================================
// КАТЕГОРИИ МЕНЮ
// ============================================================================

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'combo',
    title: { ru: 'Комбо', ky: 'Комбо' },
    subtitle: { ru: 'Роллы + пицца + напиток', ky: 'Ролл + пицца + суусундук' },
    image: '/images/combo-3.webp',
  },
  {
    id: 'sets',
    title: { ru: 'Сеты', ky: 'Сеттер' },
    subtitle: { ru: 'Наборы для компании', ky: 'Чоң топтор үчүн топтомдор' },
    image: '/images/set-california-grill.webp',
  },
  {
    id: 'rolls',
    title: { ru: 'Роллы', ky: 'Роллдор' },
    subtitle: { ru: 'Классика и авторские', ky: 'Классикалык роллдор' },
    image: '/images/roll-fila.webp',
  },
  {
    id: 'pizza',
    title: { ru: 'Пицца', ky: 'Пицца' },
    subtitle: { ru: 'Горячая пицца 35 см', ky: 'Ысык пицца 35 см' },
    image: '/images/pizza-pepperoni.webp',
  },
  {
    id: 'burgers',
    title: { ru: 'Бургеры и снеки', ky: 'Бургерлер жана снектер' },
    subtitle: { ru: 'Бургеры, крылышки, фри', ky: 'Бургерлер, канатчалар, фри' },
    image: '/images/burger-chef.webp',
  },
  {
    id: 'wok',
    title: { ru: 'Вок и рамен', ky: 'Вок жана рамен' },
    subtitle: { ru: 'Лапша вок и рамен', ky: 'Вок кесмеси жана рамен' },
    image: '/images/wok-thai.webp',
  },
  {
    id: 'drinks',
    title: { ru: 'Напитки', ky: 'Суусундуктар' },
    subtitle: { ru: 'Охлаждённые напитки 1 л', ky: 'Муздак суусундуктар 1 л' },
    image: '/images/drink-retro-cola.webp',
  },
  {
    id: 'sauces',
    title: { ru: 'Соусы', ky: 'Соустар' },
    subtitle: { ru: 'Соевый, терияки, васаби', ky: 'Соя, терияки, васаби' },
    image: '/images/sauce-soy.webp',
  },
];

// ============================================================================
// ДЕМО-МЕНЮ SUSHI STORE (единый массив: легко добавлять и редактировать позиции)
// Чтобы заменить фото, положите файл в /images (в папке public/images) и укажите имя в поле image
// ============================================================================

export const MENU_ITEMS: MenuItem[] = [
  // ---------------- КОМБО ----------------
  {
    id: 'combo-3',
    category: 'combo',
    name: { ru: 'Комбо 3', ky: 'Комбо 3' },
    meta: { ru: '32 шт. роллы · 1 пицца · 1 Ретро Кола · 100 г фри', ky: '32 даана ролл · 1 пицца · 1 Ретро Кола · 100 г фри' },
    description: {
      ru: 'Темпура, кани фила, фила лайт, сурими яки, горячая пицца, напиток и картофель фри',
      ky: 'Темпура, кани фила, фила лайт, сурими яки, ысык пицца, суусундук жана картошка фри',
    },
    price: 1800,
    image: '/images/combo-3.webp',
  },
  {
    id: 'combo-6',
    category: 'combo',
    name: { ru: 'Комбо 6', ky: 'Комбо 6' },
    meta: { ru: '32 шт. роллы · 1 пицца · 1 Ретро Кола', ky: '32 даана ролл · 1 пицца · 1 Ретро Кола' },
    description: {
      ru: 'Ассорти роллов с лососем и крабом, пицца 35 см и охлаждённая Ретро Кола',
      ky: 'Лосось жана краб кошулган роллдор, 35 см пицца жана муздак Ретро Кола',
    },
    price: 1500,
    image: '/images/combo-6.webp',
  },
  {
    id: 'combo-8',
    category: 'combo',
    name: { ru: 'Комбо 8', ky: 'Комбо 8' },
    meta: { ru: '16 шт. роллы · 1 пицца · 1 Ретро Кола', ky: '16 даана ролл · 1 пицца · 1 Ретро Кола' },
    description: {
      ru: 'Лососевые и запечённые роллы, горячая пицца Пепперони и Ретро Кола',
      ky: 'Лосось жана бышырылган роллдор, ысык Пепперони пиццасы жана Ретро Кола',
    },
    price: 1300,
    image: '/images/combo-8.webp',
  },
  {
    id: 'combo-semya',
    category: 'combo',
    name: { ru: 'Комбо Семья', ky: 'Комбо Үй-бүлө' },
    meta: { ru: '32 шт. роллы · 1 пицца · 1 чиккен · 100 г фри · 1 Ретро Кола', ky: '32 ролл · 1 пицца · 1 чиккен · 100 г фри · 1 Ретро Кола' },
    description: {
      ru: 'Большой набор для компании: роллы, пицца, хрустящая курочка, фри и напиток',
      ky: 'Чоң топтом: роллдор, пицца, кытырак тоок эти, фри жана суусундук',
    },
    price: 1900,
    image: '/images/combo-semya.webp',
  },

  // ---------------- СЕТЫ ----------------
  {
    id: 'set-california-grill',
    category: 'sets',
    name: { ru: 'Калифорния Гриль', ky: 'Калифорния Гриль' },
    meta: { ru: '24 шт. · 660 г', ky: '24 даана · 660 г' },
    description: {
      ru: 'Калифорния гриль спайси, Калифорния гриль чиз, Калифорния гриль мотояки',
      ky: 'Калифорния гриль спайси, Калифорния гриль чиз, Калифорния гриль мотояки',
    },
    price: 900,
    image: '/images/set-california-grill.webp',
  },
  {
    id: 'set-teplyi',
    category: 'sets',
    name: { ru: 'Теплый сет', ky: 'Жылуу сет' },
    meta: { ru: '15 шт. · 500 г', ky: '15 даана · 500 г' },
    description: {
      ru: 'Горячие роллы Америка, Чизкунсай и Сяке хотто в хрустящей панировке',
      ky: 'Кытырак панировкадагы Америка, Чизкунсай жана Сяке хотто ысык роллдору',
    },
    price: 800,
    image: '/images/set-teplyi.webp',
  },
  {
    id: 'set-take',
    category: 'sets',
    name: { ru: 'Такэ сет', ky: 'Такэ сет' },
    meta: { ru: '24 шт. · 565 г', ky: '24 даана · 565 г' },
    description: {
      ru: 'Дракон с угрём, Филадельфия с лососем и Калифорния с крабом',
      ky: 'Жылан балык кошулган Дракон, Филадельфия жана Краб кошулган Калифорния',
    },
    price: 1100,
    image: '/images/set-take.webp',
  },
  {
    id: 'set-kosta',
    category: 'sets',
    name: { ru: 'Коста сет', ky: 'Коста сет' },
    meta: { ru: '40 шт. · 980 г', ky: '40 даана · 980 г' },
    description: {
      ru: 'Сурими яки, Вулкан, Унаги мотояки, Аляска и Гудзон',
      ky: 'Сурими яки, Вулкан, Унаги мотояки, Аляска жана Гудзон',
    },
    price: 1300,
    image: '/images/set-kosta.webp',
  },

  // ---------------- РОЛЛЫ ----------------
  {
    id: 'roll-california-crab',
    category: 'rolls',
    name: { ru: 'Калифорния с крабом', ky: 'Краб кошулган Калифорния' },
    meta: { ru: '8 шт.', ky: '8 даана' },
    description: {
      ru: 'Краб-микс, свежий огурец, спелый авокадо и икра тобико',
      ky: 'Краб-микс, жаңы бадыраң, авокадо жана тобико икрасы',
    },
    price: 299,
    image: '/images/roll-california-crab.webp',
  },
  {
    id: 'roll-fila',
    category: 'rolls',
    name: { ru: 'Фила', ky: 'Фила' },
    meta: { ru: '8 шт.', ky: '8 даана' },
    description: {
      ru: 'Лосось, нежный сливочный сыр креметте и огурец',
      ky: 'Лосось, назик креметте сыры жана бадыраң',
    },
    price: 450,
    image: '/images/roll-fila.webp',
  },
  {
    id: 'roll-drakon',
    category: 'rolls',
    name: { ru: 'Дракон', ky: 'Дракон' },
    meta: { ru: '8 шт.', ky: '8 даана' },
    description: {
      ru: 'Копчёный угорь, лосось, сыр креметте, огурец, кунжут и соус унаги',
      ky: 'Ышталган жылан балык, лосось, креметте сыры, бадыраң, күнжүт жана унаги соусу',
    },
    price: 450,
    image: '/images/roll-drakon.webp',
  },
  {
    id: 'roll-syake-phila',
    category: 'rolls',
    name: { ru: 'Сяке Филадельфия', ky: 'Сяке Филадельфия' },
    meta: { ru: '8 шт.', ky: '8 даана' },
    description: {
      ru: 'Свежий атлантический лосось, сыр креметте и авокадо',
      ky: 'Жаңы лосось, креметте сыры жана авокадо',
    },
    price: 500,
    image: '/images/roll-syake-phila.webp',
  },

  // ---------------- ПИЦЦА (35 см) ----------------
  {
    id: 'pizza-pepperoni',
    category: 'pizza',
    name: { ru: 'Пепперони', ky: 'Пепперони' },
    meta: { ru: '35 см', ky: '35 см' },
    description: {
      ru: 'Пепперони из цыплёнка, тянущаяся моцарелла и томатный соус',
      ky: 'Тоок пепперониси, моцарелла сыры жана томат соусу',
    },
    price: 500,
    image: '/images/pizza-pepperoni.webp',
  },
  {
    id: 'pizza-ovoshnaya',
    category: 'pizza',
    name: { ru: 'Овощная с грибами', ky: 'Козу карындуу жашылча пицца' },
    meta: { ru: '35 см', ky: '35 см' },
    description: {
      ru: 'Шампиньоны, томаты, болгарский перец, оливки, лук и моцарелла',
      ky: 'Козу карын, помидор, болгар калемпири, зайтун, пияз жана моцарелла',
    },
    price: 500,
    image: '/images/pizza-ovoshnaya.webp',
  },
  {
    id: 'pizza-cheese-chicken',
    category: 'pizza',
    name: { ru: 'Сырный цыплёнок', ky: 'Сырдуу жөжө' },
    meta: { ru: '35 см', ky: '35 см' },
    description: {
      ru: 'Цыплёнок, моцарелла, чеддер, пармезан, томаты и сырный соус альфредо',
      ky: 'Тоок эти, моцарелла, чеддер, пармезан, помидор жана альфредо соусу',
    },
    price: 600,
    image: '/images/pizza-cheese-chicken.webp',
  },
  {
    id: 'pizza-double-pepperoni',
    category: 'pizza',
    name: { ru: 'Двойной пепперони', ky: 'Кош пепперони' },
    meta: { ru: '35 см', ky: '35 см' },
    description: {
      ru: 'Двойная порция пепперони, сыр моцарелла и томатный соус',
      ky: 'Кош порция пепперони, моцарелла сыры жана томат соусу',
    },
    price: 700,
    image: '/images/pizza-double-pepperoni.webp',
  },

  // ---------------- БУРГЕРЫ И СНЕКИ ----------------
  {
    id: 'burger-chef',
    category: 'burgers',
    name: { ru: 'Шеф бургер', ky: 'Шеф бургер' },
    meta: { ru: '1 шт.', ky: '1 даана' },
    description: {
      ru: 'Булочка с кунжутом, хрустящая куриная котлета, маринованные огурцы и соус',
      ky: 'Күнжүттүү булочка, кытырак тоок эти, маринаддалган бадыраң жана соус',
    },
    price: 250,
    image: '/images/burger-chef.webp',
  },
  {
    id: 'burger-cheese',
    category: 'burgers',
    name: { ru: 'Чизбургер', ky: 'Чизбургер' },
    meta: { ru: '1 шт.', ky: '1 даана' },
    description: {
      ru: 'Булочка с кунжутом, острые куриные стрипсы, сыр чеддер и свежий салат',
      ky: 'Күнжүттүү булочка, ачуу тоок стрипстери, чеддер сыры жана салат',
    },
    price: 250,
    image: '/images/burger-cheese.webp',
  },
  {
    id: 'wings-12',
    category: 'burgers',
    name: { ru: 'Крылышки 12 шт.', ky: 'Канатчалар 12 даана' },
    meta: { ru: '12 шт. · 360 г', ky: '12 даана · 360 г' },
    description: {
      ru: 'Острые золотистые куриные крылышки в хрустящей панировке',
      ky: 'Кытырак панировкадагы ачуу тоок канатчалары',
    },
    price: 600,
    image: '/images/wings-12.webp',
  },
  {
    id: 'fries-100g',
    category: 'burgers',
    name: { ru: 'Фри 100 г', ky: 'Фри 100 г' },
    meta: { ru: '100 г', ky: '100 г' },
    description: {
      ru: 'Горячий хрустящий картофель фри с солью',
      ky: 'Туздалган ысык кытырак картошка фри',
    },
    price: 200,
    image: '/images/fries-100g.webp',
  },

  // ---------------- ВОК И РАМЕН ----------------
  {
    id: 'wok-thai',
    category: 'wok',
    name: { ru: 'Вок по-тайски', ky: 'Тайча вок' },
    meta: { ru: '1 порция', ky: '1 порция' },
    description: {
      ru: 'Пшеничная лапша, говядина, устричный соус, овощи микс и маринованный бамбук',
      ky: 'Буудай кесмеси, уй эти, устрица соусу, жашылчалар жана бамбук',
    },
    price: 400,
    image: '/images/wok-thai.webp',
  },
  {
    id: 'wok-chinese',
    category: 'wok',
    name: { ru: 'Вок по-китайски', ky: 'Кытайча вок' },
    meta: { ru: '1 порция', ky: '1 порция' },
    description: {
      ru: 'Пшеничная лапша, говядина, кисло-сладкий соус, овощи микс и чеснок',
      ky: 'Буудай кесмеси, уй эти, кычкыл-таттуу соус, жашылчалар жана сарымсак',
    },
    price: 400,
    image: '/images/wok-chinese.webp',
  },
  {
    id: 'ramen-cheese',
    category: 'wok',
    name: { ru: 'Рамен с сыром', ky: 'Сырдуу рамен' },
    meta: { ru: '1 порция', ky: '1 порция' },
    description: {
      ru: 'Насыщенный чан рамен с расплавленным сыром, яйцом и зелёным луком',
      ky: 'Эритилген сыр, жумуртка жана көк пияз кошулган ысык чан рамен',
    },
    price: 400,
    image: '/images/ramen-cheese.webp',
  },

  // ---------------- НАПИТКИ (1 л) ----------------
  {
    id: 'drink-retro-cola',
    category: 'drinks',
    name: { ru: 'Ретро Кола', ky: 'Ретро Кола' },
    meta: { ru: '1 л', ky: '1 л' },
    description: {
      ru: 'Охлаждённый газированный напиток со вкусом колы',
      ky: 'Муздак газдалган кола суусундугу',
    },
    price: 100,
    image: '/images/drink-retro-cola.webp',
  },
  {
    id: 'drink-salam-fanta',
    category: 'drinks',
    name: { ru: 'Салам Фанта', ky: 'Салам Фанта' },
    meta: { ru: '1 л', ky: '1 л' },
    description: {
      ru: 'Освежающий апельсиновый газированный напиток',
      ky: 'Сергитүүчү апельсин газдалган суусундугу',
    },
    price: 100,
    image: '/images/drink-salam-fanta.webp',
  },
  {
    id: 'drink-salam-pepsi',
    category: 'drinks',
    name: { ru: 'Салам Пепси', ky: 'Салам Пепси' },
    meta: { ru: '1 л', ky: '1 л' },
    description: {
      ru: 'Охлаждённый газированный напиток Салам',
      ky: 'Муздак газдалган Салам суусундугу',
    },
    price: 100,
    image: '/images/drink-salam-pepsi.webp',
  },

  // ---------------- СОУСЫ ----------------
  {
    id: 'sauce-soy',
    category: 'sauces',
    name: { ru: 'Соевый', ky: 'Соя соусу' },
    meta: { ru: '20 г', ky: '20 г' },
    description: {
      ru: 'Классический соевый соус для суши и роллов',
      ky: 'Суши жана роллдор үчүн классикалык соя соусу',
    },
    price: 20,
    image: '/images/sauce-soy.webp',
  },
  {
    id: 'sauce-teriyaki',
    category: 'sauces',
    name: { ru: 'Терияки', ky: 'Терияки соусу' },
    meta: { ru: '20 г', ky: '20 г' },
    description: {
      ru: 'Сладковатый густой соус терияки с кунжутом',
      ky: 'Күнжүт кошулган таттуу-коую терияки соусу',
    },
    price: 20,
    image: '/images/sauce-teriyaki.webp',
  },
  {
    id: 'sauce-ginger',
    category: 'sauces',
    name: { ru: 'Имбирь', ky: 'Имбирь' },
    meta: { ru: '20 г', ky: '20 г' },
    description: {
      ru: 'Маринованный розовый имбирь',
      ky: 'Маринаддалган кызгылт имбирь',
    },
    price: 20,
    image: '/images/sauce-ginger.webp',
  },
  {
    id: 'sauce-wasabi',
    category: 'sauces',
    name: { ru: 'Васаби', ky: 'Васаби' },
    meta: { ru: '20 г', ky: '20 г' },
    description: {
      ru: 'Острый японский васаби',
      ky: 'Ачуу жапон васабиси',
    },
    price: 20,
    image: '/images/sauce-wasabi.webp',
  },
];

// ============================================================================
// СЛОВАРЬ ИНТЕРФЕЙСА (РУССКИЙ / КЫРГЫЗСКИЙ)
// ============================================================================

export const UI_TEXT: Record<
  Language,
  {
    topBarDelivery: string;
    cityLabel: string;
    chooseCityTitle: string;
    chooseCitySubtitle: string;
    searchPlaceholder: string;
    searchButtonLabel: string;
    clearSearch: string;
    allCategories: string;
    menuHeading: string;
    menuSubheading: string;
    dishesHeading: string;
    searchResultsHeading: (q: string) => string;
    itemsCount: (n: number) => string;
    addToCart: string;
    cartTitle: string;
    cartEmptyTitle: string;
    cartEmptySubtitle: string;
    goToMenu: string;
    subtotal: string;
    deliveryLabel: string;
    deliveryFree: string;
    freeDeliveryHint: (left: number) => string;
    freeDeliveryAchieved: string;
    totalLabel: string;
    cartTermsNote: string;
    clearCart: string;
    orderFormTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    receiveMethodLabel: string;
    deliveryOption: string;
    pickupOption: string;
    pickupAddressPrefix: string;
    addressLabel: string;
    addressPlaceholder: string;
    paymentMethodLabel: string;
    cashOption: string;
    transferOption: string;
    commentLabel: string;
    commentPlaceholder: string;
    orderWhatsappBtn: string;
    copyOrderBtn: string;
    copiedFeedback: string;
    orderSentHint: string;
    orderReadySubtitle: string;
    openWhatsappAgain: string;
    orderSentConfirmBtn: string;
    backToCartEditBtn: string;
    errAddress: string;
    contactsTitle: string;
    contactsSubtitle: string;
    deliveryTermsTitle: string;
    deliveryTermsBody: string;
    callBtn: string;
    whatsappBtn: string;
    cartButtonShort: string;
    nothingFoundTitle: string;
    nothingFoundSubtitle: string;
    resetFilters: string;
    prevSlide: string;
    nextSlide: string;
    close: string;
    selectedCityActive: string;
    switchCity: string;
  }
> = {
  ru: {
    topBarDelivery:
      'Работаем ежедневно 11:00–00:00 · Бесплатная доставка от 1000 сом (до 1000 — 100 сом)',
    cityLabel: 'Город',
    chooseCityTitle: 'Выберите ваш город',
    chooseCitySubtitle:
      'От города зависит номер WhatsApp, контакты филиала и адрес самовывоза',
    searchPlaceholder: 'Поиск блюд...',
    searchButtonLabel: 'Найти',
    clearSearch: 'Очистить',
    allCategories: 'Все меню',
    menuHeading: 'Категории меню',
    menuSubheading: 'Нажмите на раздел, чтобы быстро открыть блюда',
    dishesHeading: 'Блюда и цены',
    searchResultsHeading: (q) => `Результаты поиска: «${q}»`,
    itemsCount: (n) => `${n} поз.`,
    addToCart: 'В корзину',
    cartTitle: 'Ваш заказ',
    cartEmptyTitle: 'Корзина пока пуста',
    cartEmptySubtitle:
      'Добавьте роллы, сет, пиццу или комбо из меню — оформление займёт пару секунд.',
    goToMenu: 'Выбрать блюда',
    subtotal: 'Сумма заказа',
    deliveryLabel: 'Доставка',
    deliveryFree: 'Бесплатно',
    freeDeliveryHint: (left) => `Добавьте ещё на ${left} сом для бесплатной доставки`,
    freeDeliveryAchieved: 'Бесплатная доставка применена',
    totalLabel: 'Итого к оплате',
    cartTermsNote: 'Ежедневно 11:00–00:00 · Бесплатная доставка от 1000 сом, до 1000 — 100 сом',
    clearCart: 'Очистить',
    orderFormTitle: 'Данные для заказа',
    nameLabel: 'Имя',
    namePlaceholder: 'Как вас называть? (необязательно)',
    receiveMethodLabel: 'Способ получения',
    deliveryOption: 'Доставка',
    pickupOption: 'Самовывоз',
    pickupAddressPrefix: 'Адрес самовывоза:',
    addressLabel: 'Адрес доставки',
    addressPlaceholder: 'Улица, дом, квартира или ориентир',
    paymentMethodLabel: 'Способ оплаты',
    cashOption: 'Наличные',
    transferOption: 'Перевод (МБанк / О!Деньги)',
    commentLabel: 'Комментарий (необязательно)',
    commentPlaceholder: 'Количество персон, сдача, код домофона...',
    orderWhatsappBtn: 'Заказать',
    copyOrderBtn: 'Скопировать текст заказа',
    copiedFeedback: 'Текст заказа скопирован!',
    orderSentHint: 'Нажмите "Отправить" в WhatsApp, чтобы заказ дошёл до кафе',
    orderReadySubtitle:
      'Если WhatsApp не открылся или нужно отправить повторно, используйте кнопки ниже.',
    openWhatsappAgain: 'Открыть WhatsApp снова',
    orderSentConfirmBtn: 'Заказ отправлен',
    backToCartEditBtn: 'Вернуться к корзине',
    errAddress: 'Укажите адрес доставки',
    contactsTitle: 'Филиалы и контакты',
    contactsSubtitle: 'Принимаем заказы на доставку и самовывоз каждый день без выходных',
    deliveryTermsTitle: 'Условия доставки и оплаты',
    deliveryTermsBody:
      'Ежедневно с 11:00 до 00:00. При заказе от 1000 сом доставка по городу бесплатная, при заказе до 1000 сом — 100 сом. Оплата наличными курьеру или переводом.',
    callBtn: 'Позвонить',
    whatsappBtn: 'WhatsApp',
    cartButtonShort: 'Корзина',
    nothingFoundTitle: 'Ничего не найдено',
    nothingFoundSubtitle: 'Попробуйте изменить запрос или сбросить поиск.',
    resetFilters: 'Показать всё меню',
    prevSlide: 'Предыдущий слайд',
    nextSlide: 'Следующий слайд',
    close: 'Закрыть',
    selectedCityActive: 'Выбран сейчас',
    switchCity: 'Выбрать филиал',
  },
  ky: {
    topBarDelivery:
      'Күн сайын 11:00–00:00 · 1000 сомдон жогору акысыз жеткирүү (1000гө чейин — 100 сом)',
    cityLabel: 'Шаар',
    chooseCityTitle: 'Шаарыңызды тандаңыз',
    chooseCitySubtitle:
      'Тандалган шаарга жараша WhatsApp номери, байланыш жана алып кетүү дареги көрсөтүлөт',
    searchPlaceholder: 'Тамак издөө...',
    searchButtonLabel: 'Издөө',
    clearSearch: 'Тазалоо',
    allCategories: 'Бардык меню',
    menuHeading: 'Меню бөлүмдөрү',
    menuSubheading: 'Тамактарды ачуу үчүн бөлүмдү басыңыз',
    dishesHeading: 'Тамактар жана баалар',
    searchResultsHeading: (q) => `Издөө жыйынтыгы: «${q}»`,
    itemsCount: (n) => `${n} түр`,
    addToCart: 'Себетке',
    cartTitle: 'Сиздин буйрутма',
    cartEmptyTitle: 'Себет азырынча бош',
    cartEmptySubtitle:
      'Менюдан ролл, сет, пицца же комбо тандаңыз — буйрутма берүү болгону бир нече секунд алат.',
    goToMenu: 'Тамак тандоо',
    subtotal: 'Тамактардын суммасы',
    deliveryLabel: 'Жеткирүү',
    deliveryFree: 'Акысыз',
    freeDeliveryHint: (left) => `Акысыз жеткирүү үчүн дагы ${left} сомго кошуңуз`,
    freeDeliveryAchieved: 'Акысыз жеткирүү кошулду',
    totalLabel: 'Жалпы төлөм',
    cartTermsNote: 'Күн сайын 11:00–00:00 · 1000 сомдон жогору акысыз, 1000гө чейин — 100 сом',
    clearCart: 'Тазалоо',
    orderFormTitle: 'Буйрутма маалыматтары',
    nameLabel: 'Атыңыз',
    namePlaceholder: 'Сизге кандай кайрылалы? (милдеттүү эмес)',
    receiveMethodLabel: 'Алуу ыкмасы',
    deliveryOption: 'Жеткирүү',
    pickupOption: 'Өзү алып кетүү',
    pickupAddressPrefix: 'Алып кетүү дареги:',
    addressLabel: 'Жеткирүү дареги',
    addressPlaceholder: 'Көчө, үй, батир же багыттама',
    paymentMethodLabel: 'Төлөө ыкмасы',
    cashOption: 'Накталай',
    transferOption: 'Которуу (МБанк / О!Деньги)',
    commentLabel: 'Комментарий (милдеттүү эмес)',
    commentPlaceholder: 'Адам саны, кайтарым акча ж.б.',
    orderWhatsappBtn: 'Буйрутма берүү',
    copyOrderBtn: 'Буйрутма текстин көчүрүү',
    copiedFeedback: 'Буйрутма тексти көчүрүлдү!',
    orderSentHint: 'Буйрутма кафеге жетиши үчүн WhatsApp-тан "Жөнөтүү" баскычын басыңыз',
    orderReadySubtitle:
      'Эгер WhatsApp ачылбаса же кайра жөнөтүү керек болсо, төмөнкү баскычтарды колдонуңуз.',
    openWhatsappAgain: 'WhatsApp-ты кайра ачуу',
    orderSentConfirmBtn: 'Буйрутма жөнөтүлдү',
    backToCartEditBtn: 'Себетке кайтуу',
    errAddress: 'Жеткирүү дарегин жазыңыз',
    contactsTitle: 'Филиалдар жана байланыш',
    contactsSubtitle:
      'Дем алышсыз күн сайын жеткирүү жана алып кетүү буйрутмаларын кабыл алабыз',
    deliveryTermsTitle: 'Жеткирүү жана төлөө шарттары',
    deliveryTermsBody:
      'Күн сайын 11:00дөн 00:00гө чейин. 1000 сомдон жогору буйрутмаларга шаар ичинде акысыз жеткирүү, 1000 сомго чейин — 100 сом. Төлөм накталай же которуу аркылуу.',
    callBtn: 'Чалуу',
    whatsappBtn: 'WhatsApp',
    cartButtonShort: 'Себет',
    nothingFoundTitle: 'Эч нерсе табылган жок',
    nothingFoundSubtitle: 'Издөө сөзүн өзгөртүп же издөөнү тазалап көрүңүз.',
    resetFilters: 'Бардык менюну көрсөтүү',
    prevSlide: 'Мурунку слайд',
    nextSlide: 'Кийинки слайд',
    close: 'Жабуу',
    selectedCityActive: 'Тандалган',
    switchCity: 'Филиалды тандоо',
  },
};
