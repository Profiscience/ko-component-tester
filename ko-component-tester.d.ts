/// <reference types="jquery" />

interface KoComponentTesterElement extends JQuery {
    dispose();
    find(selector: string): KoComponentTesterElement;
    find(element: Element): KoComponentTesterElement;
    find(obj: JQuery): KoComponentTesterElement;
    getComponentParams(): any;
    simulate(event: string, value?: any);
    waitForBinding(bindingName: string): Promise<any>;
    waitForProperty(propertyName: string): Promise<any>;
}

declare module 'ko-component-tester' {
    export function renderComponent(component: { template: string, viewModel }, params?: any, bindingContext?: any): KoComponentTesterElement;
    export function renderHtml(options: { template: string, viewModel }): KoComponentTesterElement;
}
