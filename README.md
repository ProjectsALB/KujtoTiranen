# Computer Store Sales Analysis

**SQL · Data Modeling · Business Intelligence**  
Kristina Spahi · Data Analyst

[![GitHub](https://img.shields.io/badge/GitHub-ProjectsALB-181717?logo=github)](https://github.com/ProjectsALB)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![SQL](https://img.shields.io/badge/SQL-Window%20Functions-orange)](./sql)
[![Tableau](https://img.shields.io/badge/Tableau-Dashboards-e97627)](./tableau)

End-to-end analysis of a multi-store computer hardware retailer. Covers relational database design, advanced SQL analytics, data quality checks, and interactive Tableau reporting.

---

## Dashboard Preview

![Dashboard Preview](./visuals/dashboard_preview.png)

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
- ER diagram: [`data/schema/relational_model.jpg`](./data/schema/relational_model.jpg)

### 2. SQL Analytics

| Stage | Focus | Techniques |
|-------|-------|------------|
| Schema | DDL | Tables, constraints, relationships |
| Objects | Database objects | Triggers, views, stored procedures |
| Joins | Multi-table analysis | Joins across stores, products, invoices |
| Aggregations | Summary metrics | `GROUP BY`, `SUM`, `AVG`, `COUNT` |
| Window functions | Ranking & trends | `RANK()`, `LAG()`, running totals, contribution % |
| Advanced reports | Business outputs | Combined techniques for stakeholder questions |
| Data cleaning | Quality | Duplicate detection, outlier handling |

Scripts live in [`sql/`](./sql) and run in order (`00` → `09`).

### 3. Visualization
Interactive Tableau workbooks in [`tableau/`](./tableau), including:

- Sales by product and category
- Revenue by store and region
- Purchases by age group
- Top customers by spend
- Monthly and daily sales trends
- Average sale value by city

### 4. Documentation & Reproducibility
- Ordered SQL scripts
- Exported query results as CSV in [`data/results/`](./data/results)
- Master analysis file: [`sql/00_MASTER_ANALYSIS.sql`](./sql/00_MASTER_ANALYSIS.sql)
- Project presentation: [`Computer_Store_Sales_Analysis_Presentation.pptx`](./Computer_Store_Sales_Analysis_Presentation.pptx)

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

Full result sets: [`data/results/`](./data/results)

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
│   ├── 01_schema_*.sql
│   ├── 02_triggers_views_procedures.sql
│   ├── 03_joins_analysis*.sql
│   ├── 04_aggregations.sql
│   ├── 04_math_functions*.sql
│   ├── 05_window_functions.sql
│   ├── 06_advanced_reports*.sql
│   ├── 06_business_queries.sql
│   ├── 07_data_analysis.sql
│   ├── 08_data_cleaning.sql
│   └── 09_extra_queries_*.sql
│
├── data/
│   ├── schema/
│   │   └── relational_model.jpg
│   └── results/                    # CSV query outputs
│
├── tableau/                        # .twb workbooks
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
1. Run schema scripts in [`sql/`](./sql) (`01_schema_*.sql`)
2. Load source data
3. Apply [`02_triggers_views_procedures.sql`](./sql/02_triggers_views_procedures.sql)
4. Run analysis scripts (`03` → `09`) or use [`00_MASTER_ANALYSIS.sql`](./sql/00_MASTER_ANALYSIS.sql)

### 2. Tableau
Open any `.twb` file from [`tableau/`](./tableau) in Tableau Desktop or Tableau Public.

### 3. Results & Presentation
- Sample outputs → [`data/results/`](./data/results)
- Presentation → [`Computer_Store_Sales_Analysis_Presentation.pptx`](./Computer_Store_Sales_Analysis_Presentation.pptx)
- ER diagram → [`data/schema/relational_model.jpg`](./data/schema/relational_model.jpg)

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

| Deliverable | Path |
|-------------|------|
| Relational schema (DDL) | [`sql/01_schema_*.sql`](./sql) |
| ER diagram | [`data/schema/relational_model.jpg`](./data/schema/relational_model.jpg) |
| Analytical SQL | [`sql/`](./sql) (`00` → `09`) |
| Query result CSVs | [`data/results/`](./data/results) |
| Tableau workbooks | [`tableau/`](./tableau) |
| Project presentation | [`Computer_Store_Sales_Analysis_Presentation.pptx`](./Computer_Store_Sales_Analysis_Presentation.pptx) |
| Dashboard preview | [`visuals/dashboard_preview.png`](./visuals/dashboard_preview.png) |

---

## Author

**Kristina Spahi**  
Computer Engineer · Data Analyst · Full-Stack Developer

- Email: [26spahikristi@gmail.com](mailto:26spahikristi@gmail.com)
- GitHub: [github.com/ProjectsALB](https://github.com/ProjectsALB)

---

## License

This project is licensed under the [MIT License](./LICENSE).  
Shared for portfolio and educational use.
