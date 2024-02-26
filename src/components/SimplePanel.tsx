import React, {useCallback} from 'react';
import {colorManipulator, FieldColorModeId, fieldColorModeRegistry, PanelProps} from '@grafana/data';
import {SimpleOptions} from 'types';
import {css, cx} from '@emotion/css';
import {useStyles2, useTheme2} from '@grafana/ui';
import {FloorRenderer} from "./FloorRender";
import {CanvasElement, Room} from "../@types/Graphics";

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


export const SimplePanel: React.FC<Props> = ({currentOptions, options, data, width, height, fieldConfig, onFieldConfigChange}) => {
    const fieldColor = fieldConfig.defaults.color || {mode: FieldColorModeId.ContinuousGrYlRd};
    const fieldColorMode = fieldColorModeRegistry.get(fieldColor.mode);

    let colors = ["green", "orange", "yellow"]
    if (fieldColorMode.getColors) {
        colors = fieldColorMode.getColors(useTheme2());
    } else {
        const color = useTheme2().visualization.getColorByName(fieldColor.fixedColor!)
        colors = [color, colorManipulator.asHexString(colorManipulator.lighten(color, 0.5))];
    }
    const canvasRef = useCallback((node: HTMLCanvasElement) => {
        if (node && node as HTMLCanvasElement) {
            const floorRenderer = new FloorRenderer(node);
            floorRenderer.dpiFix(width, height);
            const data = JSON.parse<{ rooms: Room[], objects: CanvasElement[] }>(options["json"]);
            floorRenderer.rooms = data.rooms;
            floorRenderer.objects = data.objects;
            floorRenderer.canvasOffset = floorRenderer.centerPosition
            floorRenderer.redraw()
            floorRenderer.setColors(colors);
        }
    }, [width, height, colors, options])
    const styles = useStyles2(getStyles);

    return (
        <div>
            <canvas className={cx(styles.wrapper, css`width: ${width}px; height: ${height}px;`)} ref={canvasRef}/>
        </div>
    );
};
