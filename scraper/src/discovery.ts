#!/usr/bin/env node
/**
 * Discovery CLI: refresh a brand's product URL list from its configured
 * listing pages, with an AI fallback for ungrouped URLs.
 *
 * Usage:
 *   npx ts-node src/discovery.ts --source <brand>            # dry-run, prints diff
 *   npx ts-node src/discovery.ts --source <brand> --write    # apply diff
 *   npx ts-node src/discovery.ts --source <brand> --write --force  # bypass 50% guard
 */
import * as dotenv from 'dotenv';
dotenv.config();

import { runDiscovery } from './discovery/runDiscovery';
import { buildDiff, evaluateGuard, renderDiff } from './diff/buildDiff';
import { applyDiffToSource } from './diff/writeSource';
import { loadSource } from './helpers/utils/loadSource';

interface CliArgs {
  source?: string;
  write: boolean;
  force: boolean;
  help: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const out: CliArgs = { write: false, force: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--source') out.source = argv[++i];
    else if (a === '--write') out.write = true;
    else if (a === '--force') out.force = true;
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

function printHelp(): void {
  console.log(`Usage: npx ts-node src/discovery.ts --source <brand> [--write] [--force]

  --source <brand>   Brand identifier matching scraper/sources/<brand>.json
  --write            Apply discovered changes back to the source JSON
  --force            Bypass the 50%-drop safety guard (use with care)
  --help, -h         Show this message`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.source) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  const brand = args.source;
  const source = loadSource(brand);
  const result = await runDiscovery(brand);
  const diff = buildDiff(source, result);

  console.log(renderDiff(diff));

  if (!args.write) {
    console.log('\n(dry-run; pass --write to apply)');
    return;
  }

  const guard = evaluateGuard(source, result);
  if (guard.tripped && !args.force) {
    console.error('\nSAFETY GUARD TRIPPED: discovered counts dropped > 50% for:');
    for (const d of guard.details) {
      console.error(
        `  - ${d.foodType}: prior=${d.prior}, discovered=${d.discovered} ` +
          `(${(d.ratio * 100).toFixed(0)}%)`
      );
    }
    console.error('Re-run with --force to override.');
    process.exit(3);
  }
  if (guard.tripped && args.force) {
    console.warn('\nWARNING: 50% guard bypassed via --force:');
    for (const d of guard.details) {
      console.warn(
        `  - ${d.foodType}: prior=${d.prior}, discovered=${d.discovered}`
      );
    }
  }

  applyDiffToSource(brand, diff, result);
  console.log(`\nWrote scraper/sources/${brand}.json`);
}

main().catch((e) => {
  console.error('Discovery failed:', e?.message ?? e);
  process.exit(1);
});
