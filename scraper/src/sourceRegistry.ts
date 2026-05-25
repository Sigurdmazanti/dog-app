import { ScrapeRequest } from './interfaces/scrapeRequest';
import { ScrapeResult } from './interfaces/scrapeResult';
import { scrapeZooPlus } from './scrapers/zooplus';
import { scrapeAcanaEu } from './scrapers/acana-eu';
import { scrapeAcanaUs } from './scrapers/acana-us';
import { scrapeAdvance } from './scrapers/advance';
import { scrapeAlmoNature } from './scrapers/almo-nature';
import { scrapeAmanova } from './scrapers/amanova';
import { scrapeAnimonda } from './scrapers/animonda';
import { scrapeAntos } from './scrapers/antos';
import { scrapeApplaws } from './scrapers/applaws';
import { scrapeArion } from './scrapers/arion';
import { scrapeAvlskovgaard } from './scrapers/avlskovgaard';
import { scrapeBarfworld } from './scrapers/barfworld';
import { scrapeBelcando } from './scrapers/belcando';
import { scrapeBellfor } from './scrapers/bellfor';
import { scrapeBluebuffalo } from './scrapers/bluebuffalo';
import { scrapeBosch } from './scrapers/bosch';
import { scrapeBozita } from './scrapers/bozita';
import { scrapeBrit } from './scrapers/brit';
import { scrapeCalibra } from './scrapers/calibra';
import { scrapeCanagan } from './scrapers/canagan';
import { scrapeCanex } from './scrapers/canex';
import { scrapeCarnilove } from './scrapers/carnilove';
import { scrapeCavom } from './scrapers/cavom';
import { scrapeCesar } from './scrapers/cesar';
import { scrapeDibo } from './scrapers/dibo';
import { scrapeAlphaSpirit } from './scrapers/alphaspirit';
import { scrapeDrClauders } from './scrapers/dr-clauders';
import { scrapeEdenPetFoods } from './scrapers/edenpetfoods';
import { scrapeButternutbox } from './scrapers/butternutbox';
import { scrapeEdgardCooper } from './scrapers/edgard-cooper';
import { scrapeEssentialFoods } from './scrapers/essentialfoods';
import { scrapeEukanuba } from './scrapers/eukanuba';
import { scrapeEuroPremium } from './scrapers/europremium';

export interface SourceEntry {
  domain: string;
  brand: string;
  scrape: (req: ScrapeRequest) => Promise<ScrapeResult>;
}

export const sourceRegistry: SourceEntry[] = [
  { domain: 'zooplus', brand: 'Zooplus', scrape: scrapeZooPlus },
  { domain: 'emea.acana', brand: 'Acana', scrape: scrapeAcanaEu },
  { domain: 'www.acana.com', brand: 'Acana', scrape: scrapeAcanaUs },
  { domain: 'advancepet.com', brand: 'Advance', scrape: scrapeAdvance },
  { domain: 'almonature.com', brand: 'Almo Nature', scrape: scrapeAlmoNature },
  { domain: 'amanova', brand: 'Amanova', scrape: scrapeAmanova },
  { domain: 'animonda', brand: 'Animonda', scrape: scrapeAnimonda },
  { domain: 'antos.eu', brand: 'Antos', scrape: scrapeAntos },
  { domain: 'applaws.com', brand: 'Applaws', scrape: scrapeApplaws },
  { domain: 'arion-petfood.dk', brand: 'Arion', scrape: scrapeArion },
  { domain: 'avlskovgaard.dk', brand: 'Avlskovgaard', scrape: scrapeAvlskovgaard },
  { domain: 'barfworld.com', brand: 'Barf World', scrape: scrapeBarfworld },
  { domain: 'belcando.com', brand: 'Belcando', scrape: scrapeBelcando },
  { domain: 'bellfor.info', brand: 'Bellfor', scrape: scrapeBellfor },
  { domain: 'bluebuffalo.com', brand: 'Blue Buffalo', scrape: scrapeBluebuffalo },
  { domain: 'bosch-tiernahrung.de', brand: 'Bosch', scrape: scrapeBosch },
  { domain: 'bozita.com', brand: 'Bozita', scrape: scrapeBozita },
  { domain: 'brit-petfood.com', brand: 'Brit', scrape: scrapeBrit },
  { domain: 'calibrastore.co.uk', brand: 'Calibra', scrape: scrapeCalibra },
  { domain: 'canagan.com', brand: 'Canagan', scrape: scrapeCanagan },
  { domain: 'canex-shop.dk', brand: 'Canex', scrape: scrapeCanex },
  { domain: 'carnilove.com', brand: 'Carnilove', scrape: scrapeCarnilove },
  { domain: 'cavom.com', brand: 'Cavom', scrape: scrapeCavom },
  { domain: 'cesar.com', brand: 'Cesar', scrape: scrapeCesar },
  { domain: 'dibodog.com', brand: 'Dibo', scrape: scrapeDibo },
  { domain: 'alphaspirit.se', brand: 'Alpha Spirit', scrape: scrapeAlphaSpirit },
  { domain: 'dr-clauder.com', brand: "Dr. Clauder's", scrape: scrapeDrClauders },
  { domain: 'edenpetfoods.com', brand: 'Eden Pet Foods', scrape: scrapeEdenPetFoods },
  { domain: 'butternutbox.com', brand: 'Butternutbox', scrape: scrapeButternutbox },
  { domain: 'edgardcooper.com', brand: 'Edgard & Cooper', scrape: scrapeEdgardCooper },
  { domain: 'essentialfoods.com', brand: 'Essential Foods', scrape: scrapeEssentialFoods },
  { domain: 'eukanuba.eu', brand: 'Eukanuba', scrape: scrapeEukanuba },
  { domain: 'europremium.com', brand: 'EuroPremium', scrape: scrapeEuroPremium },
];

export function findSource(url: string): SourceEntry | undefined {
  return sourceRegistry.find((entry) => url.includes(entry.domain));
}
