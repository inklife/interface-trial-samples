# News Scout: original application demonstration

An AI-created, self-initiated news dashboard. [Open the static preview](https://inklife.github.io/interface-trial-samples/samples/news/) or [download the runnable Python source](news-scout-source.zip).

Three original synthetic RSS fixtures contain 12 entries; URL deduplication leaves 11. The local Python application actually parses XML and offers manual collection, whole-word title keywords, source filtering, publication dates, original links and filter-aware CSV. It uses the Python standard library, with no packages or accounts required.

The public static preview offers keyword/source filtering and client-side CSV. **Reload samples simulates collection**; it does not scrape websites or run the Python backend. All headlines are synthetic and .example links are reserved demonstration URLs. No customer deployment or completed sale is claimed.

The Python source has an explicit local source allowlist. Remote collection accepts configured HTTPS RSS 2.0 sources, rejects local/private destinations and redirects, bounds size/time, and stores headline metadata. No arbitrary URL input or full article caching is provided. The sample does not include a background scheduler, persistent database, production authentication, Atom or HTML scraping. See the source README for exact configuration and deployment limits.

The first source retains a cross-feed duplicate; missing dates are labeled explicitly. In-memory data resets on restart. Twelve HTTP, parsing and boundary tests passed; browser checks confirm whole-word AI filtering, combined source filtering and repeated collection. The responsive UI was inspected at desktop and 390px mobile width.

## Limited direct offer

**CNY 499** proposed for one small RSS headline Web app: up to three authorized UTF-8 RSS 2.0 sources, manual collection, title/date/source/link display, keyword and source filters, CSV, Python source and local run instructions. One scoped revision, with three-day delivery after the source formats and acceptance criteria are agreed. Hosting, domain, automatic schedules, custom HTML scrapers, paid APIs and account systems are outside this package. This is an offer, not a sale.

AI generates much of the code and drafts; implementation and behavior are checked. For this independent offer, [open a project inquiry](https://github.com/inklife/interface-trial-samples/issues/new) and share only public or redacted examples. Agree price, source permission, acceptance and payment before work. Work originating on another marketplace stays on that marketplace for discussion/payment.
