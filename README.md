# NumWiz! 🧙‍♂️🔢

**A creative, fun, and gamified web app calculator designed to make math engaging for kids and teenagers!**

Num Wiz! goes beyond simple calculations by incorporating a "Unlock Num Wiz Features" mini-game. Users collect power-up badges by discovering mathematical quirks, historical connections, and performing specific calculations. The journey starts with a Basic Calculator, and by collecting badges, users can unlock the more powerful Scientific Calculator and other cool features.

## 🎯 Target Audience

* Kids and Teenagers

## ✨ Features

* **Basic Calculator Mode:** Standard arithmetic operations (+, -, ×, ÷, %).
* **Scientific Calculator Mode (Unlockable):** Advanced functions including trigonometric (sin, cos, tan), logarithms (ln, log₁₀), powers (x², x³), roots (√, ³√), factorial (x!), and constants (π, e).
* **Power-Up Dashboard:** Visual display of unlockable badges.
* **Badge Collection:**
    * **Basic Badges:** Collect 5 specific badges in Basic Mode to unlock Scientific Mode (e.g., "Pi Pioneer," "Lucky Seven Charm," "Zero Hero").
    * **Scientific Badges:** Collect additional badges within Scientific Mode (e.g., "Exponential Explorer," "Logarithm Legend").
    * *(Planned) Secret Badges:* Rare power-ups for extra bragging rights.
* **"Did You Know?" Facts:** Educational and fun facts related to math, history, and science, triggered by calculations.
* **Responsive Design:** Adapts to different screen sizes (mobile, tablet, desktop).
* **Interactive UI:** Engaging visuals and user feedback.

## 🛠️ Tech Stack

* **Frontend:** React with TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS & Custom CSS
* **State Management:** React Hooks (`useState`, `useCallback`, `useEffect`, custom hooks)

## 🚀 Project Status: Work In Progress (WIP)

Num Wiz! is currently under active development. Many core features are implemented, but some advanced functionalities and content are still being worked on.

### Key "WIP" Functions & Areas:

* **Scientific Calculator Enhancements:**
    * **Parentheses `(` `)`:** Full parsing for order of operations.
    * **Memory Functions:** `mc`, `m+`, `m-`, `mr`.
    * **`2nd` Function Toggle:** To access inverse trigonometric functions (e.g., sin⁻¹, cos⁻¹, tan⁻¹) and other secondary operations.
    * **`xʸ` and `ʸ√x`:** Binary scientific operations requiring two inputs.
    * **`EE` (Scientific Notation Input):** Allowing users to input numbers in scientific notation.
    * **`Rad/Deg` Toggle:** For switching angle modes in trigonometric functions.
* **Badges & Facts:**
    * Implementing unlock conditions for all planned Scientific Badges.
    * Adding more Secret Badges with unique and challenging unlock criteria.
    * Expanding the database of "Did You Know?" facts with more variety and depth.
* **Themed Skins (Future):** Customizable themes for the calculator based on unlocked achievements (e.g., "Geometry Guru," "Algebra Ace").
* **Advanced Accessibility Features (Future):**
    * High-contrast theme options.
    * Auditory feedback for button presses and power-up unlocks (with a toggle).

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18.x or later recommended)
* npm (v9.x or later) or yarn

### Installation

1.  **Clone the repository (if you have one set up on GitHub/GitLab etc.):**
    ```bash
    git clone <your-repository-url>
    cd num-wiz
    ```
    *(If you are working locally without a remote repo yet, you can skip this step and just navigate to your project directory: `cd num-wiz`)*

2.  **Install NPM packages:**
    ```bash
    npm install
    ```
    *(Or if using yarn: `yarn install`)*

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`. The app will automatically reload if you make changes to the code.

## 📜 Available Scripts

In the project directory, you can run:

* `npm run dev`: Runs the app in development mode.
* `npm run build`: Builds the app for production to the `dist` folder.
* `npm run lint`: Lints and formats the codebase (Vite's default TS template includes ESLint).
* `npm run preview`: Serves the production build locally for preview.

## 🗺️ Future Implementations / Roadmap

Beyond the current WIP items, future enhancements could include:

* ✅ **Complete all placeholder scientific functions.**
* ⚙️ **Implement "2nd" function toggle for scientific calculator.**
* 📐 **Implement Radian/Degree mode toggle.**
* 💾 **Add memory functions (M+, M-, MR, MC).**
* 🧮 **Implement robust parentheses logic for order of operations.**
* 🏅 **Add more diverse badges (secret and scientific) with unique unlock conditions.**
* 🧠 **Expand the "Did YouKnow?" fact database with more categories and interactivity.**
* 🎨 **Develop themed skins for the calculator.**
* 🧪 **Write comprehensive unit and integration tests (e.g., using Vitest and React Testing Library).**
* ♿ **Further enhance accessibility (e.g., keyboard navigation improvements, ARIA attributes, focus management).**
* 👤 *(Stretch Goal)* User accounts/profiles to save progress and badge collections.

## 🙌 Contributing

Contributions make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

Made with 💚 and lots of 🔢!
