import logo from "@/assets/placeholder-logo.png";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className="flex h-20 w-screen flex-row items-center bg-primary">
      <img src={logo} alt={t("app.logoAlt")} className="h-[70%] px-3" />
      <h1 className="font-heading text-[2.5rem] font-bold text-primary-foreground">
        {t("app.name")}
      </h1>
    </div>
  );
}

export default Header;
