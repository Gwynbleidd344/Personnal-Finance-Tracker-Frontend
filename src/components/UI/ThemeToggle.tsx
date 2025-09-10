import { FaSun, FaMoon } from "react-icons/fa";
import useDarkMode from "../../hooks/useDarkMode";
import { useTranslation } from "react-i18next";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useDarkMode();
  const { t } = useTranslation()

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div>
      <h2 className="font-semibold text-xl mt-6 text-black dark:text-gray-100 mb-2">
        {t("change_theme", "Change Theme")}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {t("choose_your_theme", "Choose the theme you prefer between Light and Dark mode")}.
      </p>

      <div className="relative w-[90px] h-[40px]">
        <label className="relative block w-full h-full cursor-pointer">
          <input
            type="checkbox"
            className="hidden peer"
            checked={darkMode}
            onChange={toggleTheme}
          />
          <span
            className={`absolute w-full h-full rounded-full border-2 transition-colors duration-300 
              ${darkMode ? "bg-gray-800 border-gray-800" : "bg-gray-300 border-gray-500"}`}
          />
          <span
            className={`absolute top-[7px] left-[10px] w-[25px] h-[25px] flex items-center justify-center rounded-full transition-transform duration-300
              ${darkMode ? "" : "translate-x-[45px]"}`}
          >
            {darkMode ? <FaMoon className="text-white text-xl" /> : <FaSun className="text-black dark:text-gray-100 text-xl" />}
          </span>
        </label>
      </div>
    </div>
  );
}
