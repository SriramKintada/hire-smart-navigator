
  

<p  align="center">



</p>

<p  align="center"><h1  align="center">HIRE-SMART-NAVIGATOR</h1></p>

<p  align="center">

<em><code>An AI-powered intelligent hiring assistant for resume credibility and screening</code></em>

</p>

<p  align="center">

<img  src="https://img.shields.io/github/license/SriramKintada/hire-smart-navigator?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff"  alt="license">

<img  src="https://img.shields.io/github/last-commit/SriramKintada/hire-smart-navigator?style=default&logo=git&logoColor=white&color=0080ff"  alt="last-commit">

<img  src="https://img.shields.io/github/languages/top/SriramKintada/hire-smart-navigator?style=default&color=0080ff"  alt="repo-top-language">

<img  src="https://img.shields.io/github/languages/count/SriramKintada/hire-smart-navigator?style=default&color=0080ff"  alt="repo-language-count">

</p>

  

---

  

## Table of Contents

  

-  [ Overview](#-overview)

-  [ Features](#-features)

-  [ Project Structure](#-project-structure)

-  [ Project Index](#-project-index)

-  [ Getting Started](#-getting-started)

-  [ Prerequisites](#-prerequisites)

-  [ Installation](#-installation)

-  [ Usage](#-usage)

-  [ Testing](#-testing)

-  [ Project Roadmap](#-project-roadmap)

-  [ Contributing](#-contributing)

-  [ License](#-license)

-  [ Acknowledgments](#-acknowledgments)

  

---

  

## 🧠 Overview

  

**HIRE-SMART-NAVIGATOR** is an intelligent hiring assistant designed to revolutionize the recruitment process using AI-driven resume parsing, credibility analysis, and smart candidate screening. Built for recruiters and HR teams, the platform streamlines candidate evaluation through natural language prompts, automated resume assessments, and real-time analytics — enabling faster and smarter hiring decisions.

  

Whether you're screening thousands of applications or validating candidate claims, **HIRE-SMART-NAVIGATOR** leverages LLMs and modern UI tools to enhance transparency, reduce manual workload, and uncover top-tier talent effortlessly.

  

---

  

## 🚀 Features

  

-  **AI Resume Screener**: Input your hiring criteria via natural language, upload a CSV of applicants, and instantly get a ranked list of top-matching candidates with contact shortcuts.

-  **Credibility Scoring Engine**: Uses large language models (LLMs) to analyze resumes for suspicious patterns like overlapping job periods, unverifiable institutions, and gives a "credibility score" along with red flags.

-  **Interactive Dashboards**: Visualize skill distributions, career timelines, and credibility metrics using heatmaps, charts, and breakdowns.

-  **Bulk Resume Upload**: Drag and drop hundreds of resumes and receive structured insights for each profile automatically.

-  **AI-Driven Red Flag Detection**: Highlights potential issues in resumes such as unrealistic experiences, fake companies, or inconsistent timelines.

-  **Integrated Communication Panel**: Instantly contact shortlisted candidates via email with one-click interaction.

-  **Privacy-Conscious Architecture**: Local parsing options and encrypted storage to ensure candidate data remains protected.

-  **Modular Microservices**: Backend built with Python Flask; frontend with React + Tailwind + TypeScript, integrated via Docker and Supabase.

  

---

  

## Project Structure

  

```sh

└──  hire-smart-navigator/

├──  Dockerfile

├──  LICENSE

├──  README.md

├──  backend

│  ├──  .env

│  ├──  external_integrations

│  ├──  requirements.txt

│  └──  server.py

├──  backend_test.py

├──  bun.lockb

├──  components.json

├──  entrypoint.sh

├──  eslint.config.js

├──  frontend

│  ├──  .env

│  ├──  .gitignore

│  ├──  README.md

│  ├──  package.json

│  ├──  postcss.config.js

│  ├──  public

│  ├──  src

│  ├──  tailwind.config.js

│  └──  yarn.lock

├──  index.html

├──  next.config.js

├──  nginx.conf

├──  package-lock.json

├──  package.json

├──  postcss.config.js

├──  public

│  ├──  favicon.ico

│  ├──  placeholder.svg

│  └──  robots.txt

├──  requirements.txt

├──  sample_resume.html

├──  sample_resume.txt

├──  scripts

│  └──  update-and-start.sh

├──  server.log

├──  src

│  ├──  App.css

│  ├──  App.tsx

│  ├──  components

│  ├──  hooks

│  ├──  index.css

│  ├──  integrations

│  ├──  lib

│  ├──  main.tsx

│  ├──  pages

│  ├──  services

│  ├──  utils

│  └──  vite-env.d.ts

├──  supabase

│  └──  config.toml

├──  tailwind.config.ts

├──  test_result.md

├──  tests

│  └──  __init__.py

├──  tsconfig.app.json

├──  tsconfig.json

├──  tsconfig.node.json

├──  vite.config.ts

└──  yarn.lock

```

  

---

  

## Getting Started

  

### Prerequisites

  

Before getting started with hire-smart-navigator, ensure your runtime environment meets the following requirements:

  

-  **Programming Language:** TypeScript, Python 3.8+

-  **Package Manager:** Yarn, npm, pip

-  **Container Runtime:** Docker (optional, for containerized deployment)

  

### Installation

  

Install hire-smart-navigator using one of the following methods:

  

**Build from source:**

  

1. Clone the hire-smart-navigator repository:

  

```sh

❯  git  clone  https://github.com/SriramKintada/hire-smart-navigator.git

```

  

2. Navigate to the project directory:

  

```sh

❯  cd  hire-smart-navigator

```

  

3. Install the project dependencies:

  

**Using `yarn`**

  

```sh

❯  yarn  install

```

  

**Using `npm`**

  

```sh

❯  npm  install


  



  



```

  

**Using `docker`**

  

```sh

❯  docker  build  -t  sriramkintada/hire-smart-navigator  .

```

  

### Usage

  

Run hire-smart-navigator using the following command:

  

**Using `yarn`**

  

```sh

❯  yarn  start

```

  

**Using `npm`**

  

```sh

❯  npm  start

```

  



  

**Using `docker`**

  

```sh

❯  docker  run  -it  sriramkintada/hire-smart-navigator

```

  

### Testing

  

Run the test suite using the following command:

  

**Using `yarn`**

  

```sh

❯  yarn  test

```

  

**Using `npm`**

  

```sh

❯  npm  test

```

  

**Using `pip`**

  

```sh

❯  pytest

```

  

---

  

## Project Roadmap

  

-  [X]  **`Task 1`**: <strike>Implement AI Resume Parsing and Screening.</strike>

-  [X] **`Task 2`**: Implement AI Credibility Scoring and Red Flag Detection.

-  [X] **`Task 3`**: Develop Integrated Communication and Dashboard Features.

  

---

  

## Contributing

  

-  **💬 [Join the Discussions](https://github.com/SriramKintada/hire-smart-navigator/discussions)**: Share your insights, provide feedback, or ask questions.

-  **🐛 [Report Issues](https://github.com/SriramKintada/hire-smart-navigator/issues)**: Submit bugs found or log feature requests for the `hire-smart-navigator` project.

-  **💡 [Submit Pull Requests](https://github.com/SriramKintada/hire-smart-navigator/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

  

<details  closed>

<summary>Contributing Guidelines</summary>

  

1.  **Fork the Repository**: Start by forking the project repository to your github account.

2.  **Clone Locally**: Clone the forked repository to your local machine using a git client.

```sh

git clone https://github.com/SriramKintada/hire-smart-navigator

```

3.  **Create a New Branch**: Always work on a new branch, giving it a descriptive name.

```sh

git checkout -b new-feature-x

```

4.  **Make Your Changes**: Develop and test your changes locally.

5.  **Commit Your Changes**: Commit with a clear message describing your updates.

```sh

git commit -m 'Implemented new feature x.'

```

6.  **Push to github**: Push the changes to your forked repository.

```sh

git push origin new-feature-x

```

7.  **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

8.  **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!

</details>

  

---

  

## License

  

This project is protected under the [MIT License](https://choosealicense.com/licenses/mit/). For more details, refer to the [LICENSE](LICENSE) file.

  

---

  

## Acknowledgments

  

- Thanks to all contributors and the open-source community.

- Inspired by advancements in AI and hiring automation technologies.

- Built using Python, React, Tailwind CSS, Docker, and Supabase.

  

---
