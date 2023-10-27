"use client";
import { PivotElement } from "./pivot";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

export default function Auth() {
  return (
    <FluentProvider theme={teamsLightTheme}>
      <PivotElement />
    </FluentProvider>
  );
}
