# Computer Store Sales Analysis

**SQL · Data Modeling · Business Intelligence**  
Kristina Spahi · Data Analyst

![GitHub](https://img.shields.io/badge/GitHub-ProjectsALB-181717?logo=github)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![SQL](https://img.shields.io/badge/SQL-Window%20Functions-orange)
![Tableau](https://img.shields.io/badge/Tableau-Dashboards-e97627)

End-to-end analysis of a multi-store computer hardware retailer. Covers relational database design, advanced SQL analytics, data quality checks, and interactive Tableau reporting.

---

## Dashboard Preview

![Dashboard Preview](visuals/dashboard_preview.png)

---

## Problem Statement

A computer retail chain needs clear visibility into store performance, product mix, customer demographics, and sales trends. Without structured analysis, decisions on inventory, pricing, and regional strategy rely on incomplete or siloed data.

This project builds a structured analytical layer on top of transactional data to answer core business questions and support data-driven decisions.

---

## Objectives

- Design a normalized relational schema for stores, products, customers, and invoices
- Produce reliable revenue, ranking, and trend metrics using advanced SQL
- Identify high-performing stores, products, and customer segments
- Surface regional differences in product demand
- Deliver interactive Tableau dashboards for business users
- Document data quality issues and cleaning steps

---

## Business Questions

| # | Question | Analytical Approach |
|---|----------|---------------------|
| 1 | Which cities have the most active sellers? | Aggregation + ranking |
| 2 | Which stores generate the highest total revenue? | `SUM` + `RANK()` |
| 3 | How do sales break down by age group? | Demographic segmentation |
| 4 | Which products sell best in which regions? | Multi-table joins + regional grouping |
| 5 | How do RAM / CPU / screen size affect laptop sales? | Product attribute analysis |
| 6 | What are MoM and YoY sales trends? | `LAG()` window functions |
| 7 | Who are the top-spending customers vs. average? | Customer-level ranking |
| 8 | What is each product’s contribution % to store revenue? | Windowed totals + % of total |

---

## Methodology

### 1. Data Modeling
- Relational schema for stores (`Dyqani`), products, invoices (`Fature`), line items, and trading relationships
- Primary/foreign keys for multi-store, multi-product analysis
- ER diagram: `data/schema/relational_model.jpg`

### 2. SQL Analytics

Scripts are organized by complexity in the `sql/` folder:

| File / pattern | Focus |
|----------------|-------|
| `01_schema_*.sql` | DDL – tables and relationships |
| `02_triggers_views_procedures.sql` | Triggers, views, stored procedures |
| `03_joins_analysis*.sql` | Multi-table JOINs |
| `04_aggregations.sql` | `GROUP BY`, `SUM`, `AVG`, `COUNT` |
| `04_math_functions*.sql` | Calculated metrics |
| `05_window_functions.sql` | `RANK()`, `LAG()`, running totals |
| `06_advanced_reports*.sql` / `06_business_queries.sql` | Business reports |
| `07_data_analysis.sql` | Broader analysis |
| `08_data_cleaning.sql` | Duplicates and outliers |
| `09_extra_queries_*.sql` | Additional queries |
| `00_MASTER_ANALYSIS.sql` | Core business questions in one place |

### 3. Visualization
Tableau workbooks (`.twb`) are in the `tableau/` folder. Open them with Tableau Desktop or Tableau Public — they are not viewable inside GitHub.

Examples:
- Sales by product / category
- Revenue by store and region
- Purchases by age group
- Top customers by spend
- Monthly and daily sales trends
- Average sale value by city

### 4. Documentation & Reproducibility
- Ordered SQL scripts in `sql/`
- Query outputs exported as CSV in `data/results/`
- Master file: `sql/00_MASTER_ANALYSIS.sql`
- Presentation: `Computer_Store_Sales_Analysis_Presentation.pptx`

---

## Key Findings

| Area | Insight |
|------|---------|
| **Store performance** | Dyqani Mu (~2.17M) and Dyqani Beta (~2.04M) lead total revenue |
| **Geographic activity** | New York (12), Los Angeles (10), San Jose (10) have the highest seller counts |
| **Customer segments** | Age group 25–34 shows the highest observed spend |
| **Product preferences** | Higher-spec configs (e.g. 16GB RAM + Intel Core i5/i9) show stronger demand |
| **Regional mix** | Product demand varies by region (storage, monitors, peripherals) |
| **Time trends** | Window functions enable YoY and MoM comparison |

Source CSVs: `data/results/`

---

## Skills Demonstrated

| Category | Skills |
|----------|--------|
| **SQL** | Complex joins, aggregations, window functions (`RANK`, `LAG`), ranking, contribution analysis |
| **Data Modeling** | Relational design, normalization, constraints, ER modeling |
| **Data Quality** | Duplicate checks, outlier review, cleaning scripts |
| **BI / Visualization** | Tableau dashboards for business audiences |
| **Business Analysis** | Turning business questions into metrics and insights |
| **Documentation** | Structured repo, reproducible scripts, clear deliverables |

---

## Repository Structure

```
computer-store-sales-analysis/
├── README.md
├── LICENSE
├── .gitignore
├── Computer_Store_Sales_Analysis_Presentation.pptx
│
├── sql/
│   ├── 00_MASTER_ANALYSIS.sql
│   ├── 01_schema_computershop.sql
│   ├── 01_schema_customers.sql
│   ├── 01_schema_invoices.sql
│   ├── 01_schema_laptops.sql
│   ├── 01_schema_laptops_alt.sql
│   ├── 01_schema_product_list.sql
│   ├── 01_schema_products.sql
│   ├── 01_schema_products_alt.sql
│   ├── 01_schema_stores.sql
│   ├── 01_schema_trading.sql
│   ├── 02_triggers_views_procedures.sql
│   ├── 03_joins_analysis.sql
│   ├── 03_joins_analysis_1.sql
│   ├── 03_joins_analysis_2.sql
│   ├── 03_joins_analysis_3.sql
│   ├── 04_aggregations.sql
│   ├── 04_math_functions.sql
│   ├── 04_math_functions_2.sql
│   ├── 05_window_functions.sql
│   ├── 06_advanced_reports.sql
│   ├── 06_advanced_reports_2.sql
│   ├── 06_business_queries.sql
│   ├── 07_data_analysis.sql
│   ├── 08_data_cleaning.sql
│   ├── 09_extra_queries_1.sql
│   └── 09_extra_queries_2.sql
│
├── data/
│   ├── schema/
│   │   └── relational_model.jpg
│   └── results/
│       ├── available_stock.csv
│       ├── cities_avg_sales.csv
│       ├── customer_registrations_season.csv
│       ├── customer_spend_2024.csv
│       ├── daily_monthly_sales_report.csv
│       ├── monthly_sales.csv
│       ├── product_qty_avg_price.csv
│       ├── products_by_region.csv
│       ├── regions.csv
│       ├── revenue_by_region.csv
│       ├── sales_by_age_group.csv
│       ├── sales_by_category.csv
│       ├── store_total_revenue.csv
│       ├── top_5_cities_by_sellers.csv
│       ├── total_cost_by_product.csv
│       ├── total_sales_by_category.csv
│       └── total_sales_by_product.csv
│
├── tableau/                          # .twb workbooks (open in Tableau)
│   ├── analiza e shitjeve per produkt.twb
│   ├── blerjet sipas grupmoshave.twb
│   ├── klinetet me blerjet me te shumta.twb
│   ├── produktet e shitura ne rajone te ndryshme.twb
│   ├── qytete me shitjet me te larta.twb
│   ├── shitjet sipas kategorive.twb
│   ├── shitjet totale mujore.twb
│   ├── te ardhurat nga secili rajon.twb
│   └── ...
│
└── visuals/
    └── dashboard_preview.png
```

---

## Tech Stack

- **SQL** — schema design, joins, aggregations, window functions, ranking, trend analysis
- **Tableau** — interactive dashboards (store, product, region, demographics)
- **Data quality** — cleaning and validation scripts
- **Documentation** — ER diagram, presentation, exported results

---

## Getting Started

### 1. Database
1. Run schema scripts in `sql/` starting with `01_schema_*.sql`
2. Load source data
3. Apply `02_triggers_views_procedures.sql`
4. Run analysis scripts (`03` → `09`) or use `00_MASTER_ANALYSIS.sql`

### 2. Tableau
1. Install Tableau Public (free) or Tableau Desktop
2. Open any `.twb` file from `tableau/`
3. Workbooks are not viewable inside GitHub

### 3. Results & presentation
- Query outputs: `data/results/`
- Presentation: `Computer_Store_Sales_Analysis_Presentation.pptx`
- ER diagram: `data/schema/relational_model.jpg`
- Dashboard image: `visuals/dashboard_preview.png`

---

## Sample Queries

### Top product by revenue per store

```sql
SELECT Store, Product, Revenue, RankInStore
FROM (
    SELECT
        d.name AS Store,
        p.emri AS Product,
        SUM(lp.qnt * p.cmimi) AS Revenue,
        RANK() OVER (
            PARTITION BY d.name
            ORDER BY SUM(lp.qnt * p.cmimi) DESC
        ) AS RankInStore
    FROM Dyqani d
    INNER JOIN Tregton1 t ON d.id = t.dyqan_id
    INNER JOIN Produkt2 p ON t.produkt_id = p.id
    INNER JOIN Lista_Produkteve lp ON p.id = lp.produkt_id
    GROUP BY d.name, p.emri
) ranked
WHERE RankInStore = 1;
```

### Year-over-year sales change

```sql
SELECT
    YEAR(f.data_blerjes) AS Year,
    SUM(lp.qnt * p.cmimi) AS Total_Sales,
    LAG(SUM(lp.qnt * p.cmimi), 1) OVER (ORDER BY YEAR(f.data_blerjes)) AS Previous_Year_Sales,
    SUM(lp.qnt * p.cmimi)
        - LAG(SUM(lp.qnt * p.cmimi), 1) OVER (ORDER BY YEAR(f.data_blerjes)) AS YoY_Change
FROM Fature f
INNER JOIN Lista_Produkteve lp ON f.id = lp.fature_id
INNER JOIN Produkt2 p ON lp.produkt_id = p.id
GROUP BY YEAR(f.data_blerjes)
ORDER BY Year;
```

---

## Deliverables

| Deliverable | Location |
|-------------|----------|
| Relational schema (DDL) | `sql/01_schema_*.sql` |
| ER diagram | `data/schema/relational_model.jpg` |
| Analytical SQL | `sql/` (`00` → `09`) |
| Query result CSVs | `data/results/` |
| Tableau workbooks | `tableau/` |
| Project presentation | `Computer_Store_Sales_Analysis_Presentation.pptx` |
| Dashboard preview | `visuals/dashboard_preview.png` |

---

## Author

**Kristina Spahi**  
Computer Engineer · Data Analyst · Full-Stack Developer

- Email: 26spahikristi@gmail.com
- GitHub: [github.com/ProjectsALB](https://github.com/ProjectsALB)

---

## License

MIT License — see the `LICENSE` file in this repository.  
Shared for portfolio and educational use.
