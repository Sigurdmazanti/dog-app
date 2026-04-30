import axios from 'axios';
import * as cheerio from 'cheerio';
import { DiscoveryListing, DiscoveryPagination } from '../interfaces/source';

export interface CrawlListingOptions {
  productLinkSelector: string;
  pagination?: DiscoveryPagination;
  /** ms between sequential requests within this listing (default 500) */
  delayMs?: number;
  /** override default User-Agent */
  userAgent?: string;
}

const DEFAULT_USER_AGENT =
  'dogapp-scraper/0.1 (+https://github.com/sigmu/dogapp; product-discovery)';
const DEFAULT_MAX_PAGES = 20;
const DEFAULT_DELAY_MS = 500;

const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

async function fetchHtml(url: string, userAgent: string): Promise<string> {
  const { data } = await axios.get<string>(url, {
    responseType: 'text',
    headers: { 'User-Agent': userAgent, Accept: 'text/html,application/xhtml+xml' },
    // Allow large category pages
    maxContentLength: 10 * 1024 * 1024,
  });
  return data;
}

function extractLinks($: cheerio.CheerioAPI, selector: string, baseUrl: string): string[] {
  const out: string[] = [];
  $(selector).each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    try {
      out.push(new URL(href, baseUrl).toString());
    } catch {
      // ignore malformed hrefs
    }
  });
  return out;
}

function extractNextPage(
  $: cheerio.CheerioAPI,
  selector: string,
  baseUrl: string
): string | undefined {
  const href = $(selector).first().attr('href');
  if (!href) return undefined;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return undefined;
  }
}

/**
 * Crawl a single listing (and optionally its paginated next pages),
 * returning all unique product URLs that match `productLinkSelector`.
 *
 * Polite: sleeps `delayMs` between sequential requests, sends a descriptive
 * User-Agent. Stops at `pagination.maxPages` and warns when the cap is hit.
 */
export async function crawlListing(
  listing: DiscoveryListing,
  opts: CrawlListingOptions
): Promise<string[]> {
  const userAgent = opts.userAgent ?? DEFAULT_USER_AGENT;
  const delayMs = opts.delayMs ?? DEFAULT_DELAY_MS;
  const maxPages = opts.pagination?.maxPages ?? DEFAULT_MAX_PAGES;
  const nextSelector = opts.pagination?.nextSelector;

  const seen = new Set<string>();
  let currentUrl: string | undefined = listing.url;
  let pageCount = 0;

  while (currentUrl) {
    if (pageCount > 0) await sleep(delayMs);

    const html = await fetchHtml(currentUrl, userAgent);
    const $ = cheerio.load(html);

    for (const link of extractLinks($, opts.productLinkSelector, currentUrl)) {
      seen.add(link);
    }
    pageCount += 1;

    if (!nextSelector) break;
    if (pageCount >= maxPages) {
      // eslint-disable-next-line no-console
      console.warn(
        `[discovery] pagination cap (${maxPages}) reached for listing ${listing.url}`
      );
      break;
    }

    const next = extractNextPage($, nextSelector, currentUrl);
    if (!next || next === currentUrl || seen.has(next)) break;
    currentUrl = next;
  }

  return Array.from(seen);
}
