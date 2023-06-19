import { createParser } from "@adifkz/exp-p";

const parser = createParser({});

parser.setFunctions({
  is_email: (value: any) => {
    try {
      return value?.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
    } catch (error) {
      return false;
    }
  },
  is_html_empty: (value: any) => {
    try {
      if (!value) return true;
      if (value === "<div></div>") return true;
      if (value === "<span></span>") return true;
      return false;
    } catch (error) {
      return false;
    }
  },
});

export const parserV2 = parser;