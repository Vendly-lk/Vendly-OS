import React, { PropsWithChildren, createContext, useContext } from 'react';

export type Route = 'home' | 'signin';

type NavValue = { route: Route; navigate: (route: Route) => void };

const NavCtx = createContext<NavValue>({ route: 'home', navigate: () => {} });

export function NavigationProvider({ children, value }: PropsWithChildren<{ value: NavValue }>) {
  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>;
}

export function useNavigation(): NavValue {
  return useContext(NavCtx);
}
