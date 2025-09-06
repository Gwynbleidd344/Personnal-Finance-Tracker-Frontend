import { useState } from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';
import Switch from './UI/DarkModeButton';

export default function NavBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [username] = useLocalStorage('username', 'User');
  const { t } = useTranslation();

  const textAnimation = (extraClasses = '') =>
    `transition-all duration-300 delay-150 transform ${
      isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
    } ${extraClasses}`;

  return (
    <nav
      className={`sticky top-6 left-0 m-6 mr-0 flex h-[94vh] flex-col justify-between 
        rounded-lg bg-gray-100 dark:bg-gray-800 p-6 shadow-md transition-all duration-300
        ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-3">
        <i className="bxr bx-user rounded-full border-4 border-b-blue-600 p-2 text-3xl text-gray-800 dark:text-white"></i>
        <span className={`${textAnimation('text-xl font-medium text-gray-800 dark:text-white')}`}>
          {username}
        </span>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-4 font-medium text-gray-700 dark:text-gray-200">
        <Link to="/dashboard">
          <div className="flex cursor-pointer items-center space-x-2 hover:text-blue-600">
            <i className="bxr bx-pie-chart-alt text-2xl"></i>
            <span className={textAnimation()}>{t("dashboard")}</span>
          </div>
        </Link>

        <Link to="/incomes">
          <div className="flex cursor-pointer items-center space-x-2 hover:text-green-600">
            <i className="bxr bx-wallet-note text-2xl"></i>
            <span className={textAnimation()}>{t("incomes")}</span>
          </div>
        </Link>

        <Link to="/expenses">
          <div className="flex cursor-pointer items-center space-x-2 hover:text-indigo-600">
            <i className="bxr bx-dollar-circle text-2xl"></i>
            <span className={textAnimation()}>{t("expenses")}</span>
          </div>
        </Link>

        <Link to="/categories">
          <div className="flex cursor-pointer items-center space-x-2 hover:text-blue-600">
            <i className="bxr bx-folder text-2xl"></i>
            <span className={textAnimation()}>{t("categories")}</span>
          </div>
        </Link>

        <div className="my-6 w-full border border-gray-300 dark:border-gray-600"></div>

        <Link to="/settings">
          <div className="flex cursor-pointer items-center space-x-2 hover:text-slate-600">
            <i className="bxr bx-cog text-2xl"></i>
            <span className={textAnimation()}>{t("settings")}</span>
          </div>
        </Link>

        <Link to="/support">
          <div className="flex cursor-pointer items-center space-x-2 hover:text-sky-600">
            <i className="bxr bx-message-question-mark text-2xl"></i>
            <span className={textAnimation()}>{t("support")}</span>
          </div>
        </Link>
      </div>

      {/* Footer / Logout */}
      <Link to="/login">
        <div className="flex cursor-pointer items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-red-600">
          <i className="bxr bx-arrow-out-left-square-half text-2xl"></i>
          <span onClick={() => localStorage.removeItem("accessToken")} className={textAnimation("text-xl font-medium")}>
            {t("logout")}
          </span>
        </div>
      </Link>
    </nav>
  );
}
