const SermonFinderID = 'sermon-finder-widget';
// const StoredProcParams =
//     '@Service_Type=1&@Sermon_Link_Type_ID=6&@Sermon_Series_Type_ID=1';
     
const StoredProcParams =
    '@Service_Type=1&@Sermon_Link_Type_ID=6&@IncludeSeries=0&@IncludeCompilations=1&@Sermon_Link_Type_ID=1';

const actions = [
    {
        query: 'series',
        element: {
            id: 'series',
            event: {
                type: 'change',
                listener: async () => {
                    await updateWidget();
                },
            },
        },
    },

    {
        query: 'speaker',
        element: {
            id: 'speaker',
            event: {
                type: 'change',
                listener: async () => {
                    await updateWidget();
                },
            },
        },
    },

    {
        query: 'book',
        element: {
            id: 'book',
            event: {
                type: 'change',
                listener: async () => {
                    await updateWidget();
                },
            },
        },
    },

    {
        query: 'keyword',
        element: {
            id: 'keyword',
            event: {
                type: 'keydown',
                listener: async (event) => {
                    if (event.key == 'Enter') {
                        event.preventDefault();
                        await updateWidget();
                    }
                },
            },
        },
    },

    {
        element: {
            id: 'clear-filters',
            event: {
                type: 'click',
                listener: async () => {
                    if (clearFilterValues()) await updateWidget();
                },
            },
        },
    },
];

const getWidget = () => {
    return document.getElementById(SermonFinderID);
};

const setWidgetHidden = (hidden) => {
    getWidget().hidden = hidden;
};

const validateQueryParams = (queryParams) => {
    for (const queryParam of queryParams) {
        let valid = false;

        for (const action of actions) {
            if (action.query && queryParam[0].toLowerCase() == action.query)
                valid = true;
        }

        if (!valid) queryParams.delete(queryParam[0]);
    }

    return queryParams;
};

const getQueryParams = () => {
    let queryParams = new URLSearchParams(window.location.search);
    return validateQueryParams(queryParams);
};

const setQueryParams = (queryParams) => {
    let newURL =
        window.location.pathname + '?' + queryParams.toString().toLowerCase();
    window.history.pushState({}, '', newURL);
};

const updateQueryParams = () => {
    let queryParams = getQueryParams();

    for (let action of actions) {
        if (action.query) {
            if (action.element) {
                let filterElement = document.getElementById(action.element.id);

                if (filterElement) {
                    if (filterElement.value !== '') {
                        queryParams.set(
                            action.query,
                            filterElement.value.toLowerCase(),
                        );
                    } else {
                        queryParams.delete(action.query);
                    }
                }
            } else if (
                queryParams.get(action.query) == null
                && action.default
            ) {
                queryParams.set(action.query, action.default);
            }
        }
    }

    setQueryParams(queryParams);
};

const convertQueryToProcParams = (queryParams) => {
    let procParams = ``;

    for (let action of actions) {
        if (action.query) {
            let queryParam = queryParams.get(action.query);

            if (queryParam)
                procParams += `@${
                    action.procQuery || action.query
                }=${queryParam.toLowerCase()}&`;
        }
    }

    return StoredProcParams + '&' + procParams;
};

const updateProcParams = () => {
    let procParams = convertQueryToProcParams(getQueryParams());

    getWidget().setAttribute('data-params', procParams);
};

const updateFilterValues = () => {
    let queryParams = getQueryParams();

    for (let action of actions) {
        if (action.query && action.element) {
            let filterElement = document.getElementById(action.element.id);
            let queryParam = queryParams.get(action.query);

            if (filterElement) filterElement.value = queryParam || '';
        }
    }
};

const clearFilterValues = () => {
    let updated = false;

    for (let action of actions) {
        if (action.element) {
            let filterElement = document.getElementById(action.element.id);
            if (filterElement && filterElement.value !== '') {
                filterElement.value = '';
                updated = true;
            }
        }
    }

    if (getQueryParams().size > 0) updated = true;

    return updated;
};

const updateWidget = async () => {
    updateQueryParams();
    updateProcParams();

    setWidgetHidden(true);

    await window.ReInitWidget(SermonFinderID);
};

const initEventListeners = () => {
    for (let action of actions) {
        if (action.element && action.element.event) {
            let actionElement = document.getElementById(action.element.id);
            let actionEvent = action.element.event;

            if (actionElement) {
                actionElement.addEventListener(
                    actionEvent.type,
                    actionEvent.listener,
                );
            }
        }
    }
};

window.addEventListener('widgetLoaded', (event) => {
    if (event.detail.widgetId == SermonFinderID) {
        initEventListeners();
        updateFilterValues();

        setWidgetHidden(false);
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    await updateWidget();
});
