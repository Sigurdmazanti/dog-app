import {
  AminoAcidsData,
  FattyAcidsData,
  MineralsData,
  NutritionData,
  SaltsData,
  SugarAlcoholsData,
  VitaminLikeData,
  VitaminsData,
} from "../../interfaces/productComposition";

export const nutritionKeyMap: Record<keyof NutritionData, string[]> = {
  kiloJoule: ['kilojoule'/*, 'kj', 'energi', 'gross energy'*/],
  water: ['moisture', 'vand', 'fugtighed', 'væske', 'water'],
  protein: ['protein', 'råprotein', 'crude protein'],
  fat: ['fat', 'fedt', 'råfedt', 'crude fat'],
  fiber: ['fibre', 'fiber', 'råfibre', 'træstof', 'crude fibre'],
  crudeAsh: ['ash', 'råaske', 'aske', 'crude ash'],
  nfe: ['nfe', 'carbohydrates', 'kulhydrater', 'carbohydrate', 'kulhydrat'],
  sugar: ['sugar', 'sukker', 'sugars', 'sukkerarter', 'total sugar', 'total sukker'],
};

export const mineralsKeyMap: Record<keyof MineralsData, string[]> = {
  calcium: ['calcium', 'kalcium', 'kalk', 'ca', 'calcium carbonate', 'calciumkarbonat'],
  phosphorus: ['phosphorus', 'phospor', 'fosfor', 'fosfat', 'phosphate'],
  magnesium: ['magnesium', 'mg', 'magnesiumoxid', 'magnesiumsulfat'],
  potassium: ['potassium', 'kalium', 'k'],
  sodium: ['sodium', 'natrium', 'na'],
  chloride: ['chlorine', 'chloride', 'chlorid', 'klor', 'cl', 'cl-', 'cl⁻'],
  sulphur: ['sulphur', 'sulfur', 'svovl', 's'],
  mercury: ['mercury', 'kviksølv', 'quicksilver', 'hg'],
  cobalt: ['cobalt', 'cobolt', 'co'],
  molybdenum: ['molybdenum', 'molybdæn', 'molybdaen', 'mo'],
  fluorine: ['fluorine', 'fluoride', 'fluor', 'fluorid', 'f', 'f-', 'f⁻'],
  silicon: ['silicon', 'silicium', 'si'],
  chromium: ['chromium', 'chrom', 'cr'],
  vanadium: ['vanadium', 'v'],
  nickel: ['nickel', 'nikkel', 'ni'],
  tin: ['tin', 'sn'],
  arsenic: ['arsenic', 'arsenik', 'as'],
  lead: ['lead', 'bly', 'pb'],
  cadmium: ['cadmium', 'cd'],
  iron: ['iron', 'jern', 'fe', 'ferrum', 'jernoxid'],
  copper: ['copper', 'kobber', 'cu', 'cuprum'],
  zinc: ['zinc', 'zink', 'zn'],
  iodine: ['iodine', 'jod', 'iod', 'i'],
  manganese: ['manganese', 'mangan', 'mn'],
  selenium: ['selenium', 'selen', 'se'],
  clinoptilolite: ['clinoptilolite', 'clinoptilolit'],
};

export const saltsKeyMap: Record<keyof SaltsData, string[]> = {
  sodiumChloride: ['sodium chloride', 'salt', 'natriumklorid', 'natriumchlorid'],
  potassiumChloride: ['potassium chloride', 'kaliumchlorid', 'kaliumklorid'],
  ferrousSulfate: ['ferrous sulfate', 'jernsulfat'],
  copperSulfate: ['copper sulfate', 'kobbersulfat'],
  pentasodiumTriphosphate: ['pentasodium triphosphate', 'pentanatriumtriphosphat', 'natriumtripolyfosfat'],
};

export const vitaminsKeyMap: Record<keyof VitaminsData, string[]> = {
  aVitamin: [
    'a-vitamin',
    'vitamin a',
    'beta-karoten',
    'beta-caroten',
    'beta-carotene',
    'retinol',
    'alpha-carotene',
    'beta-cryptoxanthin',
    'retinal',
    'retinoic acid',
    'alpha-caroten',
  ],
  dVitamin: [
    'd-vitamin',
    'vitamin d',
    'vitamin d3',
    'vitamin d2',
    'cholecalciferol',
    'ergocalciferol',
    '7-dehydrocholesterol',
    'd-3 vitamin',
    'd-2 vitamin',
    'ergosterol',
  ],
  dVitamin3: ['vitamin d3', 'd3-vitamin', 'd-3 vitamin', 'cholecalciferol'],
  dVitamin2: ['vitamin d2', 'd2-vitamin', 'd-2 vitamin', 'ergocalciferol'],
  hydroxyVitaminD3: ['25-hydroxy vitamin d3', '25 hydroxy vitamin d3', '25-oh-d3', 'calcifediol'],
  hydroxyVitaminD2: ['25-hydroxy vitamin d2', '25 hydroxy vitamin d2', '25-oh-d2'],
  eVitamin: [
    'e-vitamin',
    'vitamin e',
    'alpha-tocopherol',
    'beta-tocopherol',
    'gamma-tocopherol',
    'delta-tocopherol',
  ],
  kVitamin: ['k-vitamin', 'vitamin k', 'phylloquinone', 'phyllokinon', 'menaquinone', 'menakinon', 'menadione'],
  k1Vitamin: ['vitamin k1', 'k1-vitamin', 'phylloquinone', 'phyllokinon'],
  k2Vitamin: ['vitamin k2', 'k2-vitamin', 'menaquinone', 'menakinon'],
  bVitamin: ['b-vitamin', 'vitamin b'],
  b1: ['b1', 'b1-vitamin', 'vitamin b1', 'thiamin', 'thiamine'],
  b2: ['b2', 'b2-vitamin', 'vitamin b2', 'riboflavin'],
  b3: ['b3', 'b3-vitamin', 'vitamin b3', 'niacin', 'nicotinic acid', 'nicotinamide', 'niacinamide'],
  b5: ['b5', 'b5-vitamin', 'vitamin b5', 'pantothensyre', 'pantothenic acid', 'panthenol'],
  b6: ['b6', 'b6-vitamin', 'vitamin b6', 'pyridoxin', 'pyridoxine', 'pyridoxal', 'pyridoxamine'],
  b7: ['b7', 'b7-vitamin', 'vitamin b7', 'biotin', 'vitamin h'],
  b9: ['b9', 'b9-vitamin', 'vitamin b9', 'folat', 'folsyre', 'folic acid', 'folinsyre'],
  b12: ['b12', 'b12-vitamin', 'vitamin b12', 'kobalamin', 'cobalamin', 'cyanocobalamin', 'methylcobalamin'],
  cVitamin: ['c-vitamin', 'vitamin c', 'l-ascorbinsyre', 'ascorbic acid'],
};

export const aminoAcidsKeyMap: Record<keyof AminoAcidsData, string[]> = {
  lLysine: ['l-lysine', 'l-lysin', 'lysine', 'lysin'],
  taurine: ['taurine', 'taurin'],
};

export const vitaminLikeKeyMap: Record<keyof VitaminLikeData, string[]> = {
  lCarnitine: ['l-carnitine', 'l-carnitin'],
  choline: [
    'choline',
    'cholin',
    'vitamin-lignende stof choline',
    'choline chloride',
    'cholinchlorid',
    'acetylcholine precursor',
    'betain precursor',
  ],
};

export const fattyAcidsKeyMap: Record<keyof FattyAcidsData, string[]> = {
  omega3: ['omega 3', 'omega-3', 'omega-3 fedtsyre', 'omega 3 fedtsyre', 'omega3 fedtsyre', 'omega3-fedtsyre'],
  omega6: ['omega 6', 'omega-6', 'omega-6 fedtsyre', 'omega 6 fedtsyre', 'omega6 fedtsyre', 'omega6-fedtsyre'],
};

export const sugarAlcoholsKeyMap: Record<keyof SugarAlcoholsData, string[]> = {
  glycerin: ['glycerin', 'glycerol', 'vegetabilsk glycerin'],
  sorbitol: ['sorbitol', 'sorbitol syrup', 'sorbitsirup'],
};