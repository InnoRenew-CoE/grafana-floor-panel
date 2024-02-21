declare module 'react-svelte' {
    type SvelteComponent = {}
    export interface SvelteComponentProps<T extends SvelteComponent> {
        component: new (options: { target: Element }) => T;
        props?: Record<string, any>;
    }

    export default function SvelteComponentWrapper<T extends SvelteComponent>(
        props: SvelteComponentProps<T>
    ): JSX.Element;
}
