import { ScrapeRequest } from './interfaces/scrapeRequest';
import { ScrapeResult } from './interfaces/scrapeResult';
import { scrapeZooPlus } from './scrapers/zooplus';
import { scrapeAcanaEu } from './scrapers/acana-eu';
import { scrapeAcanaUs } from './scrapers/acana-us';
import { scrapeAdvance } from './scrapers/advance';
import { scrapeAlmoNature } from './scrapers/almo-nature';
import { scrapeAmanova } from './scrapers/amanova';
import { scrapeAnimonda } from './scrapers/animonda';

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
];

export function findSource(url: string): SourceEntry | undefined {
  return sourceRegistry.find((entry) => url.includes(entry.domain));
}
