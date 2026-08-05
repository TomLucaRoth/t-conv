import { useTranslation } from "react-i18next";

function Converter() {
  const { t } = useTranslation();

  return (
    <div className="flex w-screen flex-col items-center">
      <h2 className="font-heading text-[2.5rem] font-bold text-foreground">
        {t("converter.title")}
      </h2>
    </div>
  );
}

export default Converter;
