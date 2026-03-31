import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export async function parseSitemapUrls(pathOrUrl: string): Promise<string[]> {
  let xml: string;

  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    const response = await axios.get(pathOrUrl, { responseType: 'text' });
    xml = response.data;
  } else {
    const resolved = path.resolve(pathOrUrl);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Sitemap file not found: ${resolved}`);
    }
    xml = fs.readFileSync(resolved, 'utf-8');
  }

  const parsed = await parseStringPromise(xml);

  const urlset = parsed?.urlset?.url;
  if (!Array.isArray(urlset)) {
    return [];
  }

  return urlset
    .map((entry: { loc?: string[] }) => entry.loc?.[0])
    .filter((loc: string | undefined): loc is string => typeof loc === 'string' && loc.length > 0);
}
