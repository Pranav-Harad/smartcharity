# SmartCharity: AI-Powered Transparent Donation Platform

SmartCharity is an enterprise-grade, full-stack philanthropy platform designed to eliminate the "trust deficit" in the non-profit sector. By synthesizing **Generative AI (Google Gemini 3 Flash)** for automated impact storytelling and **Cryptographic Auditing (SHA-256 Hashing)** for financial data immutability, the platform ensures that charity is both narratively engaging and mathematically verifiable.

---

## 🚀 Key Features

* **AI-Driven Impact Lab:** NGO administrators can upload technical or raw operational data logs. The platform leverages Google Gemini to automatically synthesize complex metrics into a human-centric, 3-sentence "Impact Story" for donors.
* **Cryptographic Donation Seals:** Every transaction undergoes a backend SHA-256 calculation combining the `transactionId`, `amount`, `donorId`, and high-precision `timestamp` to generate an un-tamperable digital fingerprint.
* **Donor Impact Passport:** A gamified, interactive dashboard for donors to track their lifetime contribution history, inspect their transaction cryptographic seals, and view accrued "Impact Points."
* **Role-Based Access Control (RBAC):** Secure authorization architecture managed via Spring Security and stateless JSON Web Tokens (JWT), drawing hard lines between `DONOR`, `NGO_ADMIN`, and `PLATFORM_ADMIN` capabilities.
* **Cloud-Native and Resilient:** Monorepo architecture containerized via multi-stage Docker builds and deployed across a distributed cloud topology (Vercel + Render + MongoDB Atlas).

---

## 🛠️ Technology Stack

| Architecture Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI/UX** | React.js, Vite, Tailwind CSS, Framer Motion, React Router v6 |
| **Backend Core** | Java 17, Spring Boot 3.x, Spring Data MongoDB, Spring Security |
| **Database** | MongoDB Atlas (Cloud NoSQL Cluster) |
| **AI Integration** | Google Generative AI SDK (Gemini 3 Flash API) |
| **Security & Authn** | JSON Web Tokens (JWT), BCrypt Password Encoder, SHA-256 |
| **Testing Frameworks** | JUnit 5, Mockito, Postman API Client |
| **DevOps & Hosting** | Docker (Multi-Stage), Render (Backend), Vercel (Frontend) |

---

## 📁 Repository Structure

```text
smartcharity-monorepo/
├── smartcharity-frontend/          # React SPA Client
│   ├── src/
│   │   ├── components/            # Reusable Atomic UI Elements
│   │   ├── context/               # Global State (AuthContext, JWT Management)
│   │   ├── pages/                 # NGO Dashboard, Donor Passport, Impact Feed
│   │   └── utils/                 # apiFetch Wrapper with Auto-Token Injection
│   ├── package.json
│   └── vite.config.js
│
└── smartcharity-backend/           # Spring Boot REST API
    ├── src/
    │   ├── main/java/com/smartcharity/
    │   │   ├── config/            # WebConfig, SecurityConfig (CORS Whitelisting)
    │   │   ├── controller/        # REST Endpoints (Auth, NGO, Mission, Donation)
    │   │   ├── dto/               # Input Validation JSR-303 Data Payloads
    │   │   ├── model/             # MongoDB Documents (User, Ngo, Mission)
    │   │   ├── repository/        # Spring Data Mongo Repositories
    │   │   └── service/           # Core Logic (GeminiService, DonationService)
    │   └── test/java/com/smartcharity/
    │       ├── DonationServiceTest.java     # JUnit Fund Aggregation Tests
    │       ├── DonationValidationTest.java  # Mockito Defensive/Error Tests
    │       └── DonationRewardTest.java      # Mockito Interaction Orchestration Tests
    ├── Dockerfile
    └── pom.xml

```
---

## ⚙️ Architecture & Data Flow

* **Authentication:** User logs in via React `POST` -> Backend validates via `BCrypt` against MongoDB -> Generates signed `HS256` JWT -> Client stores token in `localStorage`.
* **Donation Integrity Chain:** Donor triggers contribution -> `DonationService` validates target entity -> Computes SHA-256 string -> Commits record + cryptographic hash ledger dynamically -> Triggers `RewardService` to increment user loyalty parameters.
* **AI Summarization Pipeline:** NGO Admin posts raw technical spreadsheets to `/api/ai/simplify` -> `GeminiService` wraps payload in systematic system instructions -> Gemini 3 Flash extracts key achievements -> Sanitized prose returned to client state.

---

## 🔧 Installation & Local Setup

### Prerequisites
* Java JDK 17 or higher
* Node.js v18+ & npm
* MongoDB (Local instance or Atlas URI string)
* Google Gemini API Key

### Step 1: Clone the Repository
```bash
git clone [https://github.com/yourusername/smartcharity.git](https://github.com/yourusername/smartcharity.git)
cd smartcharity
```
### Step 2: Configure Backend Environment Variables
Create an `application.properties` or environment variables export file in `smartcharity-backend/src/main/resources/`:

```properties
spring.data.mongodb.uri=your_mongodb_atlas_connection_string
jwt.secret=your_high_entropy_256_bit_secret_key_here
gemini.api.key=your_google_gemini_api_key
server.port=9090
```
### Step 3: Run the Backend Engine
```bash
cd smartcharity-backend
mvn clean install
mvn spring-boot:run
```
### Step 4: Run the Frontend Client
Open a new terminal window:

```bash
cd smartcharity-frontend
npm install
npm run dev
```
The client application will start running on `http://localhost:5173`.

---

## 🧪 Automated Testing Pipeline

The backend implements rigorous test-driven design philosophies leveraging standalone unit tests and isolated mocking infrastructures.

To execute the full testing ecosystem, run:

```bash
cd smartcharity-backend
mvn test
```
### Highlighted Test Contexts
* **SecurityUtilsTest:** Validates the cryptographic determinism and avalanche integrity properties of the calculated SHA-256 transaction seals.
* **DonationValidationTest (Mockito):** Simulates broken data flows (e.g., an invalid `ngoId`) by forcing repositories to yield `Optional.empty()`. Ensures that the platform accurately drops execution flags, raises custom runtime errors, and completely aborts database insertions.
* **DonationRewardTest (Mockito):** Employs `verify()` logic to ensure decoupled modules (Donation Handler and Gamification Processor) trigger in synchronous harmony.

---

## 🐳 Docker Deployment Strategy

The production build handles software deployment natively using a highly optimal, multi-stage `Dockerfile` to guarantee runtime security and image minification.

```dockerfile
# Stage 1: Dynamic Compilation Environment
FROM maven:3.9-eclipse-temurin AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Hardened, Slim Runtime Container
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/smartcharity-backend-*.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]
```
## 📈 SDG Alignment

This framework actively targets and fulfills the parameters set out by the United Nations Sustainable Development Goals:

* **SDG 9 (Industry, Innovation, and Infrastructure):** Introducing cloud-native architecture patterns and advanced LLM pipelines to outdated non-profit operations.
* **SDG 16 (Peace, Justice, and Strong Institutions):** Mitigating tracking opacity through cryptographically anchored data logs.

## Author 👨‍💻
Made with ❤️ by **Pranav**  
📧 Email: [pranavharad64@gmail.com](mailto:pranavharad64@gmail.com)  
🔗 LinkedIn: [www.linkedin.com/in/pranav-harad-667070268](https://www.linkedin.com/in/pranav-harad-667070268)
