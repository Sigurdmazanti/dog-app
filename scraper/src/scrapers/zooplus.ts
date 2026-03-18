import axios from "axios";
import * as cheerio from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { NutritionData, MineralsData } from "../interfaces/productComposition";
import { percentageStringToInt } from "../helpers/percentageStringToInt";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { nutritionKeyMap, mineralsKeyMap } from "../helpers/productCompositionKeyMap";
import { matchesAlias } from "../helpers/matchesAlias";

export async function scrapeZooPlus(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  try {
		const url: string = scrapeRequest.url;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('h1').text();

    const fullIngredientsText = $('#ingredients .anchors_anchorsHTML___2lrv p').text();
    const split = fullIngredientsText.split('Tilsætningsstoffer');
    const ingredientsDescription = split[0]
      .replace(/^Ingredienser[:\\s]*/i, '')
      .trim();

    const nutritionData = {} as NutritionData;
    const mineralsData = {} as MineralsData;

    $('table[data-zta="constituentsTable"] tr').each((_, el) => {
      const cells = $(el).find('td');
      if (cells.length === 2) {
        const name = $(cells[0]).text().toLowerCase().trim();
        const value = percentageStringToInt($(cells[1]).text());

        for (const [canonical, aliases] of Object.entries(nutritionKeyMap)) {
          if (aliases.some(alias => matchesAlias(name, alias))) {
            nutritionData[canonical as keyof NutritionData] = value;
          }
        }
        for (const [canonical, aliases] of Object.entries(mineralsKeyMap)) {
          if (aliases.some(alias => matchesAlias(name, alias))) {
            mineralsData[canonical as keyof MineralsData] = value;
          }
        }
      }
    });
    
    return { url, title, ingredientsDescription, nutritionData, mineralsData };

  } catch (err) {
    throw err;
  }
}