import React, {useCallback} from 'react';
import {PanelProps} from '@grafana/data';
import {SimpleOptions} from 'types';
import {css, cx} from '@emotion/css';
import {useStyles2} from '@grafana/ui';
import {FloorRenderer} from "./FloorRender";

interface Props extends PanelProps<SimpleOptions> {
}

const getStyles = () => {
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


export const SimplePanel: React.FC<Props> = ({options, data, width, height}) => {
    // const theme = useTheme2();
    const canvasRef = useCallback((node: HTMLCanvasElement) => {
        if (node && node as HTMLCanvasElement) {
            const floorRenderer = new FloorRenderer(node);
            floorRenderer.dpiFix(width, height);
        }
    }, [width, height])
    const styles = useStyles2(getStyles);
    return (
        <div>
            <canvas className={cx(styles.wrapper, css`width: ${width}px; height: ${height}px;`)} ref={canvasRef}/>
        </div>
    );
};
