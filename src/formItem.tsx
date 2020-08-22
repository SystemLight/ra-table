import React, {forwardRef, useImperativeHandle, useRef} from "react";
import {InputNumber} from "antd";

import {IRenderFormItem} from "./interface";

export const FInputNumber: IRenderFormItem = forwardRef(function ({id, value, onChange, save}, ref) {
    if (typeof value !== "number") {
        value = 0;
    }

    const inputRef = useRef<any>(null);

    useImperativeHandle(ref, () => {
        return {
            focus() {
                inputRef.current?.input.focus();
            }
        };
    }, []);

    const changeVal = (val: number | string | undefined) => {
        if (typeof val === "number") {
            onChange && onChange(val);
        }
    };

    return <InputNumber
        id={id} value={value} onChange={changeVal} onPressEnter={save} onBlur={save}
        ref={inputRef} size={"small"} style={{width: "100%"}}
    />;
});
