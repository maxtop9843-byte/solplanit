# SolPlanit Product Specification

## 1. Product definition

SolPlanit is a Korean-first solar installation decision platform that connects general users and solar professionals through tools, data, quotes, and community.

The product is not a collection of unrelated calculators. It is one guided journey:

> building information → installable capacity → generation → savings or revenue → quote request → expert comparison

## 2. Positioning

**Supporting line**

> 복잡한 태양광 설치, 더 쉽게

**Main headline**

> 태양광 설치, 처음부터 끝까지 한 번에

**Primary promise**

주소와 설치 면적만 입력하면 설치 가능한 용량과 예상 수익을 확인하고, 내 조건에 맞는 견적까지 받아볼 수 있어요.

## 3. Primary audiences

### General users

People considering solar installation on a house, commercial building, factory, warehouse, or land.

Primary questions:

- How much solar can I install?
- How much electricity can it generate?
- How much can I save or earn?
- Is a quote reasonable?
- Which professional should I trust?

### Professionals

Installers, designers, consultants, and solar businesses that need:

- Project generation analysis
- Orientation, tilt, and loss assumptions
- Economic analysis
- Customer-facing reports
- Qualified quote leads
- Case sharing and expert responses

## 4. URL structure

- `/home`: general-user guided flow
- `/pro`: professional project workspace
- `/community`: questions, quote review, cases, expert responses
- Shared identity, saved data, and community account system

## 5. General-user journey

### Step 1. Building information

Inputs:

- Building type: house, commercial building, factory/warehouse, land
- Installation area: m² or pyeong
- Region

Main question:

> 우리 건물에는 태양광을 얼마나 설치할 수 있을까?

### Step 2. Installable capacity

Outputs:

- Recommended installation capacity
- Estimated panel count
- Basic assumptions and limitations

### Step 3. Savings or revenue

The user chooses one goal:

- Reduce electricity bills through self-consumption
- Earn generation revenue through electricity sales

Outputs:

- Annual expected generation
- Monthly and annual savings or revenue
- Estimated payback period

### Step 4. Quote request

The calculation result is attached automatically to a quote or community post so professionals can respond with context.

## 6. Calculation baseline

- Daily generation = capacity (kW) × average daily generation hours
- Monthly generation = capacity × average daily generation hours × days in month
- Annual generation = capacity × average daily generation hours × 365
- Monthly REC quantity = monthly generation (kWh) × REC weight ÷ 1000
- REC revenue = REC quantity × REC price
- SMP revenue = monthly generation × SMP price
- Total generation revenue = SMP revenue + REC revenue

All results must be presented as estimates. Regional solar resource, roof geometry, shading, structural conditions, equipment efficiency, losses, tariff rules, and market prices may change actual results.

## 7. Professional MVP

Start with one integrated project workspace rather than many disconnected tools.

Core capabilities:

- PVGIS-based generation estimate
- Orientation and tilt inputs
- System losses
- Monthly and annual production
- Economic assumptions
- Report-ready result summary
- Import of a general-user calculation into a professional project

## 8. Community MVP

Categories:

- 설치 전 질문
- 견적 검토
- 설치 후기
- 전문가 답변
- 실제 발전량

The community is not a separate content island. It receives structured calculation data and connects it to professional responses.

## 9. Product principles

1. A complete beginner must understand the next action without learning solar jargon first.
2. Each screen should have one dominant question or action.
3. Advanced assumptions remain hidden until needed.
4. Results must show assumptions and uncertainty clearly.
5. The product must remain neutral and enable comparison rather than push one installer.
6. Mobile and desktop flows must both support the full journey.
7. General and professional experiences are separated by URL but share data and identity.
