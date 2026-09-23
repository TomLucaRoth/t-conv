import { useTranslation } from "react-i18next";
import ParameterPicker from "./ParameterPicker";

function Converter() {
  const { t } = useTranslation();

  return (
    <div className="flex w-[70vw] flex-col p-5">
      <h2 className="font-heading text-[2rem] font-semibold text-foreground">
        {t("converter.title")}
      </h2>
      <p className="text-muted-foreground">{t("converter.description")}</p>
      <ParameterPicker />
    </div>
  );
}

export default Converter;
