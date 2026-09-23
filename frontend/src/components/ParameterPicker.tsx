import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input";
import { useConversionParametersStore } from "@/stores/conversionParameterStore";
import { X } from 'lucide-react';
import { OpenInputFilePicker, OpenInputFolderPicker } from "../../wailsjs/go/backend/App"

export function isValidFileSuffix(suffix: string): boolean {
  const containsInvalidCharacter =
    /[<>:"/\\|?*]/.test(suffix) ||
    Array.from(suffix).some((character) => character.charCodeAt(0) < 32);
  const hasInvalidEnding = /[ .]$/.test(suffix);

  return !containsInvalidCharacter && !hasInvalidEnding;
}

function ParameterPicker() {
  const { t } = useTranslation();
  const { useLRF, setUseLRF, inputFiles, setInputFiles } = useConversionParametersStore();
  const [suffix, setSuffix] = useState("");
  const suffixIsInvalid = !isValidFileSuffix(suffix);

  const handleSelectFiles = () => {
    OpenInputFilePicker().then((inputFiles) => {
      if (inputFiles.length === 0) {
        return;
      }
      setInputFiles(inputFiles);
    })
  }

  const handleSelectFolder = () => {
    OpenInputFolderPicker().then((inputFiles) => {
      if (inputFiles.length === 0) {
        return;
      }
      setInputFiles(inputFiles);
    })
  }

  return (
    <div className="flex flex-col pt-4">
      <h3 className="font-heading font-semibold pt-2">{t("parameterPicker.settings")}</h3>
      <FieldGroup className="py-2">
        <Field orientation={"horizontal"}>
          <Checkbox checked={useLRF} onCheckedChange={setUseLRF} id="use-lrf-checkbox" name="use-lrf-checkbox"/>
          <FieldContent>
            <FieldLabel htmlFor="use-lrf-checkbox">
              {t("parameterPicker.useLRFCheckbox")}
            </FieldLabel>
            <FieldDescription>
              {t("parameterPicker.useLRFDescription")}
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
      <Separator className={"mt-1 mb-2"}/>
      <h3 className="font-heading font-semibold pb-2">{t("parameterPicker.input")}</h3>
      {inputFiles.length !== 0 ? (
        <div className="flex flex-row items-center gap-2">
          <p>{t("parameterPicker.filesSelected", { numberOfFiles: inputFiles.length })}</p>
          <Tooltip>
            <TooltipTrigger>
              <Button variant={"outline"} size={"icon-lg"} onClick={() => setInputFiles([])}>
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {t("parameterPicker.clearFileSelection")}
            </TooltipContent>
          </Tooltip>
        </div>
      ) : (
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger>
            <Button className="w-32" size={"lg"} onClick={handleSelectFiles}>{t("parameterPicker.selectFiles")}</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {t("parameterPicker.selectFilesTip")}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button className="w-32" size={"lg"} onClick={handleSelectFolder}>{t("parameterPicker.selectFolder")}</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {t("parameterPicker.selectFolderTip")}
          </TooltipContent>
        </Tooltip>
      </div>
      )}
      <Separator className={"mt-3 mb-2"}/>
      <h3 className="font-heading font-semibold pb-2 pt-2">{t("parameterPicker.output")}</h3>
      <FieldGroup>
        <Field data-invalid={suffixIsInvalid}>
          <FieldLabel htmlFor="input-suffix">{t("parameterPicker.suffix")}</FieldLabel>
          <Input
            id="input-suffix"
            value={suffix}
            onChange={(event) => setSuffix(event.target.value)}
            placeholder="-converted"
            aria-invalid={suffixIsInvalid}
            aria-describedby={suffixIsInvalid
              ? "input-suffix-description input-suffix-error"
              : "input-suffix-description"}
          />
          <FieldDescription id="input-suffix-description">
            {t("parameterPicker.suffixDescription")}
          </FieldDescription>
          {suffixIsInvalid && (
            <FieldError id="input-suffix-error">
              {t("parameterPicker.invalidSuffix")}
            </FieldError>
          )}
        </Field>
        <Button>{t("parameterPicker.selectOutputFolder")}</Button>
      </FieldGroup>
      <div className="pt-100"></div>
      <Button onClick={() => setInputFiles(["1,", "2,", "3"])}>Test File Selection</Button>
      <Button onClick={() => setInputFiles([])}>Clear</Button>
    </div>
  );
}

export default ParameterPicker;
