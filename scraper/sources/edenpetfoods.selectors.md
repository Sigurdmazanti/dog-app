# Eden Pet Foods — Selector Reference

**Homepage:** https://www.edenpetfoods.com/

> The site is an AngularJS SPA. Product content is **not** in the server-rendered HTML — it is loaded via a JSON API call made by the Angular app after page load. The scraper bypasses the HTML entirely and calls the API directly.

---

## How the site works

The product page HTML contains only a bare Angular directive:

```html
<product-page-details sku="PUW2kg"></product-page-details>
```

The Angular app then calls `POST /api/product-page-details` with `Content-Type: application/x-www-form-urlencoded` and body `sku=<sku>`, and populates the page from the JSON response.

---

## API endpoint

```
POST https://www.edenpetfoods.com/api/product-page-details
Content-Type: application/x-www-form-urlencoded

sku=<sku>
```

### SKU extraction

The SKU is extracted from the URL path:

```
https://www.edenpetfoods.com/shop/product/<sku>[/optional-slug]
```

Regex: `/\/shop\/product\/([^/?#]+)/`

### Response shape

```json
{
  "Ack": "Success",
  "Response": {
    "product": {
      "display_name": "Eden 80/20 Country Cuisine",
      "name": "Eden 80/20 Country Cuisine 2kg Medium Kibble",
      "attributeContent": {
        "composition": "<p>Freshly Prepared Duck (32%), ...</p>",
        "analytical": "<p>Crude Protein 34%, Crude Fat 20%, ...</p>",
        "nutritional": "<p>Per kg:</p><p>Vitamin A 14,425 IU, ...</p>",
        "trace-elements": "<p>Per kg:</p><p>Zinc ... 58 mg, ...</p>"
      }
    }
  }
}
```

---

## Extraction logic

| Field | Source | Notes |
|---|---|---|
| Title | `Response.product.display_name` | Falls back to `name` if absent |
| Ingredients description | `attributeContent.composition` — strip HTML | Cheerio used to strip tags/decode entities |
| Composition text | `attributeContent.analytical` + `nutritional` + `trace-elements` — strip HTML, join with `\n` | All three sections concatenated |

---

## Pagination notes

Product listing pages render the pagination widget **twice** — once above and once below the product grid — both matching `.pages .pagination .paginate_button.page-item.next`. Cheerio's `$(selector).attr('href')` returns the first match. Both elements carry an identical link, so no special handling is needed.

`maxPages` is set to `8`.

---

## Gotchas

- The HTML page contains no product data — do **not** try to use Cheerio selectors against the page HTML.
- `attributeContent` fields contain raw HTML strings (e.g. `<p>...</p><br>`). Strip with Cheerio before passing to the AI mapper.
- The API requires `application/x-www-form-urlencoded`, not JSON. JSON body returns an empty product object.
- Partner affiliate URLs (`/partners/product?sid=…`) and physical chew products must not be scraped.
