import { useTranslation } from "react-i18next";
import ParameterPicker from "./ParameterPicker";

function Converter() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col p-5 w-[70vw]">
      <h2 className="text-foreground font-heading text-[2rem] font-semibold">{t("converter.title")}</h2>
      <p className="text-muted-foreground">{t("converter.description")}</p>
      <ParameterPicker />
    </div>
  );
}

export default Converter;
