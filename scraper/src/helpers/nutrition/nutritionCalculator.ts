import { NutritionData } from "../../interfaces/productComposition";

/**
 * Calculates NFE (Nitrogen-Free Extract)
 * NFE = 100 - water - protein - fat - fiber - crudeAsh
 */
export function calculateNFE(data: NutritionData): number {
  if (data.water == null || data.protein == null || data.fat == null || data.fiber == null || data.crudeAsh == null) {
    return 0;
  }
  return 100 - data.water - data.protein - data.fat - data.fiber - data.crudeAsh;
}

/**
 * Calculates Metabolizable Energy (ME) in kJ per 100 g of product.
 *
 * Uses the FEDIAF (European Pet Food Industry Federation) formula for complete
 * pet food, which applies modified Atwater coefficients together with a
 * digestibility correction and a urinary-loss deduction:
 *
 *   ME = ((((23.8 × protein) + (39.3 × fat) + (17.1 × (NFE + fibre)))
 *          × (91.2 − (1.43 × fibre))) / 100)
 *        − (4.35 × protein)
 *
 * Component notes:
 *  - 23.8, 39.3, 17.1  Modified Atwater combustion coefficients (kJ/g) for
 *                       protein, fat, and carbohydrates (NFE + fibre)
 *  - (91.2 − 1.43 × %fibre) / 100  Digestibility correction factor — fibre
 *                       reduces overall digestibility
 *  - 4.35 × %protein   Urinary energy loss correction (urea excretion)
 *  - NFE is derived via calculateNFE: 100 − water − protein − fat − fibre − ash
 */
export function calculateMetabolizableEnergy(data: NutritionData): number {
  if (data.protein == null || data.fat == null || data.fiber == null) {
    return 0;
  }
  const nfe = calculateNFE(data);

  const me =
    ((((23.8 * data.protein) + (39.3 * data.fat) + (17.1 * (nfe + data.fiber)))
      * (91.2 - (1.43 * data.fiber))) / 100)
    - (4.35 * data.protein);

  return Math.round(me);
}