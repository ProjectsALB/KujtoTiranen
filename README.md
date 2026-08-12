# Computer Store Sales Analysis

**SQL · Data Modeling · Business Intelligence**  
Kristina Spahi · Data Analyst

[![GitHub](https://img.shields.io/badge/GitHub-ProjectsALB-181717?logo=github)](https://github.com/ProjectsALB/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![SQL](https://img.shields.io/badge/SQL-Window%20Functions%20%7C%20CTEs-orange)](sql/)
[![Tableau](https://img.shields.io/badge/Tableau-Interactive%20Dashboards-e97627)](tableau/)

End-to-end analysis of a multi-store computer hardware retailer. The project covers relational database design, advanced SQL analytics, data quality checks, and interactive reporting in Tableau.

![Dashboard Preview](visuals/dashboard_preview.png)

---

## Problem Statement

A computer retail chain needs clear visibility into store performance, product mix, customer demographics, and sales trends. Without structured analysis, decisions on inventory, pricing, and regional strategy rely on incomplete or siloed data.

This project builds a structured analytical layer on top of transactional data to answer core business questions and support data-driven decision making.

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
| 2 | Which stores generate the highest total revenue? | `SUM` + `RANK()` window function |
| 3 | How do sales break down by age group? | Demographic segmentation |
| 4 | Which products sell best in which regions? | Multi-table joins + regional grouping |
| 5 | How do RAM / CPU / screen size affect laptop sales? | Product attribute analysis |
| 6 | What are MoM and YoY sales trends? | `LAG()` window functions |
| 7 | Who are the top-spending customers vs. average? | Customer-level ranking + comparison |
| 8 | What is each product’s contribution % to store revenue? | Windowed totals + percentage of total |

---

## Methodology

### 1. Data Modeling
- Designed relational schema covering stores (`Dyqani`), products, invoices (`Fature`), line items, and trading relationships
- Defined primary/foreign keys and relationships for multi-store, multi-product analysis
- ER diagram available in `data/schema/relational_model.jpg`

### 2. SQL Analytics
Scripts are organized by analytical complexity:

| Stage | Focus | Techniques |
|-------|-------|------------|
| Schema | DDL | Tables, constraints, relationships |
| Objects | Database objects | Triggers, views, stored procedures |
| Joins | Multi-table analysis | Inner/outer joins across stores, products, invoices |
| Aggregations | Summary metrics | `GROUP BY`, `SUM`, `AVG`, `COUNT` |
| Math / derived metrics | Pricing & quantity logic | Calculated fields |
| Window functions | Ranking & trends | `RANK()`, `LAG()`, running totals, contribution % |
| Advanced reports | Business-ready outputs | Combined techniques for stakeholder questions |
| Data cleaning | Quality | Duplicate detection, outlier handling |

### 3. Visualization
- Built multiple Tableau workbooks covering revenue by store/region, age-group spending, product performance, and time trends
- Focused on clarity for non-technical stakeholders

### 4. Documentation & Reproducibility
- Ordered SQL scripts for repeatable execution
- Exported key query results as CSV
- Master analysis script consolidating core business queries

---

## Key Findings

| Area | Insight |
|------|---------|
| **Store performance** | Dyqani Mu (~2.17M) and Dyqani Beta (~2.04M) lead total revenue by a clear margin |
| **Geographic activity** | New York (12), Los Angeles (10), and San Jose (10) have the highest seller counts |
| **Customer segments** | Age group 25–34 accounts for the highest observed spend |
| **Product preferences** | Higher-spec configurations (e.g. 16GB RAM + Intel Core i5/i9) show stronger demand |
| **Regional mix** | Product demand varies by city/region (storage, monitors, peripherals) |
| **Time trends** | Window functions enable YoY and MoM comparison for trend monitoring |

> Full result sets: `data/results/`

---

## Skills Demonstrated

| Category | Skills |
|----------|--------|
| **SQL** | Complex joins, aggregations, window functions (`RANK`, `LAG`, partition logic), ranking, contribution analysis |
| **Data Modeling** | Relational design, normalization, constraints, ER modeling |
| **Data Quality** | Duplicate checks, outlier review, cleaning scripts |
| **BI / Visualization** | Tableau dashboard design for business audiences |
| **Business Analysis** | Translating business questions into measurable metrics and actionable insights |
| **Documentation** | Structured repository, reproducible scripts, clear README and presentation |

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
│   ├── 00_MASTER_ANALYSIS.sql          # Core business questions
│   ├── 01_schema_*.sql                 # DDL – tables & relationships
│   ├── 02_triggers_views_procedures.sql
│   ├── 03_joins_analysis*.sql          # Multi-table JOINs
│   ├── 04_aggregations.sql
│   ├── 04_math_functions*.sql
│   ├── 05_window_functions.sql         # RANK, LAG, running totals
│   ├── 06_advanced_reports*.sql
│   ├── 06_business_queries.sql
│   ├── 07_data_analysis.sql
│   ├── 08_data_cleaning.sql
│   └── 09_extra_queries_*.sql
│
├── data/
│   ├── schema/
│   │   └── relational_model.jpg
│   └── results/                        # Query outputs (CSV)
│
├── tableau/                            # Interactive workbooks (.twb)
│
└── visuals/
    └── dashboard_preview.png
```

---

## Tech Stack

- **SQL** – Schema design, joins, aggregations, window functions, ranking, trend analysis
- **Tableau** – Interactive dashboards for store, product, region, and demographic views
- **Data Quality** – Cleaning and validation scripts
- **Documentation** – ER diagram, presentation, exported results

---

## Getting Started

### Database
1. Run schema scripts (`01_schema_*.sql`) in order
2. Load source data
3. Apply `02_triggers_views_procedures.sql`
4. Execute analysis scripts (`03` → `09`) or use `00_MASTER_ANALYSIS.sql`

### Tableau
Open any `.twb` file in the `tableau/` folder with Tableau Desktop or Tableau Public.

### Results & Presentation
- Sample outputs: `data/results/`
- Project presentation: `Computer_Store_Sales_Analysis_Presentation.pptx`

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
| Analytical SQL (ordered) | `sql/00` → `sql/09` |
| Query result sets | `data/results/` |
| Tableau workbooks | `tableau/` |
| Project presentation | `Computer_Store_Sales_Analysis_Presentation.pptx` |
| Dashboard preview | `visuals/dashboard_preview.png` |

---

## Author

**Kristina Spahi**  
Computer Engineer · Data Analyst · Full-Stack Developer

- Email: [26spahikristi@gmail.com](mailto:26spahikristi@gmail.com)
- GitHub: [github.com/ProjectsALB](https://github.com/ProjectsALB/)

---

## License

MIT License — see [LICENSE](LICENSE).  
Shared for portfolio and educational use.
