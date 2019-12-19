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
              .map((id: string) => items.byId[id])
              .sort((a: any, b: any) => a.title.localeCompare(b.title))
              .map((item: any) => (
                  <ItemContainer
                      key={item._id}
                      id={item._id}
                      item={item}
                      route={route}
                  />
              ))
        : items.allIds
              .map((id: string) => items.byId[id])
              .sort((a: any, b: any) => a.title.localeCompare(b.title))
              .map((item: any) => (
                  <ItemContainer
                      key={item._id}
                      id={item._id}
                      item={item}
                      route={route}
                  />
              ));
};
