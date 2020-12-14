import { Component, IComponentBindings, ComponentOptions } from 'coveo-search-ui';
import { lazyComponent } from '@coveops/turbo-core';

export interface IPopularQueriesOptions {}

@lazyComponent
export class PopularQueries extends Component {
    static ID = 'PopularQueries';
    static options: IPopularQueriesOptions = {};

    constructor(public element: HTMLElement, public options: IPopularQueriesOptions, public bindings: IComponentBindings) {
        super(element, PopularQueries.ID, bindings);
        this.options = ComponentOptions.initComponentOptions(element, PopularQueries, options);
    }
}