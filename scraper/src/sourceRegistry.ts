import { ScrapeRequest } from './interfaces/scrapeRequest';
import { ScrapeResult } from './interfaces/scrapeResult';
import { scrapeZooPlus } from './scrapers/zooplus';
import { scrapeAcanaEu } from './scrapers/acana-eu';
import { scrapeAdvance } from './scrapers/advance';
import { scrapeAlmoNature } from './scrapers/almo-nature';
import { scrapeAmanova } from './scrapers/amanova';
import { scrapeAnimonda } from './scrapers/animonda';

export interface SourceEntry {
  domain: string;
  scrape: (req: ScrapeRequest) => Promise<ScrapeResult>;
}

export const sourceRegistry: SourceEntry[] = [
  { domain: 'zooplus', scrape: scrapeZooPlus },
  { domain: 'emea.acana', scrape: scrapeAcanaEu },
  { domain: 'advancepet.com', scrape: scrapeAdvance },
  { domain: 'almonature.com', scrape: scrapeAlmoNature },
  { domain: 'amanova', scrape: scrapeAmanova },
  { domain: 'animonda', scrape: scrapeAnimonda },
];

export function findSource(url: string): SourceEntry | undefined {
  return sourceRegistry.find((entry) => url.includes(entry.domain));
}
