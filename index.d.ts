declare module "ko-component-tester" {
    export function renderComponent(component: any, params?: any, bindingContext?: any):JQuery;
    export function renderHtml(component: any, params?: any, bindingContext?: any):JQuery;
}