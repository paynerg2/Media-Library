import React from 'react';
import { ItemContainer } from '../_components/ItemContainer';

export const getFilteredList = (
    items: any,
    searchTerm: string,
    route: string
) => {
    return searchTerm
        ? items.allIds
              .filter((id: string) =>
                  JSON.stringify(items.byId[id])
                      .toLocaleLowerCase()
                      .includes(searchTerm.toLocaleLowerCase())
              )
              .map((id: string) => (
                  <ItemContainer
                      key={id}
                      id={id}
                      item={items.byId[id]}
                      route={route}
                  />
              ))
        : items.allIds.map((id: string) => (
              <ItemContainer
                  key={id}
                  id={id}
                  item={items.byId[id]}
                  route={route}
              />
          ));
};
