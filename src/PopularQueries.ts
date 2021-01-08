import { Component, IComponentBindings, ComponentOptions, IQuerySuggestCompletion, IQuerySuggestRequest, SVGIcons } from 'coveo-search-ui';
import { lazyComponent } from '@coveops/turbo-core';

export interface IPopularQueriesOptions {
  /** The searchHub to be used to obtain the popular queries. (Default: 'default')*/
  searchHub: string;
  /** The pipeline to be used to obtain the popular queries.(Default: 'default') */
  pipeline: string;
  /** The maximum number of popular queries to show. (Default: 5) */
  count: number;
  /** The title to put in the container. (Default: 'Popular Queries') */
  title: string;
}

@lazyComponent
export class PopularQueries extends Component {
  static ID = 'PopularQueries';

  static SVG_ICON_HTML = '<svg focusable="false" enable-background="new 0 0 20 20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Search"><title>Search</title><g fill="currentColor"><path class="coveo-magnifier-circle-svg" d="m8.368 16.736c-4.614 0-8.368-3.754-8.368-8.368s3.754-8.368 8.368-8.368 8.368 3.754 8.368 8.368-3.754 8.368-8.368 8.368m0-14.161c-3.195 0-5.793 2.599-5.793 5.793s2.599 5.793 5.793 5.793 5.793-2.599 5.793-5.793-2.599-5.793-5.793-5.793"/><path d="m18.713 20c-.329 0-.659-.126-.91-.377l-4.552-4.551c-.503-.503-.503-1.318 0-1.82.503-.503 1.318-.503 1.82 0l4.552 4.551c.503.503.503 1.318 0 1.82-.252.251-.581.377-.91.377"/></g>s</svg>'

  static options: IPopularQueriesOptions = {
    searchHub: ComponentOptions.buildStringOption({ defaultValue: 'default' }),
    pipeline: ComponentOptions.buildStringOption({ defaultValue: 'default' }),
    count: ComponentOptions.buildNumberOption({ defaultValue: 5 }),
    title: ComponentOptions.buildStringOption({ defaultValue: 'Popular Queries' })
  };

  private completions: IQuerySuggestCompletion[] = [];

  constructor(public element: HTMLElement, public options: IPopularQueriesOptions, public bindings: IComponentBindings) {
    super(element, PopularQueries.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, PopularQueries, options);
    this.init();
  }

  public async getPopularQueries() {
    const payload: IQuerySuggestRequest = {
      q: '',
      searchHub: this.options.searchHub,
      pipeline: this.options.pipeline,
      count: this.options.count
    };

    const results = await this.queryController.getEndpoint().getQuerySuggest(payload);
    this.logger.debug(`Retrieved the following data: ${results}`);
    console.log(`Retrieved the following data: ${JSON.stringify(results)}`);
    this.completions = results.completions;
  }

  public init() {
    this.getPopularQueries().then(() => this.buildComponent());
  }

  private buildResult(value: string) {
    const resultFrame = Coveo.$$('div', { 'className': 'coveo-result-frame' });
    const resultRow = Coveo.$$('div', { 'className': 'coveo-result-row' });
    const resultCellSvg = Coveo.$$('div', { 'className': 'coveo-result-cell coveo-popular-queries-icon' });
    const resultCellLink = Coveo.$$('div', { 'className': 'coveo-result-cell coveo-popular-queries-result' })
    const link = Coveo.$$('a', {
      href: '#'
    }, value);
    link.on('click', e => {
      e.preventDefault();
      this.changeQuery(value);
    });

    resultCellSvg.el.innerHTML = PopularQueries.SVG_ICON_HTML;
    resultCellLink.append(link.el);

    resultRow.append(resultCellSvg.el);
    resultRow.append(resultCellLink.el);

    resultFrame.append(resultRow.el);

    return resultFrame;
  }


  private changeQuery(query: string) {
    Coveo.state(this.root, 'q', query);
    Coveo.executeQuery(this.root);
  }

  private buildContainer() {
    const container = Coveo.$$('div', { 'className': 'coveo-popular-queries-container' });
    return container;
  }

  private buildHeader() {
    const header = Coveo.$$('div', { 'className': 'coveo-recommendation-header' });
    header.append(Coveo.$$('div', { 'className': 'coveo-recommendation-title' }, this.options.title).el);
    return header;
  }

  private buildComponent() {

    const container = this.buildContainer();
    const header = this.buildHeader();
    container.el.append(header.el);
    for (const completion of this.completions) {
      container.append(this.buildResult(completion.expression).el);
    }

    this.element.append(container.el);
  }



}