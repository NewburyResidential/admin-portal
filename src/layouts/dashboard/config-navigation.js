'use client';

import { useMemo } from 'react';
import Iconify from 'src/components/iconify';
import { navConfiguration } from './navConfiguration';

const icon = (iconName) => <Iconify icon={iconName} sx={{ width: 1, height: 1 }} />;

export function useNavData() {
  const navDataWithIcons = useMemo(() => {
    return navConfiguration.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        icon: icon(item.icon),
        children: item.children
          ? item.children.map((child) => ({
              ...child,
            }))
          : undefined,
      })),
    }));
  }, []);

  return navDataWithIcons;
}
