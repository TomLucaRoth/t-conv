import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast"
import { Checkbox } from "./ui/checkbox";
import {
  Field,
  FieldTitle,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input";
import { useConversionParametersStore } from "@/stores/conversionParameterStore";
import { X, RefreshCw } from "lucide-react";
import {
  OpenFolder,
  OpenInputFilePicker,
  OpenInputFolderPicker,
  OpenSaveLocationPicker,
} from "../../wailsjs/go/backend/App";

export function isValidFileSuffix(suffix: string): boolean {
  const containsInvalidCharacter =
    /[<>:"/\\|?*]/.test(suffix) ||
    Array.from(suffix).some((character) => character.charCodeAt(0) < 32);
  const hasInvalidEnding = /[ .]$/.test(suffix);

  return !containsInvalidCharacter && !hasInvalidEnding;
}

function ParameterPicker() {
  const { t } = useTranslation();
  const { useLRF, setUseLRF, inputFiles, setInputFiles, outputFolder, setOutputFolder } =
    useConversionParametersStore();
  const [suffix, setSuffix] = useState("");
  const [nudgeInputButtons, setNudgeInputButtons] = useState(false);
  const [nudgeOutputButton, setNudgeOutputButton] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);
  const suffixIsInvalid = !isValidFileSuffix(suffix);

  const convertBtnTooltip = (() => {
    if (inputFiles.length === 0) {
      return "selectInputFiles";
    }
    if (outputFolder === "") {
      return "selectOutputFolder"
    }
    return ""
  })()

  const handleSelectFiles = () => {
    OpenInputFilePicker().then((chosenFiles) => {
      if (chosenFiles.length === 0) {
        return;
      }
      setInputFiles(chosenFiles);
      setConvertError((error) => (error === "selectInputFiles" ? null : error));
    });
  };

  const handleSelectInputFolder = () => {
    OpenInputFolderPicker().then((selectedFiles) => {
      if (selectedFiles.length === 0) {
        toast.add({
          type: "warning",
          title: t("parameterPicker.noFilesFoundTitle"),
          description: t("parameterPicker.noFilesFoundDescription")
        })
        return;
      }
      setInputFiles(selectedFiles);
      setConvertError((error) => (error === "selectInputFiles" ? null : error));
    });
  };

  const handleSelectOutputFolder = () => {
    OpenSaveLocationPicker().then((chosenFolder) => {
      if (chosenFolder === "") {
        return;
      }
      setOutputFolder(chosenFolder);
      setConvertError((error) => (error === "selectOutputFolder" ? null : error));
    });
  };

  const handleConvert = () => {
    setNudgeInputButtons(inputFiles.length === 0);
    setNudgeOutputButton(outputFolder === "");
    setConvertError(convertBtnTooltip || null);
  };

  return (
    <div className="flex flex-col pt-4">
      <h3 className="pt-2 font-heading font-semibold">{t("parameterPicker.settings")}</h3>
      <FieldGroup className="py-2">
        <Field orientation={"horizontal"}>
          <Checkbox
            checked={useLRF}
            onCheckedChange={setUseLRF}
            id="use-lrf-checkbox"
            name="use-lrf-checkbox"
          />
          <FieldContent>
            <FieldLabel htmlFor="use-lrf-checkbox">
              {t("parameterPicker.useLRFCheckbox")}
            </FieldLabel>
            <FieldDescription>{t("parameterPicker.useLRFDescription")}</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
      <Separator className={"mt-1 mb-2"} />
      <h3 className="pb-2 font-heading font-semibold">{t("parameterPicker.input")}</h3>
      {inputFiles.length !== 0 ? (
        <div className="flex flex-row items-center gap-2">
          <p>{t("parameterPicker.filesSelected", { count: inputFiles.length })}</p>
          <Tooltip>
            <TooltipTrigger>
              <Button variant={"outline"} size={"icon-lg"} onClick={() => setInputFiles([])}>
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{t("parameterPicker.clearFileSelection")}</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          <Tooltip>
            <TooltipTrigger>
              <Button
                className={`w-32 ${nudgeInputButtons ? "animate-nudge" : ""}`}
                size={"lg"}
                onClick={handleSelectFiles}
                onAnimationEnd={() => setNudgeInputButtons(false)}
              >
                {t("parameterPicker.selectFiles")}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t("parameterPicker.selectFilesTip")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button
                className={`w-32 ${nudgeInputButtons ? "animate-nudge" : ""}`}
                size={"lg"}
                onClick={handleSelectInputFolder}
                onAnimationEnd={() => setNudgeInputButtons(false)}
              >
                {t("parameterPicker.selectFolder")}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t("parameterPicker.selectFolderTip")}</TooltipContent>
          </Tooltip>
        </div>
      )}
      <Separator className={"mt-3 mb-2"} />
      <h3 className="pt-2 pb-2 font-heading font-semibold">{t("parameterPicker.output")}</h3>
      <FieldGroup>
        <Field data-invalid={suffixIsInvalid}>
          <FieldLabel htmlFor="input-suffix">{t("parameterPicker.suffix")}</FieldLabel>
          <Input
            id="input-suffix"
            value={suffix}
            onChange={(event) => setSuffix(event.target.value)}
            placeholder="-converted"
            aria-invalid={suffixIsInvalid}
            aria-describedby={
              suffixIsInvalid
                ? "input-suffix-description input-suffix-error"
                : "input-suffix-description"
            }
          />
          <FieldDescription id="input-suffix-description">
            {t("parameterPicker.suffixDescription")}
          </FieldDescription>
          {suffixIsInvalid && (
            <FieldError id="input-suffix-error">{t("parameterPicker.invalidSuffix")}</FieldError>
          )}
        </Field>
        <Field>
          <FieldTitle id="output-location-title">
            {t("parameterPicker.outputLocation")}
          </FieldTitle>

          <FieldDescription id="output-location-description">
            {outputFolder === "" ? (
              t("parameterPicker.noOutputFolderSelected")
            ) : (
              <>
                {t("parameterPicker.outputLocationDescription")}
                <Button
                  onClick={() => void OpenFolder(outputFolder)}
                  className="h-auto p-0"
                  variant="link"
                >
                  {outputFolder}
                </Button>
              </>
            )}
          </FieldDescription>

          <Button
            onClick={handleSelectOutputFolder}
            onAnimationEnd={() => setNudgeOutputButton(false)}
            aria-describedby="output-location-description"
            className={`max-w-[40%] ${nudgeOutputButton ? "animate-nudge" : ""}`}
          >
            {t(
              outputFolder === ""
                ? "parameterPicker.selectOutputFolder"
                : "parameterPicker.changeOutputFolder",
            )}
          </Button>
        </Field>
      </FieldGroup>
      <Separator className={"mt-3 mb-2"} />
      {convertError && (
        <p className="mb-1 text-xs text-destructive">
          {t("parameterPicker.convertToolTip." + convertError)}
        </p>
      )}
      <Tooltip disabled={convertBtnTooltip === ""}>
        <TooltipTrigger>
          <Button className={"w-fit px-10"} onClick={handleConvert}>
            <RefreshCw data-icon="inline-center" />{t("parameterPicker.convert")}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{t("parameterPicker.convertToolTip." + convertBtnTooltip)}</TooltipContent>
      </Tooltip>
    </div>
  );
}

export default ParameterPicker;
