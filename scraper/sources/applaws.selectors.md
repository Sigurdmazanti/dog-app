# Applaws — Selector Reference

**Homepage:** https://applaws.com/uk/dog/  
**Scraper:** `applaws.ts`  
**Domain:** `applaws.com`

## HTML Example

```html
<h1 class="c-detail__title f-display-lg--filson font-bold pt-6">Variety Selection in Broth</h1>
<p class="f-h5--filson">Applaws™ Taste Toppers Natural Wet Dog Food • 6 x 85g</p>

<div class="container lg:mb-[450px] lg:mt-32 my-20 space-y-5" x-data="accordion" x-title="accordion">
  <article class="ease-in-out transition c-product__accordion duration-300">
    <button @click="toggle(0)" class="flex relative items-center justify-between px-10 py-[30px] w-full">
      <div class="flex f-h6--filson font-bold s-bold">Composition</div>
    </button>
    <div class="flex relative flex-gap-3 flex-wrap" x-show="activeIndex === 0">
      <div class="px-10 f-body pb-[30px]">
        <p class="p1">Chicken Breast in Broth: Chicken Breast 75%, Chicken Broth, Rice.</p>
      </div>
    </div>
  </article>
  <article class="ease-in-out transition c-product__accordion duration-300">
    <button @click="toggle(1)" class="flex relative items-center justify-between px-10 py-[30px] w-full">
      <div class="flex f-h6--filson font-bold s-bold">Nutrition</div>
    </button>
    <div class="flex relative flex-gap-3 flex-wrap" x-show="activeIndex === 1">
      <div class="px-10 f-body pb-[30px]">
        <p class="p1">818 kcal/kg</p>
      </div>
    </div>
  </article>
</div>
```

## Selectors

| Field | Selector / Approach |
|---|---|
| Variant title | `h1.c-detail__title` |
| Sub-brand / product line | `p.f-h5--filson` (strip `Applaws™?` prefix and `• N x Ng` pack-size quantity) |
| Composed title | cleaned `.f-h5--filson` prefix + `h1.c-detail__title` suffix, joined with a space |
| Ingredients description | `.f-body` inside the `article.c-product__accordion` whose `button .f-h6--filson` text is `Composition` |
| Analytical constituents | `.f-body` inside the `article.c-product__accordion` whose `button .f-h6--filson` text is `Nutrition` |

## Notes

- URL pattern: `/uk/dog/products/<slug>/`
- The `.f-h5--filson` text format is `Applaws™ <Line Name> • <N> x <Weight>` — trademark (™) and the bullet+quantity are stripped before composing the title
- The accordion panels are powered by Alpine.js; there are no stable `id` attributes — match panels by button label text, not by index
- Pack-size patterns observed: `6 x 85g`, `24 x 85g`, `8 x 156g`, `16 x 156g`, `32 x 156g`, `5 x 200g`, `200g` (bone broth pouches) — the regex `\s*•\s*\d+\s*x\s*[\d.]+\s*(kg|g)` covers these
- Puppy products are included under `wet` food type
- Dry food and treats URLs are not yet populated — add to the relevant sections in `applaws.yaml` as they are catalogued
