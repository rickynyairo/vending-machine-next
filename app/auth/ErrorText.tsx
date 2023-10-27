import React, { FC } from "react";
import {
  Text,
  makeStyles,
  tokens,
  shorthands
} from "@fluentui/react-components";
import { Warning20Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  error: {
    ...shorthands.margin(
      tokens.spacingVerticalSNudge,
      tokens.spacingHorizontalSNudge
    ),
    display: "flex",
    alignItems: "end",
    height: tokens.spacingVerticalL
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1
  },
  errorIcon: {
    color: tokens.colorPaletteRedForeground1,
    marginRight: tokens.spacingHorizontalSNudge
  }
});

interface ErrorTextProps {
  error: string | undefined;
  touched: boolean | undefined;
}

const ErrorText: FC<ErrorTextProps> = ({ error, touched }: ErrorTextProps) => {
  const c = useStyles();
  return (
    <span className={c.error}>
      {error && touched ? (
        <>
          <Warning20Regular className={c.errorIcon} />
          <Text className={c.errorText}>{error}</Text>
        </>
      ) : (
        <>
          <span />
        </>
      )}
    </span>
  );
};

export default ErrorText;
