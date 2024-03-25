import {css} from "@emotion/css";

export const getStyles = () => {
    return {
        wrapper: css`
      font-family: Open Sans;
      position: relative;
    `,
        svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
        textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
    };
};