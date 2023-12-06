import type { ChangeEvent } from 'react';
import type { FieldElement } from 'react-hook-form';
import type { ControllerRenderProps } from 'react-hook-form/dist/types/controller';

export const trimWhitespace = (value: string | undefined) => value?.trim();

const isNullOrUndefined = (value: unknown): value is null | undefined => value == null;

const isDateObject = (value: unknown): value is Date => value instanceof Date;

const isObjectType = (value: unknown) => typeof value === 'object';

const isObject = <T extends object>(value: unknown): value is T =>
    !isNullOrUndefined(value) &&
    !Array.isArray(value) &&
    isObjectType(value) &&
    !isDateObject(value);

const isCheckBoxInput = (element: FieldElement): element is HTMLInputElement =>
    element.type === 'checkbox';

const getEventValue = (event: unknown) =>
    isObject(event) && (event as ChangeEvent<HTMLInputElement>).target
        ? isCheckBoxInput((event as ChangeEvent<HTMLInputElement>).target)
            ? (event as ChangeEvent<HTMLInputElement>).target.checked
            : (event as ChangeEvent<HTMLInputElement>).target.value
        : event;

export const changeTrimWhitespace = <T extends ControllerRenderProps['onChange']>(onChange: T) => {
    return (event: any) => {
        let value = getEventValue(event);

        if (typeof value === 'string') {
            value = value.trim();
        }

        return onChange(value as any);
    };
};

const MOBILE_REGEXP = /^1\d{10}$/;

export const mobileValidator = (value: string | undefined) => {
    if (!value) {
        return true;
    }

    return MOBILE_REGEXP.test(value) || '请输入正确的手机号码';
};
