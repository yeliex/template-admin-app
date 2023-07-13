import { type ComponentType } from 'react';

const withHOCs = <P = {}>(hocs: Array<(Component: ComponentType<P>) => ComponentType<P>>) =>
    (Component: ComponentType<P>): ComponentType<P> => {
        let component = Component;

        hocs.reverse().forEach((hoc) => {
            component = hoc(component);
        });

        return component;
    };

export default withHOCs;
